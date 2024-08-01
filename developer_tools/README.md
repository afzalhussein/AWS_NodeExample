# Developer Tools

## CodeStar

**Obsolete**: Tool to create, manage, and working with software dev projects on AWS. 
*On July 31, 2024, Amazon Web Services (AWS) will discontinue support for creating and viewing AWS CodeStar projects. After July 31, 2024, you will no longer be able to access the AWS CodeStar console or create new projects.*
[CodeStar](https://docs.aws.amazon.com/codestar/latest/userguide/welcome.html)

## CodeCommit

AWS CodeCommit is a version control service that enables you to privately store and manage Git repositories in the AWS Cloud.

### CLI command examples

> codecommit credential-helper help

`credential-helper` 

> Provides a SigV4 compatible user name and password for **git** smart HTTP. These commands are consumed by *git* and should not be used directly. `Erase` and `Store` are no-ops. `Get` is operation to generate credentials to authenticate AWS CodeCommit.

Run `aws codecommit credential-helper help` to get help details.

[CodeCommit](https://docs.aws.amazon.com/codecommit/)

## CodeBuild

> AWS CodeBuild is a fully managed build service in the cloud. CodeBuild compiles your source code, runs unit tests, and produces artifacts that are ready to deploy.
> Features: **Fully managed**, **On demand**, and **Out of the box**.

[CodeBuild](https://docs.aws.amazon.com/codebuild/latest/userguide/welcome.html)

## Code Deploy

AWS CodeDeploy is a deployment service that enables developers to automate the deployment of applications to instances and to update the applications as required.

### CLI command examples

> Put Role Policy

`$ aws iam put-role-policy --role-name CodeDeployDemo-EC2-Instance-Profile --policy-name CodeDeployDemo-EC2-Permissions --policy-document file://CodeDeployDemo-EC2-Permissions.json`

> Create Instance Profile

`$ aws iam create-instance-profile --instance-profile-name CodeDeployDemo-EC2-Instance-Profile`

```
{
    "InstanceProfile": {
        "InstanceProfileId": "AIPAIEXU24D3A5BFYIVT6", 
        "Roles": [], 
        "CreateDate": "2023-08-17T06:30:14Z", 
        "InstanceProfileName": "CodeDeployDemo-EC2-Instance-Profile", 
        "Path": "/", 
        "Arn": "arn:aws:iam::146868985163:instance-profile/CodeDeployDemo-EC2-Instance-Profile"
    }
}
```

> Add Role to Profile

`$ aws iam add-role-to-instance-profile --instance-profile-name CodeDeployDemo-EC2-Instance-Profile --role-name CodeDeployDemo-EC2-Instance-Profile` 

[CodeDeploy](https://docs.aws.amazon.com/codedeploy/)

## CodePipeline

AWS CodePipeline is a continuous delivery service you can use to model, visualize, and automate the steps required to release your software. You can quickly model and configure the different stages of a software release process

[CodePipeline](https://docs.aws.amazon.com/codepipeline/latest/userguide/welcome.html)

## X-Ray

Analyze and debug production and distributed applications

Checkout folder X-Ray

[X-Ray](https://aws.amazon.com/xray/)
