const express = require('../src/express');
const app = express();

// 路径分组，如restful接口：
// restful：GET /user | POST /user | DELETE /user | PUT /user
// 相同路径的接口只匹配一次就可以了
app.get('/', function (req,res,next) {
  console.log('first get before');
  next();
}, function (req,res,next) {
  console.log('first get after');
  next();
}).get('/', function (req, res, next) {
  console.log('second get before');
  next();
}).get('/', function (req, res, next) {
  console.log('thirst get before');
  next();
}).listen(8080);