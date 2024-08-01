#!/bin/sh

origwd=`pwd`

echo ">>>>> aws sts get-caller-identity"
aws sts get-caller-identity
echo

echo "What is your AWS account number?"
read awsacct
echo "What is your preferred region?"
read region

echo ">>>>>  Installing aws-cdk"
echo ">>>>>    sudo npm install -g aws-cdk"
sudo npm install -g aws-cdk

echo ">>>>>  Check version"
echo ">>>>>    cdk --version"
cdk --version


echo ">>>>>  Moving to /tmp directory"
echo ">>>>>    mkdir /tmp/cdk-demo"
mkdir /tmp/cdk-demo
echo ">>>>>    cd /tmp/cdk-demo"
cd /tmp/cdk-demo


echo ">>>>>  Bootstraping CDK"
echo ">>>>>    cdk bootstrap aws://$awsacct/$region"
cdk bootstrap aws://$awsacct/$region


echo ">>>>>  Init CDK App"
echo ">>>>>    cdk init app --language javascript"
cdk init app --language=javascript

echo ">>>>>  List Stacks in App"
echo ">>>>>    cdk ls"
cdk ls



echo ">>>>>  copy stack file"
echo ">>>>>    cp $origwd/lib/cdk-stack.js ./lib/cdk-stack.js"
cp $origwd/lib/cdk-demo-stack.js ./lib/cdk-demo-stack.js

echo ">>>>>  synthsize"
echo ">>>>>    cdk synth"
cdk synth

echo ">>>>>  deploy"
echo ">>>>>    cdk deploy"
cdk deploy




echo "You should see an S3 bucket named adgucdkbucket and an SQS queue named adgucdkqueue in the web console now."
echo "https://us-east-2.console.aws.amazon.com/s3/buckets"
echo "https://us-east-2.console.aws.amazon.com/sqs/v2/home"

echo "!!!!!  Make sure you run the delete script or cdk destroy in your app directory to remove all of the resources.  Don't forget to delete the bootstrap stack too.  See delete.sh.  You might need to delete the buckets manually after emptying them."
