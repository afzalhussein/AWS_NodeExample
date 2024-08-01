const AWS = require('aws-sdk');

AWS.config.update({
  region: process.env.AWS_REGION || "us-east-1"
});

const ddb = new AWS.DynamoDB({ region: process.env.DDB_REGION || "us-east-2" });
const docClient = new AWS.DynamoDB.DocumentClient({ region: process.env.DDB_REGION || "us-east-2" });

const tableName = process.env.TABLE_NAME || "Pets";

exports.handler = async (event, context, callback) => {
    try {
        let response;
        switch (event.httpMethod) {
            case 'GET':
                response = await getAllItems();
                break;
            case 'POST':
                response = await handlePost(event.body);
                break;
            default:
                response = createResponse(405, { error: "Unsupported method" });
        }
        callback(null, response);
    } catch (error) {
        console.error(error);
        callback(null, createResponse(500, { error: "Internal Server Error" }));
    }
};

const handlePost = async (body) => {
    try {
        const inputPet = JSON.parse(body);
        validatePet(inputPet);
        await putToDDB(inputPet);
        return createResponse(200, { result: "success" });
    } catch (error) {
        return createResponse(400, { error: "Malformed: " + error.message });
    }
};

const validatePet = (pet) => {
    if (!pet || !pet.id || !pet.type || !pet.breed || !pet.price) {
        throw new Error("Invalid input");
    }
};

const getAllItems = async () => {
    const params = {
        TableName: tableName,
        ProjectionExpression: "#id, #type, breed, price",
        FilterExpression: "#id > :zero",
        ExpressionAttributeNames: {
            "#id": "id",
            "#type": "type"
        },
        ExpressionAttributeValues: {
            ":zero": 0
        }
    };
    try {
        const data = await docClient.scan(params).promise();
        return createResponse(200, data.Items);
    } catch (error) {
        console.error("Unable to query. Error:", JSON.stringify(error, null, 2));
        return createResponse(500, { error: "Unable to query. Error: " + JSON.stringify(error) });
    }
};

const putToDDB = async (inputPet) => {
    const params = {
        TableName: tableName,
        Item: {
            'id': { N: String(inputPet.id) },
            'type': { S: inputPet.type },
            'breed': { S: inputPet.breed },
            'price': { N: String(inputPet.price) }
        }
    };
    try {
        await ddb.putItem(params).promise();
    } catch (error) {
        console.error("Put Error", error);
        throw new Error(JSON.stringify(error));
    }
};

const createResponse = (statusCode, body) => ({
    isBase64Encoded: false,
    statusCode,
    headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
    body: JSON.stringify(body)
});
