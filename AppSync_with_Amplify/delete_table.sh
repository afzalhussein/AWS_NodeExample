#!/bin/sh

# Function to print usage
usage() {
    echo "Usage: $0 --table-name <table_name> [--profile <aws_profile>] [--region <aws_region>]"
    exit 1
}

# Parse input arguments
while [ "$1" != "" ]; do
    case $1 in
        --table-name )          shift
                                TABLE_NAME=$1
                                ;;
        --profile )             shift
                                AWS_PROFILE=$1
                                ;;
        --region )              shift
                                AWS_REGION=$1
                                ;;
        -h | --help )           usage
                                ;;
        * )                     usage
                                ;;
    esac
    shift
done

# Check if table name is provided
if [ -z "$TABLE_NAME" ]; then
    echo "Error: Table name is required."
    usage
fi

# Set AWS CLI command options
AWS_CLI_OPTIONS=""
[ ! -z "$AWS_PROFILE" ] && AWS_CLI_OPTIONS="--profile $AWS_PROFILE"
[ ! -z "$AWS_REGION" ] && AWS_CLI_OPTIONS="$AWS_CLI_OPTIONS --region $AWS_REGION"

# Confirm with the user
echo "Are you sure you want to delete the DynamoDB table '$TABLE_NAME'? This action cannot be undone. (y/n)"
read confirmation
if [ "$confirmation" != "y" ]; then
    echo "Table deletion cancelled."
    exit 0
fi

# Attempt to delete the table
echo ">>>>> Deleting DynamoDB table '$TABLE_NAME'..."
aws dynamodb delete-table --table-name "$TABLE_NAME" $AWS_CLI_OPTIONS

# Check if the delete command was successful
if [ $? -eq 0 ]; then
    echo "Table '$TABLE_NAME' deleted successfully."
else
    echo "Failed to delete table '$TABLE_NAME'."
fi
