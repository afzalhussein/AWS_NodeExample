const AWS = require('aws-sdk');
const tableName = "AppSyncCar";

// AWS Configuration
const config = {
  accessKeyId: 'INSERT_KEY_ID',
  secretAccessKey: 'INSERT_SECRET',
  region: 'INSERT_REGION'
};

// Initialize the DynamoDB client
const client = new AWS.DynamoDB(config);

// List current tables
async function listTables() {
  try {
    const tables = await client.listTables().promise();
    console.log("\n> Current tables:");
    tables.TableNames.forEach(table => console.log(`    ${table}`));
  } catch (error) {
    console.error("Error listing tables:", error);
  }
}

// Create table
async function createTable() {
  const params = {
    AttributeDefinitions: [{ AttributeName: 'id', AttributeType: 'N' }],
    TableName: tableName,
    KeySchema: [{ AttributeName: 'id', KeyType: 'HASH' }],
    ProvisionedThroughput: { ReadCapacityUnits: 1, WriteCapacityUnits: 1 },
    SSESpecification: { Enabled: false }
  };

  try {
    const response = await client.createTable(params).promise();
    console.log(`> Created table ARN: ${response.TableDescription.TableArn}\n`);
  } catch (error) {
    console.error("Error creating table:", error);
  }
}

// Wait for table to be ACTIVE
async function waitForTableActive() {
  let attempts = 0;
  const maxAttempts = 15;

  while (attempts < maxAttempts) {
    try {
      const tableState = await client.describeTable({ TableName: tableName }).promise();
      const state = tableState.Table.TableStatus;
      console.log(`    Check ${attempts}: ${state}`);
      if (state === "ACTIVE") break;
      attempts += 1;
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (error) {
      console.error("Error describing table:", error);
    }
  }
}

// Insert one item into the table
async function insertItem() {
  const item = {
    'id': { N: "1" },
    'make': { S: "Mazda" },
    'model': { S: "RX-7" },
    'year': { N: "1982" }
  };

  try {
    console.log(`\n> Inserting 1 item into ${tableName}`);
    console.log(`    The item:\n    ${JSON.stringify(item, null, 2)}`);
    await client.putItem({ TableName: tableName, Item: item }).promise();
  } catch (error) {
    console.error("Error inserting item:", error);
  }
}

// Scan table for count
async function scanTable() {
  try {
    const data = await client.scan({ TableName: tableName }).promise();
    console.log(`\n> Scanning table for count`);
    console.log(`    ${data.Count} item(s) in the new table:`);
    data.Items.forEach(item => console.log(`    ${JSON.stringify(item, null, 2)}`));
  } catch (error) {
    console.error("Error scanning table:", error);
  }
}

// Execute the operations sequentially
async function main() {
  await listTables();
  await createTable();
  await waitForTableActive();
  await insertItem();
  await scanTable();
}

main().catch(error => console.error("Error in main execution:", error));
