# API Gateway

`Lambda CRUD`: An API Gateway REST API should be deployed with a single resource, '/pets'. There should be methods for GET and POST that use Lambda proxy integration to call the Lambda function created in the "lambda" step.

1. Create API (+ denotes selection)
   1. Amazon API Gateway->API->Create
      1. Choose the protocol
         1. Choose Type from (+REST, WebSocket)
      2. Create new API
         1. On selecting REST, choose from the following (+New API, Import from Swagger or Open API 3, Example API)
      3. Settings
         1. Choose a friendly name and description for your API (* required)
            1. API name*: Pets API
            2. Description: My pets api
            3. Endpoint Type: (+Regional)
         2. Click Create API
2. Add resource and method and integration
   1. API: Pets API, select ANY
   2. Setup appears, choose the integration point to your new method
      1. Choose from (+Lambda Function, HTTP, Mock, AWS Service, VPC Link)
      2. Check Lambda Proxy integration
         1. Lambda Region: us-east-2
         2. Lambda Function: Pets
         3. Check Use Default Timeout
         4. Click Save
3. Deploy API
   1. On Deploy API
      1. Deployment state: New Stage
      2. Stage name*: default
      3. Stage description: Leave empty if you want
      4. Deployment description: Leave empty if you want
      5. Click Deploy
