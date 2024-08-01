# AWS_NodeExample

## Dependencies

`npm i`

## Settings

Use a separate file to save AWS configuration, e.g. `configs.json`

## Execute

`node app.js`

Output:
If no configuration keys are provided:
`ERROR: You have not configured your access and secret key in config.json`

If configured:
`Total Reservations: No of Reservations`
`Name: name Pub. IP: publicIp`

## lambda_crud.js

This will be triggered using lambda proxy integration with REST API Gateway

## create_table.js

The pets table with data from `pets.json`

## pets.json

Data file to load data into pets table. Used by `create_table.js`

## delete_table.sh

Delete table shell script

## API Create

After login to AWS  Console, choose APIs, Create. Choose Protocol (+REST, Websocket). Create new API Choose (New API, Clone from existing API, +Import from Swagger or Open API 3, Example API). In Import from Swagger or Open API 3, paste the definition file `example_api_default_swagger.json`. Leave Endpoint Type as Regional. Click Select Swagger File to select the file.
