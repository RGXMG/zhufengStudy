const express = require('express');
const cookieParser = require('cookie-parser');
const app = express();
// 解析cookie中间件
app.use(cookieParser());
app.get('/read', function (req, res) {
  // const cookie = req.headers['cookie'];
  // console.log(req.headers['cookie']);
  res.end(req.cookie);
});
app.get('/write', function(req, res) {
  res.cookie('name', 'xmg');
  res.end();
});
app.listen(8080);
