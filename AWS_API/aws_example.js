// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

/*
Important

The AWS SDKs sign API requests for you using the access key that you specify when you
configure the SDK. When you use an SDK, you don’t need to learn how to sign API requests.
We recommend that you use the AWS SDKs to send API requests, instead of writing your own code.

The following example is a reference to help you get started if you have a need to write
your own code to send and sign requests. The example is for reference only and is not
maintained as functional code.
*/

// AWS Version 4 signing example

// EC2 API (DescribeRegions)

// See: http://docs.aws.amazon.com/general/latest/gr/sigv4_signing.html
// This version makes a GET request and passes the signature
// in the Authorization header.

const crypto = require('crypto');
const fs = require('fs');
const https = require('https');
const url = require('url');

// Get keys
const settings = JSON.parse(fs.readFileSync('config.json', 'utf8'));

if (settings.aws_access_key_id === "INSERT_KEY_ID") {
  console.log("ERROR: You have not configured your access and secret key in config.json");
  process.exit(1);
}

// ************* REQUEST VALUES *************
const method = 'GET';
const service = 'ec2';
const host = 'ec2.amazonaws.com';
const region = 'us-east-1';
const endpoint = 'https://ec2.amazonaws.com';
const request_parameters = 'Action=DescribeRegions&Version=2013-10-15';

// Key derivation functions. See:
// http://docs.aws.amazon.com/general/latest/gr/signature-v4-examples.html#signature-v4-examples-python
function sign(key, msg) {
  return crypto.createHmac('sha256', key).update(msg, 'utf8').digest();
}

function getSignatureKey(key, dateStamp, regionName, serviceName) {
  const kDate = sign('AWS4' + key, dateStamp);
  const kRegion = sign(kDate, regionName);
  const kService = sign(kRegion, serviceName);
  const kSigning = sign(kService, 'aws4_request');
  return kSigning;
}

// Read AWS access key from env. variables or configuration file. Best practice is NOT
// to embed credentials in code.
const access_key = settings.aws_access_key_id;
const secret_key = settings.aws_secret_access_key;
if (!access_key || !secret_key) {
  console.log('No access key is available.');
  process.exit(1);
}

// Create a date for headers and the credential string
const t = new Date();
const amzdate = t.toISOString().replace(/[:-]|\.\d{3}/g, ''); // YYYYMMDDTHHMMSSZ
const datestamp = t.toISOString().split('T')[0].replace(/-/g, ''); // Date w/o time, used in credential scope

// ************* TASK 1: CREATE A CANONICAL REQUEST *************
// http://docs.aws.amazon.com/general/latest/gr/sigv4-create-canonical-request.html

// Step 1 is to define the verb (GET, POST, etc.)--already done.

// Step 2: Create canonical URI--the part of the URI from domain to query
// string (use '/' if no path)
const canonical_uri = '/';

// Step 3: Create the canonical query string. In this example (a GET request),
// request parameters are in the query string. Query string values must
// be URL-encoded (space=%20). The parameters must be sorted by name.
// For this example, the query string is pre-formatted in the request_parameters variable.
const canonical_querystring = request_parameters;

// Step 4: Create the canonical headers and signed headers. Header names
// must be trimmed and lowercase, and sorted in code point order from
// low to high. Note that there is a trailing \n.
const canonical_headers = `host:${host}\nx-amz-date:${amzdate}\n`;

// Step 5: Create the list of signed headers. This lists the headers
// in the canonical_headers list, delimited with ";" and in alpha order.
// Note: The request can include any headers; canonical_headers and
// signed_headers lists those that you want to be included in the
// hash of the request. "Host" and "x-amz-date" are always required.
const signed_headers = 'host;x-amz-date';

// Step 6: Create payload hash (hash of the request body content). For GET
// requests, the payload is an empty string ("").
const payload_hash = crypto.createHash('sha256').update('', 'utf8').digest('hex');

// Step 7: Combine elements to create canonical request
const canonical_request = [
  method,
  canonical_uri,
  canonical_querystring,
  canonical_headers,
  signed_headers,
  payload_hash
].join('\n');

// ************* TASK 2: CREATE THE STRING TO SIGN*************
// Match the algorithm to the hashing algorithm you use, either SHA-1 or
// SHA-256 (recommended)
const algorithm = 'AWS4-HMAC-SHA256';
const credential_scope = `${datestamp}/${region}/${service}/aws4_request`;
const string_to_sign = [
  algorithm,
  amzdate,
  credential_scope,
  crypto.createHash('sha256').update(canonical_request, 'utf8').digest('hex')
].join('\n');

// ************* TASK 3: CALCULATE THE SIGNATURE *************
// Create the signing key using the function defined above.
const signing_key = getSignatureKey(secret_key, datestamp, region, service);

// Sign the string_to_sign using the signing_key
const signature = crypto.createHmac('sha256', signing_key).update(string_to_sign, 'utf8').digest('hex');

// ************* TASK 4: ADD SIGNING INFORMATION TO THE REQUEST *************
// The signing information can be either in a query string value or in
// a header named Authorization. This code shows how to use a header.
// Create authorization header and add to request headers
const authorization_header = [
  `${algorithm} Credential=${access_key}/${credential_scope}`,
  `SignedHeaders=${signed_headers}`,
  `Signature=${signature}`
].join(', ');

// The request can include any headers, but MUST include "host", "x-amz-date",
// and (for this scenario) "Authorization". "host" and "x-amz-date" must
// be included in the canonical_headers and signed_headers, as noted
// earlier. Order here is not significant.
const headers = {
  'x-amz-date': amzdate,
  'Authorization': authorization_header
};

// ************* SEND THE REQUEST *************
const request_url = `${endpoint}?${canonical_querystring}`;

console.log('\nBEGIN REQUEST++++++++++++++++++++++++++++++++++++');
console.log(`Request URL = ${request_url}`);

https.get(url.parse(request_url), { headers }, (res) => {
  let data = '';

  // A chunk of data has been received.
  res.on('data', (chunk) => {
    data += chunk;
  });

  // The whole response has been received.
  res.on('end', () => {
    console.log('\nRESPONSE++++++++++++++++++++++++++++++++++++');
    console.log(`Response code: ${res.statusCode}\n`);
    console.log(data);
  });
}).on('error', (e) => {
  console.error(e);
});
