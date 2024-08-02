#!/bin/sh

# Define log file
logfile="appconfig_list_applications.log"

# Display and execute the command
echo "Executing: aws appconfig list-applications"

# Run the AWS CLI command and capture the output
if aws appconfig list-applications > "$logfile" 2>&1; then
  echo "Successfully listed applications."
  echo ">>>>> Output:"
  cat "$logfile"
else
  echo "Error: Failed to list applications."
  echo "Check $logfile for details."
fi

echo
