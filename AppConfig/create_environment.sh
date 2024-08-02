#!/bin/sh

# Check for required arguments
if [ $# -lt 1 ] || [ $# -gt 2 ]; then
  echo "Usage: $0 <app-id> [environment-name]"
  exit 1
fi

APP_ID=$1
ENV_NAME=${2:-Prod}

echo "Creating AWS AppConfig environment '$ENV_NAME' for application ID '$APP_ID'..."

# Check if the environment already exists
EXISTING_ENV=$(aws appconfig list-environments --application-id $APP_ID --query "Items[?Name=='$ENV_NAME'].Id" --output text)

if [ -n "$EXISTING_ENV" ]; then
  echo "Environment '$ENV_NAME' already exists with ID '$EXISTING_ENV'."
  exit 1
fi

# Create the environment
aws appconfig create-environment --application-id $APP_ID --name $ENV_NAME

if [ $? -eq 0 ]; then
  echo "Environment '$ENV_NAME' created successfully for application ID '$APP_ID'."
else
  echo "Failed to create environment '$ENV_NAME' for application ID '$APP_ID'. Check AWS CLI output for details."
  exit 1
fi
