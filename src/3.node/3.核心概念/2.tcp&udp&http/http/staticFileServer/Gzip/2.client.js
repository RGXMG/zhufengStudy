const http = require('http');

const request = http.request({
  path: '/msg.txt',
  host: 'localhost',
  port: 8080,
  method: 'GET'
}, function (res) {
  const result = [];
  res.on('data', function (data) {
    result.push(data);
  });
  res.on('end', function () {
    console.log(Buffer.concat(result).toString());
  })
});
request.end();