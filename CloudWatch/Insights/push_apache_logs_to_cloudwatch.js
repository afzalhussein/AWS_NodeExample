const AWS = require('aws-sdk');
const fs = require('fs');
const process = require('process');

const logGroupName = "ApacheLogsInsightsDemo";
const logStreamNamePrefix = "ApacheLogs_Stream";

let settings;
try {
  settings = JSON.parse(fs.readFileSync('config.json'));
} catch (err) {
  console.error("ERROR: Failed to read or parse config.json");
  console.error(err);
  process.exit(1);
}

if (settings.aws_access_key_id === "INSERT_KEY_ID") {
  console.error("ERROR: You have not configured your access and secret key in config.json");
  process.exit(1);
}

const logsClient = new AWS.CloudWatchLogs({
  accessKeyId: settings.aws_access_key_id,
  secretAccessKey: settings.aws_secret_access_key,
  region: settings.aws_region
});

let keepGoing = true;

process.on('SIGINT', () => {
  console.log('Exiting...');
  keepGoing = false;
});

async function createLogGroupIfNotExists() {
  try {
    console.log("Current Log Groups:");
    const response = await logsClient.describeLogGroups({
      limit: 25
    }).promise();

    console.log(`You have ${response.logGroups.length} log groups created.`);
    console.log("Groups:");
    console.log(response.logGroups);

    const logGroupExists = response.logGroups.some(item => item.logGroupName === logGroupName);

    if (!logGroupExists) {
      console.log("Creating log group.");
      const createResponse = await logsClient.createLogGroup({ logGroupName }).promise();
      console.log("\nCreate log group response:");
      console.log(createResponse);
    } else {
      console.log("\nLog group already exists, not creating.");
    }
  } catch (err) {
    console.error("Error in creating or checking log group:", err);
    process.exit(1);
  }
}

async function createLogStream() {
  try {
    const epoch = Math.floor(Date.now() / 1000);
    const logStreamName = `${logStreamNamePrefix}_${epoch}`;

    console.log("\nCreating log stream.");
    const response = await logsClient.createLogStream({
      logGroupName,
      logStreamName
    }).promise();

    console.log("Create log stream response:");
    console.log(response);
    return logStreamName;
  } catch (err) {
    console.error("Error in creating log stream:", err);
    process.exit(1);
  }
}

async function sendInitialLogEvent(logStreamName) {
  try {
    const timestamp = Date.now();
    const response = await logsClient.putLogEvents({
      logGroupName,
      logStreamName,
      logEvents: [
        {
          timestamp,
          message: "Init stream"
        }
      ]
    }).promise();

    if (response.nextSequenceToken) {
      console.log("set next_sequence_token to " + response.nextSequenceToken);
      return response.nextSequenceToken;
    } else {
      console.error("Didn't get sequence token from initial put log event...");
      process.exit(1);
    }
  } catch (err) {
    console.error("Error in sending initial log event:", err);
    process.exit(1);
  }
}

async function pushLogEvents(logStreamName, nextSequenceToken) {
  try {
    const logLines = fs.readFileSync('apache.log', 'utf-8').split('\n');
    console.log("\nPutting log events");
    for (let line of logLines) {
      if (!keepGoing) break;

      const timestamp = Date.now();
      const response = await logsClient.putLogEvents({
        logGroupName,
        logStreamName,
        sequenceToken: nextSequenceToken,
        logEvents: [
          {
            timestamp,
            message: line
          }
        ]
      }).promise();

      console.log("response from put_log_events:");
      console.log(response);

      if (response.nextSequenceToken) {
        nextSequenceToken = response.nextSequenceToken;
        console.log("set next_sequence_token to " + nextSequenceToken);
      } else {
        console.error("Failed to extract next_sequence_token, exiting.");
        break;
      }
    }
  } catch (err) {
    console.error("Error in pushing log events:", err);
    process.exit(1);
  }
}

(async function init() {
  await createLogGroupIfNotExists();
  const logStreamName = await createLogStream();
  const nextSequenceToken = await sendInitialLogEvent(logStreamName);
  await pushLogEvents(logStreamName, nextSequenceToken);
})();
