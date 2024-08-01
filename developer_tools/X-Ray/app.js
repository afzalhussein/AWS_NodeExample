const express = require('express');
const bodyParser = require('body-parser');
const AWSXRay = require('aws-xray-sdk');
const winston = require('winston');
const AWS = require('aws-sdk');
const { check, validationResult } = require('express-validator');

// Configure logger
AWSXRay.setLogger(winston);
AWSXRay.captureAWS(require('aws-sdk'));

const app = express();
const port = process.env.PORT || 8080;
const region = process.env.AWS_REGION || 'us-east-2';
const sqsQueueURL = process.env.SQS_QUEUE_URL || "https://sqs.us-east-2.amazonaws.com/146868985163/xrayQueue";

if (!sqsQueueURL) {
  console.error("Please specify the SQS_QUEUE_URL environment variable. Exiting.");
  process.exit(1);
}

const sqs = new AWS.SQS({ region });

// Middleware
app.use(AWSXRay.express.openSegment('ADGUApp'));
app.use(bodyParser.json());
app.use((req, res, next) => {
  console.log(`> ${req.method} ${req.url}`);
  next();
});

console.log("> NOTE: this application requires an EC2 role that permits X-Ray, SNS, and SQS");

// Routes
app.get('/', (req, res) => {
  res.json({ error: '', result: '' });
});

app.post('/', [
  check('count').isNumeric().withMessage('count must be a number')
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ error: errors.array(), result: '' });
  }

  const { count } = req.body;
  console.log(`> Received POST with data: ${JSON.stringify(req.body)}`);

  const response = { error: '', result: `You sent count: ${count}` };
  pushToSQS(req.body)
    .then(() => res.json(response))
    .catch(err => res.status(500).json({ error: 'Failed to push to SQS', result: '' }));
});

// Function to push data to SQS
function pushToSQS(data) {
  return new Promise((resolve, reject) => {
    const params = {
      MessageBody: JSON.stringify(data),
      QueueUrl: sqsQueueURL,
      DelaySeconds: 0,
      MessageAttributes: {
        'epochms': {
          DataType: 'Number',
          StringValue: String(Date.now())
        }
      }
    };

    sqs.sendMessage(params, (err, data) => {
      if (err) {
        console.error("Error sending SQS message:", JSON.stringify(err));
        reject(err);
      } else {
        console.log("Pushed to SQS");
        resolve(data);
      }
    });
  });
}

// Close segment
app.use(AWSXRay.express.closeSegment());

// Start server
app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
