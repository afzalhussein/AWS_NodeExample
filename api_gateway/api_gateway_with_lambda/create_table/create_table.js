const AWS = require('aws-sdk');
const fs = require('fs');
const path = require('path');

const tableName = "Pets";

// Configure AWS
AWS.config.update({
  accessKeyId: 'INSERT_KEY_ID',
  secretAccessKey: 'INSERT_SECRET',
  region: 'INSERT_REGION'
});

const client = new AWS.DynamoDB();
const docClient = new AWS.DynamoDB.DocumentClient();

//
// List current tables
//
client.listTables({}, function(err, data) {
  if (err) console.log(err, err.stack); // an error occurred
  else {
    console.log("> Current tables");
    data.TableNames.forEach(function(table) {
      console.log("    " + table);
    });
    console.log("");
    
    // Create table after listing current tables
    createTable();
  }
});

//
// Create table
//
function createTable() {
  console.log("> Creating table");
  const params = {
    AttributeDefinitions: [{ AttributeName: 'id', AttributeType: 'N' }],
    TableName: tableName,
    KeySchema: [{ AttributeName: 'id', KeyType: 'HASH' }],
    ProvisionedThroughput: { ReadCapacityUnits: 5, WriteCapacityUnits: 5 },
    SSESpecification: { Enabled: false }
  };
  
  client.createTable(params, function(err, data) {
    if (err) console.log(err, err.stack); // an error occurred
    else {
      console.log("    Created table ARN: " + data.TableDescription.TableArn + "\n");
      
      // Wait for table to be ACTIVE
      waitForTableActive();
    }
  });
}

//
// Wait for table to be ACTIVE
//
function waitForTableActive() {
  console.log("> Waiting for table state: ACTIVE");
  let checkCount = 0;
  
  const checkTableStatus = setInterval(() => {
    client.describeTable({ TableName: tableName }, function(err, data) {
      if (err) {
        console.log(err, err.stack); // an error occurred
        clearInterval(checkTableStatus);
      } else {
        const state = data.Table.TableStatus;
        console.log("    Check " + checkCount + ": " + state);
        if (state === "ACTIVE" || checkCount >= 15) {
          clearInterval(checkTableStatus);
          if (state === "ACTIVE") {
            loadData();
          }
        }
        checkCount++;
      }
    });
  }, 1000);
}

//
// Load data from json file
//
function loadData() {
  console.log("> Loading data from pets.json");
  const pets = JSON.parse(fs.readFileSync(path.join(__dirname, 'pets.json'), 'utf8'));
  console.log("  Loaded " + pets.length + " from file.");
  
  // Insert data into DynamoDB
  insertData(pets);
}

//
// Loop through input data and put to ddb
//
function insertData(pets) {
  console.log("\n> Inserting data");
  const batchWrite = (pets, callback) => {
    const params = {
      RequestItems: {
        [tableName]: pets.map(pet => ({
          PutRequest: {
            Item: {
              id: { N: String(pet.id) },
              type: { S: pet.type },
              breed: { S: pet.breed },
              price: { N: String(pet.price) }
            }
          }
        }))
      }
    };

    docClient.batchWrite(params, function(err, data) {
      if (err) console.log(err, err.stack); // an error occurred
      else console.log("Batch write success", data); // successful response
      if (callback) callback();
    });
  };

  const chunks = [];
  while (pets.length) {
    chunks.push(pets.splice(0, 25));
  }

  let index = 0;
  const next = () => {
    if (index < chunks.length) {
      console.log("  Adding batch " + (index + 1));
      batchWrite(chunks[index], next);
      index++;
    } else {
      console.log("\nDone\n");
    }
  };

  next();
}
