#!/bin/sh

# Function to display usage
usage() {
  echo "Usage: $0 <app_id> <configuration_profile_id>"
  exit 1
}

# Check if the correct number of arguments is provided
if [ $# -ne 2 ]; then
  usage
fi

# Validate arguments
app_id="$1"
configuration_profile_id="$2"

if [ -z "$app_id" ] || [ -z "$configuration_profile_id" ]; then
  echo "Error: Both application ID and configuration profile ID must be provided."
  usage
fi

# Define output file
outputfile="outputfile"

# Display command
echo "Executing: aws appconfig create-hosted-configuration-version --application-id $app_id --configuration-profile-id $configuration_profile_id --content '{\"number\":2}' --content-type 'application/json' --output $outputfile"

# Execute the command
if aws appconfig create-hosted-configuration-version --application-id "$app_id" --configuration-profile-id "$configuration_profile_id" --content '{"number":2}' --content-type "application/json" --output "$outputfile"; then
  echo "Configuration version created successfully."
else
  echo "Error: Failed to create configuration version."
  exit 1
fi

# Check if outputfile exists and display its contents
if [ -f "$outputfile" ]; then
  echo ">>>>> Contents of $outputfile:"
  cat "$outputfile"
else
  echo "Error: Output file not found."
fi

echo
