const http = require('http');

const data = JSON.stringify({
  customerName: "Test User",
  mobile: "7777777777",
  franchiseId: "6a4334c0ce8694d8ce773e3b" // Replace with valid franchise ID
});

const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/api/customers/create',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
};

const req = http.request(options, res => {
  let body = '';
  res.on('data', chunk => body += chunk);
  res.on('end', () => console.log(body));
});

req.on('error', e => console.error(e));
req.write(data);
req.end();
