#!/bin/sh

echo ">>>>>  cd /tmp/cdk-demo"
cd /tmp/cdk-demo

echo ">>>>>    cdk destroy"
cdk destroy
cd

echo ">>>>>  Delete the CDKTookKit Stack"
echo ">>>>>    aws cloudformation delete-stack --stack-name CDKToolkit"
aws cloudformation delete-stack --stack-name CDKToolkit

echo ">>>>>    aws s3 ls | grep cdktoolkit"
aws s3 ls | grep -i cdk

echo "What is the name of the directory from the previous command? It should be emptied first!"
read bucket

echo ">>>>>    aws s3 rb --force s3://$bucket"
aws s3 rb --force s3://$bucket

echo ">>>>>  rm -rf /tmp/cdk-*"
rm -rf /tmp/cdk-*

