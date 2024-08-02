#!/bin/sh

# Check for required arguments
if [ $# -lt 1 ] || [ $# -gt 2 ]; then
  echo "Usage: $0 <app_id> [profile_name]"
  exit 1
fi

APP_ID=$1
PROFILE_NAME=${2:-adgu-prod-config}
LOCATION_URI="hosted"

echo "Creating AWS AppConfig configuration profile '$PROFILE_NAME' for application ID '$APP_ID'..."

# Check if the configuration profile already exists
EXISTING_PROFILE=$(aws appconfig list-configuration-profiles --application-id $APP_ID --query "Items[?Name=='$PROFILE_NAME'].Id" --output text)

if [ -n "$EXISTING_PROFILE" ]; then
  echo "Configuration profile '$PROFILE_NAME' already exists with ID '$EXISTING_PROFILE'."
  exit 1
fi

# Create the configuration profile
aws appconfig create-configuration-profile --application-id $APP_ID --name $PROFILE_NAME --location-uri $LOCATION_URI

if [ $? -eq 0 ]; then
  echo "Configuration profile '$PROFILE_NAME' created successfully for application ID '$APP_ID'."
else
  echo "Failed to create configuration profile '$PROFILE_NAME' for application ID '$APP_ID'. Check AWS CLI output for details."
  exit 1
fi
