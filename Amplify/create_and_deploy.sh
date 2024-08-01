#!/bin/sh
echo ">>>>>   Note: use 'amplify delete' from /tmp/amplify to delete all resources created in this demo."
echo

echo ">>>>>   NOTE: It is recommended to create a new IAM user "
echo ">>>>>         for every device that installs the Amplify "
echo ">>>>>         CLI, rather than attempt to use an existing "
echo ">>>>>         IAM user used on another device. Having a "
echo ">>>>>         distinct user for each machine provides the "
echo ">>>>>         best level of visibility and control without "
echo ">>>>>         breaking the deployment of your app, allowing "
echo ">>>>>         for the quick deactivation of an individual "
echo ">>>>>         machine if needed."
echo

origwd=`pwd`
echo ">>>>>   Original working directory: " $origwd
echo

echo ">>>>>   Installing AWS Amplify CLI"
echo ">>>>>   sudo npm install -g @aws-amplify/cli"
sudo npm install -g @aws-amplify/cli
echo

echo ">>>>>   amplify configure (skipping), assuming AWS credentials already configured"
echo ">>>>>     See: https://docs.amplify.aws/start/getting-started/installation/q/integration/js/"
#amplify configure
echo

echo ">>>>>   mkdir /tmp/amplify; cd /tmp/amplify; cp some files"
mkdir -p /tmp/amplify/src
cd /tmp/amplify
cp -v $origwd/app_files/package.json .
cp -v $origwd/app_files/webpack.config.js .
cp -v $origwd/app_files/index.html .
cp -v $origwd/app_files/app.js ./src/
echo

echo ">>>>>   npm install"
npm install
echo


echo ">>>>>   amplify init"
echo ">>>>>     This will:"
echo ">>>>>     - create amplify directory with backend definitions"
echo ">>>>>     - create aws-exports.js in src directory for use in your app"
echo ">>>>>     - modify .gitignore to ignore generated files"
echo ">>>>>     - create amplify project to be see in Amplify web console"
amplify init
echo


echo ">>>>>   amplify add api"
amplify add api
echo

echo ">>>>>   amplify push"
amplify push
echo


echo ">>>>>   amplify status"
amplify status
echo

echo ">>>>>   Head over to https://us-east-2.console.aws.amazon.com/appsync/home and test Queries to your new API"
echo ">>>>>     Press enter to continue..."
read ANS
echo


echo ">>>>>   Running locally with: npm start"
echo ">>>>>     Surf to localhost:8080"
echo ">>>>>     Ctrl-C to kill and deploy"
npm start
echo


echo -n ">>>>>   Do you want to add hosting? (Y|n) "
read ANS
if [ $ANS == "n" ]; then
  exit
fi


echo ">>>>>   amplify add hosting"
amplify add hosting
echo

echo ">>>>>   amplify publish"
amplify publish
echo

