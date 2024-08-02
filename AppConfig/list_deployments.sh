#!/bin/sh

echo ">>>>> Listing AWS AppConfig applications..."
if ! aws appconfig list-applications; then
  echo "Error: Failed to list applications."
  exit 1
fi

echo "Please enter the application ID:"
read app_id
if [ -z "$app_id" ]; then
  echo "Error: Application ID cannot be empty."
  exit 1
fi

echo ">>>>> Listing environments for application ID: $app_id..."
if ! aws appconfig list-environments --application-id $app_id; then
  echo "Error: Failed to list environments for application ID: $app_id."
  exit 1
fi

echo "Please enter the environment ID:"
read env_id
if [ -z "$env_id" ]; then
  echo "Error: Environment ID cannot be empty."
  exit 1
fi

echo ">>>>> Listing deployments for application ID: $app_id and environment ID: $env_id..."
if ! aws appconfig list-deployments --application-id $app_id --environment-id $env_id; then
  echo "Error: Failed to list deployments for application ID: $app_id and environment ID: $env_id."
  exit 1
fi
