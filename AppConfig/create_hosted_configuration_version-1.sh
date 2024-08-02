#!/bin/sh

# Check for required arguments
if [ $# -ne 2 ]; then
  echo "Usage: $0 <app_id> <configuration_profile_id>"
  exit 1
fi

APP_ID=$1
PROFILE_ID=$2
CONTENT='{"number":1}' # This can be made configurable if needed
CONTENT_TYPE="application/json"
OUTPUT_FILE=$(mktemp /tmp/aws-appconfig-output.XXXXXX)

# Echo command to show what is being run
echo "Running: aws appconfig create-hosted-configuration-version --application-id $APP_ID --configuration-profile-id $PROFILE_ID --content '$CONTENT' --content-type $CONTENT_TYPE"

# Execute the AWS CLI command
aws appconfig create-hosted-configuration-version --application-id $APP_ID --configuration-profile-id $PROFILE_ID --content "$CONTENT" --content-type "$CONTENT_TYPE" > $OUTPUT_FILE

# Check if the AWS CLI command was successful
if [ $? -eq 0 ]; then
  echo "Configuration version created successfully. Contents of $OUTPUT_FILE:"
  cat $OUTPUT_FILE
else
  echo "Failed to create configuration version. See AWS CLI output for details."
fi

# Clean up the temporary file
rm $OUTPUT_FILE
