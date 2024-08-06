const AWS = require('aws-sdk');
const fs = require('fs');
const readline = require('readline');

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
      const createResponse = await logsClient.createLogGroup({ logGroupName });
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

async function putLogEvents(logStreamName, nextSequenceToken) {
  try {
    console.log("\nPutting log events, once per second");
    let count = 0;
    while (keepGoing) {
      const logMessage = `this is log message ${count}`;
      console.log(`\nLogging message: ${logMessage}`);
      
      const timestamp = new Date().getTime();
      const response = await logsClient.putLogEvents({
        logGroupName,
        logStreamName,
        sequenceToken: nextSequenceToken,
        logEvents: [
          {
            timestamp,
            message: logMessage
          }
        ]
      }).promise();

      console.log("Response from putLogEvents:");
      console.log(response);

      if (response.nextSequenceToken) {
        nextSequenceToken = response.nextSequenceToken;
        console.log(`Set next_sequence_token to ${nextSequenceToken}`);
        await new Promise(resolve => setTimeout(resolve, 1000)); // Sleep for 1 second
      } else {
        console.error("Failed to extract next_sequence_token, exiting.");
        keepGoing = false;
      }

      count++;
    }
  } catch (err) {
    console.error("Error in putting log events:", err);
    process.exit(1);
  }
}

async function init() {
  await createLogGroupIfNotExists();
  const logStreamName = await createLogStream();
  let nextSequenceToken;

  // Initial log event to get the sequence token
  try {
    const initResponse = await logsClient.putLogEvents({
      logGroupName,
      logStreamName,
      logEvents: [
        {
          timestamp: new Date().getTime(),
          message: "Init stream"
        }
      ]
    }).promise();

    if (initResponse.nextSequenceToken) {
      nextSequenceToken = initResponse.nextSequenceToken;
      console.log(`Set next_sequence_token to ${nextSequenceToken}`);
    } else {
      console.error("Didn't get sequence token from initial put log event...");
      process.exit(1);
    }

    await putLogEvents(logStreamName, nextSequenceToken);
  } catch (err) {
    console.error("Error in initializing:", err);
    process.exit(1);
  }
}

init();
