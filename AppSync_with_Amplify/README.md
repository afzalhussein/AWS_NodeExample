# AppSync
This uses an AppSync GraphQL API to front-end data query and manipulation ina a DDB table.

## Table creation

This requires a DDB table. The *create_table.js* script can be used to create the table.

```text
$ node create_table.js

> Current tables
    CarsNE1
    Olympics
    TestGlobal
    people
    student

> Creating table
    Created table ARN: arn:aws:dynamodb:us-east-2:146868985163:table/AppSyncTest

> Waiting for table state: ACTIVE
    Check 0: CREATING
    Check 1: CREATING
    Check 2: CREATING
    Check 3: CREATING
    Check 4: CREATING
    Check 5: ACTIVE

> Inserting 1 item into AppSyncTest
    The item:
    {"id": {"N": "1"}, "make": {"S": "Mazda"}, "model": {"S": "RX-7"}, "year": {"N": "1982"}}

> Scanning table for count
    1 item(s) in the new table:
    {"model": {"S": "RX-7"}, "year": {"N": "1982"}, "id": {"N": "1"}, "make": {"S": "Mazda"}}

$
```

## Amplify Installation

```text
$ sudo npm install -g @aws-amplify/cli
Password:

added 26 packages in 54s
```

## Amplify Init

```text
$ amplify init
Note: It is recommended to run this command from the root of your app directory
? Enter a name for the project app
The following configuration will be applied:

Project information
| Name: app
| Environment: dev
| Default editor: Visual Studio Code
| App type: javascript
| Javascript framework: none
| Source Directory Path: src
| Distribution Directory Path: dist
| Build Command: npm run-script build
| Start Command: npm run-script start

? Initialize the project with the above configuration? Yes
Using default provider  awscloudformation
? Select the authentication method you want to use: AWS access keys
? accessKeyId:  ********************
? secretAccessKey:  ****************************************
? region:  us-east-2
Adding backend environment dev to AWS Amplify app: d3b9q5l4d51am

Deployment completed.
Deploying root stack app [ ---------------------------------------- ] 0/4
    amplify-app-dev-203258         AWS::CloudFormation::Stack     CREATE_IN_PROGRESS             Mon Jun 05 2023 20:33:02…
    AuthRole                       AWS::IAM::Role                 CREATE_IN_PROGRESS             Mon Jun 05 2023 20:33:04…
    DeploymentBucket               AWS::S3::Bucket                CREATE_IN_PROGRESS             Mon Jun 05 2023 20:33:05…
    UnauthRole                     AWS::IAM::Role                 CREATE_IN_PROGRESS             Mon Jun 05 2023 20:33:05…

✔ Help improve Amplify CLI by sharing non sensitive configurations on failures (y/N) · no
Deployment state saved successfully.
✔ Initialized provider successfully.
✅ Initialized your environment successfully.

Your project has been successfully initialized and connected to the cloud!

Some next steps:
"amplify status" will show you what you've added already and if it's locally configured or deployed
"amplify add <category>" will allow you to add features like user login or a backend API
"amplify push" will build all your local backend resources and provision it in the cloud
"amplify console" to open the Amplify Console and view your project status
"amplify publish" will build all your local backend and frontend resources (if you have hosting category added) and provision it in the cloud

Pro tip:
Try "amplify add api" to create a backend API and then "amplify push" to deploy everything
$
```

## Amplify Add API

```text
$ amplify add codegen --apiId d6yopjippzbhjnrvhinp4xyely
✔ Getting API details
Browserslist: caniuse-lite is outdated. Please run:
  npx update-browserslist-db@latest
  Why you should do it regularly: https://github.com/browserslist/update-db#readme
Successfully added API TestAPI to your Amplify project
? Choose the code generation language target javascript
? Enter the file name pattern of graphql queries, mutations and subscriptions src/graphql/**/*.js
? Do you want to generate/update all possible GraphQL operations - queries, mutations and subscriptions Yes
? Enter maximum statement depth [increase from default if your schema is deeply nested] 2
✔ Downloaded the schema
✔ Generated GraphQL operations successfully and saved at src/graphql
$
```

## Amplify Codegen

```text
$ amplify codegen
✔ Downloaded the schema
✔ Generated GraphQL operations successfully and saved at src/graphql
$
```

## Full execution walkthrough

```text
$ node create_table.js
> Current tables
    CarsNE1
    Olympics
    TestGlobal
    people
    student

> Creating table
    Created table ARN: arn:aws:dynamodb:us-east-2:146868985163:table/AppSyncCar

> Waiting for table state: ACTIVE
    Check 0: CREATING
    Check 1: CREATING
    Check 2: CREATING
    Check 3: CREATING
    Check 4: ACTIVE

> Inserting 1 item into AppSyncCar
    The item:
    {"id": {"N": "1"}, "make": {"S": "Mazda"}, "model": {"S": "RX-7"}, "year": {"N": "1982"}}

> Scanning table for count
    1 item(s) in the new table:
    {"model": {"S": "RX-7"}, "year": {"N": "1982"}, "id": {"N": "1"}, "make": {"S": "Mazda"}}


* At this point an AppSync GraphQL API is created in the Web Console *

[nick@nuc AppSync_with_Amplify]$ cd app/
[nick@nuc app]$ sh init_commands.sh
>>>>>   Original working directory:  /home/nick/bb/awsdevassoc/AppSync_with_Amplify/app

>>>>>   Enter the API ID: tncjg5sikjbp5ojus554qftqay
>>>>>   API ID: tncjg5sikjbp5ojus554qftqay

>>>>>   Installing AWS Amplify CLI
>>>>>   sudo npm install -g @aws-amplify/cli
[sudo] password for nick:

changed 26 packages, and audited 27 packages in 21s

7 packages are looking for funding
  run `npm fund` for details

found 0 vulnerabilities

>>>>>   Creating temporary directory at /tmp/appsynctest
>>>>>   mkdir /tmp/appsynctest; cd /tmp/appsynctest

>>>>>   amplify init
Note: It is recommended to run this command from the root of your app directory
? Enter a name for the project appsynctest
The following configuration will be applied:

Project information
| Name: appsynctest
| Environment: dev
| Default editor: Visual Studio Code
| App type: javascript
| Javascript framework: none
| Source Directory Path: src
| Distribution Directory Path: dist
| Build Command: npm run-script build
| Start Command: npm run-script start

? Initialize the project with the above configuration? Yes
Using default provider  awscloudformation
? Select the authentication method you want to use: AWS access keys
? accessKeyId:  ********************
? secretAccessKey:  ****************************************
? region:  us-east-2
Adding backend environment dev to AWS Amplify app: d3pis841nwmq1m

Deployment completed.
Deploying root stack appsynctest [ ====================-------------------- ] 2/4
        amplify-appsynctest-dev-134131 AWS::CloudFormation::Stack     CREATE_IN_PROGRESS             Tue Jun 06 2023 13:42:53…
        UnauthRole                     AWS::IAM::Role                 CREATE_COMPLETE                Tue Jun 06 2023 13:43:08…
        AuthRole                       AWS::IAM::Role                 CREATE_COMPLETE                Tue Jun 06 2023 13:43:09…
        DeploymentBucket               AWS::S3::Bucket                CREATE_IN_PROGRESS             Tue Jun 06 2023 13:42:56…

✔ Help improve Amplify CLI by sharing non sensitive configurations on failures (y/N) · no
Deployment state saved successfully.
✔ Initialized provider successfully.
✅ Initialized your environment successfully.

Your project has been successfully initialized and connected to the cloud!

Some next steps:
"amplify status" will show you what you've added already and if it's locally configured or deployed
"amplify add <category>" will allow you to add features like user login or a backend API
"amplify push" will build all your local backend resources and provision it in the cloud
"amplify console" to open the Amplify Console and view your project status
"amplify publish" will build all your local backend and frontend resources (if you have hosting category added) and provision it in the cloud

Pro tip:
Try "amplify add api" to create a backend API and then "amplify push" to deploy everything


>>>>>   amplify add codegen --apiId tncjg5sikjbp5ojus554qftqay
✔ Getting API details
Browserslist: caniuse-lite is outdated. Please run:
  npx update-browserslist-db@latest
  Why you should do it regularly: https://github.com/browserslist/update-db#readme
Successfully added API TestAPI to your Amplify project
? Choose the code generation language target javascript
? Enter the file name pattern of graphql queries, mutations and subscriptions src/graphql/**/*.js
? Do you want to generate/update all possible GraphQL operations - queries, mutations and subscriptions Yes
? Enter maximum statement depth [increase from default if your schema is deeply nested] 2
✔ Downloaded the schema
✔ Generated GraphQL operations successfully and saved at src/graphql

>>>>>   amplify codegen
✔ Downloaded the schema
✔ Generated GraphQL operations successfully and saved at src/graphql

>>>>>   cp /home/nick/bb/awsdevassoc/AppSync_with_Amplify/app/app.js src/app.js

>>>>>   cp /home/nick/bb/awsdevassoc/AppSync_with_Amplify/app/package.json ./package.json

>>>>>   npm install
npm WARN deprecated source-map-url@0.4.1: See https://github.com/lydell/source-map-url#deprecated
npm WARN deprecated urix@0.1.0: Please see https://github.com/lydell/urix#deprecated
npm WARN deprecated resolve-url@0.2.1: https://github.com/lydell/resolve-url#deprecated
npm WARN deprecated source-map-resolve@0.5.3: See https://github.com/lydell/source-map-resolve#deprecated
npm WARN deprecated querystring@0.2.0: The querystring API is considered Legacy. new code should use the URLSearchParams API instead.
npm WARN deprecated uuid@3.4.0: Please upgrade  to version 7 or higher.  Older versions may use Math.random() in certain circumstances, which is known to be problematic.  See https://v8.dev/blog/math-random for details.
npm WARN deprecated uglify-es@3.3.9: support for ECMAScript is superseded by `uglify-js` as of v3.13.0

added 791 packages, and audited 792 packages in 10s

39 packages are looking for funding
  run `npm fund` for details

found 0 vulnerabilities

[nick@nuc app]$ cd /tmp/appsynctest/src
[nick@nuc src]$ node app.js
>>>>>   List cars
List response:
[
  {
    "id": 1,
    "make": "Mazda",
    "model": "RX-7",
    "year": 1982
  }
]

>>>>>   Create car one: {"make":"Honda","model":"Odyssey","year":2000}
Create response:
{"data":{"createAppSyncCar":{"id":46038,"make":"Honda","model":"Odyssey","year":2000}}}

>>>>>   Create car two: {"make":"Toyota","model":"Camry","year":2010}
Create response:
{"data":{"createAppSyncCar":{"id":34582,"make":"Toyota","model":"Camry","year":2010}}}

>>>>>   List cars
List response:
[
  {
    "id": 46038,
    "make": "Honda",
    "model": "Odyssey",
    "year": 2000
  },
  {
    "id": 1,
    "make": "Mazda",
    "model": "RX-7",
    "year": 1982
  },
  {
    "id": 34582,
    "make": "Toyota",
    "model": "Camry",
    "year": 2010
  }
]
```
