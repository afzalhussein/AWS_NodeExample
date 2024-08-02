#!/bin/sh

APP_NAME="adgu"

# Check if application already exists
aws appconfig describe-applications --application $APP_NAME >/dev/null 2>&1
if [ $? -eq 0 ]; then
  echo "Application '$APP_NAME' already exists."
else
  echo "Creating AWS AppConfig application '$APP_NAME'..."
  aws appconfig create-application --name $APP_NAME
  if [ $? -eq 0 ]; then
    echo "Application '$APP_NAME' created successfully."
  else
    echo "Failed to create application '$APP_NAME'. Check AWS CLI output for details."
  fi
fi
