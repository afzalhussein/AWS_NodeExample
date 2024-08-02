#!/bin/sh

echo ">>>>> Listing AWS AppConfig applications..."
aws appconfig list-applications
echo "Please enter the application ID:"
read app_id
if [ -z "$app_id" ]; then
  echo "Error: Application ID cannot be empty."
  exit 1
fi

echo ">>>>> Listing environments for application ID: $app_id..."
aws appconfig list-environments --application-id $app_id
echo "Please enter the environment ID:"
read env_id
if [ -z "$env_id" ]; then
  echo "Error: Environment ID cannot be empty."
  exit 1
fi

echo ">>>>> Listing configuration profiles for application ID: $app_id..."
aws appconfig list-configuration-profiles --application-id $app_id
echo "Please enter the configuration profile ID:"
read profile_id
if [ -z "$profile_id" ]; then
  echo "Error: Configuration profile ID cannot be empty."
  exit 1
fi

echo ">>>>> Listing hosted configuration versions for profile ID: $profile_id and application ID: $app_id..."
aws appconfig list-hosted-configuration-versions --configuration-profile-id $profile_id --application-id $app_id
echo "Please enter the version number:"
read ver
if [ -z "$ver" ]; then
  echo "Error: Version number cannot be empty."
  exit 1
fi

echo ">>>>> Starting deployment for application ID: $app_id, environment ID: $env_id, profile ID: $profile_id, version: $ver..."
aws appconfig start-deployment --application-id $app_id --environment-id $env_id --deployment-strategy-id AppConfig.AllAtOnce --configuration-profile-id $profile_id --configuration-version $ver

if [ $? -eq 0 ]; then
  echo "Deployment started successfully."
else
  echo "Failed to start deployment."
fi
