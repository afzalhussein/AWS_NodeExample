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
