const request = require('request');

const host = "127.0.0.1";
const port = 8080;
const url = `http://${host}:${port}`;

// Function to send GET request
function sendGet() {
  console.log("> Sending GET");
  request(url, function (error, response, body) {
    if (error) {
      console.error('  GET request error:', error);
    } else {
      console.log('  GET statusCode:', response && response.statusCode);
      console.log('  GET body:', body);
    }
    sendPost();
  });
}

// Function to send POST request
function sendPost() {
  const data = { 'ts': Date.now(), 'count': loopCount };
  console.log("> Sending POST:", data);
  request({
    url: url,
    method: "POST",
    json: data
  }, function(error, response, body){
    if (error) {
      console.error('  POST request error:', error);
    } else {
      console.log('  POST statusCode:', response && response.statusCode);
      console.log('  POST body:', body);
    }
  });
  loopCount++;
}

let loopCount = 0;

// Start with an initial GET request
sendGet();

// Set interval to send GET requests every 3 seconds
setInterval(sendGet, 3000);
