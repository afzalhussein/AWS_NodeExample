const AWS = require('aws-sdk');
const fs = require('fs');

// Load AWS configuration from a file
AWS.config.loadFromPath('./config.json');

// Validate AWS configuration
const validateConfig = () => {
  if (AWS.config.credentials.accessKeyId === "YOUR_ACCESS_KEY_ID") {
    console.error("ERROR: You have not configured your access and secret key in config.json");
    process.exit(1);
  }
};

validateConfig();

const ec2 = new AWS.EC2();

// Function to describe EC2 instances
const describeInstances = async () => {
  try {
    const data = await ec2.describeInstances().promise();
    console.log("Total Reservations: " + data.Reservations.length);
    if (data.Reservations.length > 0) {
      data.Reservations.forEach(reservation => {
        reservation.Instances.forEach(instance => {
          const nameTag = instance.Tags.find(tag => tag.Key === "Name");
          const name = nameTag ? nameTag.Value : "Unnamed";
          const publicIp = instance.PublicIpAddress || "No Public IP";
          console.log(`Name: ${name.padEnd(30)} Pub. IP: ${publicIp}`);
        });
      });
    }
  } catch (error) {
    console.error("Error describing instances:", error);
  }
};

// Execute the describeInstances function
describeInstances();
