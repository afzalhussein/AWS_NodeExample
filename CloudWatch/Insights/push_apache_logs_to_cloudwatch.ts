import * as AWS from '@aws-sdk/client-cloudwatch-logs';
import * as fs from 'fs';
import * as process from 'process';
import { readFile } from 'fs/promises';

const logGroupName = "ApacheLogsInsightsDemo";
const logStreamNamePrefix = "ApacheLogs_Stream";

interface Settings {
    aws_access_key_id: string;
    aws_secret_access_key: string;
    aws_region: string;
}

async function loadSettings(): Promise<Settings> {
    const data = await readFile('config.json', 'utf-8');
    return JSON.parse(data);
}

async function main() {
    const settings = await loadSettings();

    if (settings.aws_access_key_id === "INSERT_KEY_ID") {
        console.error("ERROR: You have not configured your access and secret key in config.json");
        process.exit(1);
    }

    const logsClient = new AWS.CloudWatchLogs({
        credentials: {
            accessKeyId: settings.aws_access_key_id,
            secretAccessKey: settings.aws_secret_access_key,
        },
        region: settings.aws_region,
    });

    let keepGoing = true;

    process.on('SIGINT', () => {
        console.log('Exiting...');
        keepGoing = false;
    });

    console.log("Current Log Groups:");
    const describeResponse = await logsClient.describeLogGroups({
        limit: 25
    });

    console.log(`You have ${describeResponse.logGroups?.length} log groups created.\nGroups:`);
    console.log(describeResponse.logGroups);

    let logGroupExists = false;
    if (describeResponse.logGroups) {
        logGroupExists = describeResponse.logGroups.some(group => group.logGroupName === logGroupName);
    }

    if (!logGroupExists) {
        console.log("Creating log group.");
        const createGroupResponse = await logsClient.createLogGroup({ logGroupName });
        console.log("\nCreate log group response:");
        console.log(createGroupResponse);
    } else {
        console.log("\nLog group already exists, not creating.");
    }

    const epoch = Math.floor(Date.now() / 1000);
    const logStreamName = `${logStreamNamePrefix}_${epoch}`;

    console.log("\nCreating log stream.");
    const createStreamResponse = await logsClient.createLogStream({
        logGroupName,
        logStreamName
    });
    console.log("Create log stream response: ");
    console.log(createStreamResponse);

    let nextSequenceToken: string | undefined = undefined;

    const initResponse = await logsClient.putLogEvents({
        logGroupName,
        logStreamName,
        logEvents: [{
            timestamp: Date.now(),
            message: "Init stream"
        }]
    });

    if (initResponse.nextSequenceToken) {
        nextSequenceToken = initResponse.nextSequenceToken;
        console.log("set next_sequence_token to " + nextSequenceToken);
    } else {
        console.error("Didn't get sequence token from initial put log event...");
        process.exit(1);
    }

    const logFile = fs.readFileSync('apache.log', 'utf-8');
    const logLines = logFile.split('\n');

    console.log("\nPutting log events");
    let count = 0;
    for (const line of logLines) {
        if (!keepGoing) {
            break;
        }

        const logMessage = line;
        console.log("\nlogging message: " + logMessage);

        const putResponse = await logsClient.putLogEvents({
            logGroupName,
            logStreamName,
            sequenceToken: nextSequenceToken,
            logEvents: [{
                timestamp: Date.now(),
                message: logMessage
            }]
        });

        console.log("response from put_log_events:");
        console.log(putResponse);

        if (putResponse.nextSequenceToken) {
            nextSequenceToken = putResponse.nextSequenceToken;
            console.log("set next_sequence_token to " + nextSequenceToken);
        } else {
            console.error("Failed to extract next_sequence_token, exiting.");
            keepGoing = false;
        }

        count += 1;
    }
}

main().catch(error => {
    console.error("Error occurred:", error);
});
