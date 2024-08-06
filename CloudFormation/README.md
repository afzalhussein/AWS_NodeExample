# AWS Developer - CloudFormation

## Direct version

```bash
$ aws cloudformation create-stack --stack-name myteststack --template-body file://AWS_CF_LAMP_Template.json --parameters ParameterKey=KeyName,ParameterValue=AWSDevGuru ParameterKey=DBPassword,ParameterValue=testdbpassword ParameterKey=DBUser,ParameterValue=root ParameterKey=DBRootPassword,ParameterValue=testrootpassword
{
    "StackId": "arn:aws:cloudformation:us-east-2:146868985163:stack/myteststack/c729a5c0-4f65-11ed-a596-0ad55fd35084"
}
$
```

## Or through interactive script version

```bash
$ create_stack
Enter stack name: myteststack
Enter template file path: AWS_CF_LAMP_Template.json
Enter KeyName parameter value: AWSDevGuru
Enter DBPassword parameter value: testdbpassword 
Enter DBUser parameter value: root 
Enter DBRootPassword parameter value: testrootpassword

```

## Success

`Stack creation initiated successfully.`

## Failure

`Failed to initiate stack creation. Check the log file for details.`

## Execute scenarios

### Check if AWS CLI is installed

*Error*: `AWS CLI is not installed. Please install it first.`

### Check if if any of stack name or template are not provided

*Error*: `Stack name and template file are required.`

### Check if any of parameters are not provided

*Error*: `All parameter values are required.`

## AFter creation

In stacks, under `CloudFormation`, you will find **myteststack**

In instances, under *Instances* `Details`, find running instance. Check public IPv4 address and click *open address*. It will take you to *CloudFormation* **PHP** sample page.

