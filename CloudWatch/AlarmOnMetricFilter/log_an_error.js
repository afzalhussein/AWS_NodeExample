const AWS = require('aws-sdk');
const fs = require('fs');
const process = require('process');

const logGroupName = "ADGU_LG";
const logStreamNamePrefix = "ADGU_Stream";

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
      logGroupNamePrefix: 'ADGU',
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

async function sendErrorMessage(logStreamName) {
  try {
    console.log("\nSending an ERROR message");
    const timestamp = new Date().getTime();
    const response = await logsClient.putLogEvents({
      logGroupName,
      logStreamName,
      logEvents: [
        {
          timestamp,
          message: "ERROR: Danger, Will Robinson"
        }
      ]
    }).promise();

    console.log(response);
  } catch (err) {
    console.error("Error in sending error message:", err);
    process.exit(1);
  }
}

async function init() {
  await createLogGroupIfNotExists();
  const logStreamName = await createLogStream();
  await sendErrorMessage(logStreamName);
}

init();
