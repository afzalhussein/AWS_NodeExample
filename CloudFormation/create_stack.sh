#!/bin/sh

# Function to check if a command exists
command_exists() {
  command -v "$1" >/dev/null 2>&1
}

# Check if AWS CLI is installed
if ! command_exists aws; then
  echo "AWS CLI is not installed. Please install it first."
  exit 1
fi

# Get user inputs for stack name, template file, and parameters
read -p "Enter stack name: " stack_name
read -p "Enter template file path: " template_file

# Ensure required parameters are provided
if [ -z "$stack_name" ] || [ -z "$template_file" ]; then
  echo "Stack name and template file are required."
  exit 1
fi

# Prompt for parameters
read -p "Enter KeyName parameter value: " key_name
read -p "Enter DBPassword parameter value: " db_password
read -p "Enter DBUser parameter value: " db_user
read -p "Enter DBRootPassword parameter value: " db_root_password

# Ensure parameters are not empty
if [ -z "$key_name" ] || [ -z "$db_password" ] || [ -z "$db_user" ] || [ -z "$db_root_password" ]; then
  echo "All parameter values are required."
  exit 1
fi

# Log file
log_file="create_stack.log"

# Log and execute the command
command="aws cloudformation create-stack --stack-name $stack_name --template-body file://$template_file --parameters ParameterKey=KeyName,ParameterValue=$key_name ParameterKey=DBPassword,ParameterValue=$db_password ParameterKey=DBUser,ParameterValue=$db_user ParameterKey=DBRootPassword,ParameterValue=$db_root_password"

echo "Executing: $command" | tee -a "$log_file"

$command >> "$log_file" 2>&1
if [ $? -eq 0 ]; then
  echo "Stack creation initiated successfully." | tee -a "$log_file"
else
  echo "Failed to initiate stack creation. Check the log file for details." | tee -a "$log_file"
fi
