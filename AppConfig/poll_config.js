// Import the required AWS SDK clients and commands
const { AppConfigDataClient, StartConfigurationSessionCommand, GetLatestConfigurationCommand } = require("@aws-sdk/client-appconfigdata");
const { sleep } = require('sleep'); // You may need to install this package or use a different sleep function
const util = require('util');

// AWS Configuration
const appId = "INSERT_APPLICATION_ID";
const envId = "INSERT_ENVIRONMENT_ID";
const profId = "INSERT_PROFILE_ID";
const awsConfig = {
    region: 'INSERT_REGION',
    credentials: {
        accessKeyId: 'INSERT_ACCESS',
        secretAccessKey: 'INSERT_SECRET'
    }
};

// Create an AppConfigDataClient instance
const client = new AppConfigDataClient(awsConfig);

let token;
let sleepDur = 60;

async function startConfigurationSession() {
    try {
        const command = new StartConfigurationSessionCommand({
            ApplicationIdentifier: appId,
            EnvironmentIdentifier: envId,
            ConfigurationProfileIdentifier: profId
        });

        const response = await client.send(command);
        token = response.InitialConfigurationToken;
        sleepDur = 60;

        console.log(`InitialConfigurationToken:\n${token}\n`);
        await getConfiguration();
    } catch (error) {
        console.error("Error starting configuration session:", error);
    }
}

async function getConfiguration() {
    try {
        const command = new GetLatestConfigurationCommand({
            ConfigurationToken: token
        });

        const response = await client.send(command);
        token = response.NextPollConfigurationToken;
        sleepDur = response.NextPollIntervalInSeconds;

        console.log(`New token:\n${token}\n`);
        console.log(`sleep_dur:\n${sleepDur}\n`);
        console.log(`Configuration:\n${util.inspect(response.Configuration)}\n`);

    } catch (error) {
        console.error("Error getting configuration:", error);
    }
}

async function main() {
    await startConfigurationSession();

    while (true) {
        await getConfiguration();
        console.log(`Sleeping for ${sleepDur} seconds`);

        let remainingSleep = sleepDur;
        while (remainingSleep > 0) {
            console.log(remainingSleep);
            await new Promise(resolve => setTimeout(resolve, 5000)); // sleep for 5 seconds
            remainingSleep -= 5;
        }
    }
}

main();
