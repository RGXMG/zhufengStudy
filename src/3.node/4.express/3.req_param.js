/**
 * NOTE 修改req的参数，靠的是内置的中间件进行处理
 * NOTE  在系统初始化的时候，就会初始化该中间件，是为了处理请求的参数等
 * @type {createApplication}
 */
// const express = require('express');
const express = require('./expressSrc');
const app = express();

app.get('/user', function (req, res) {
  //
  console.log(req.query);
  console.log(req.path);
  // 主机名
  console.log(req.hostname);
});
app.listen(8080);