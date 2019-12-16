const express = require('express');
const app = express();
app.param('uid', function(req, res, next, val, name) {
  req.user = { id: 1, name: 'xmg' };
  next();
});
app.param('uid', function(req, res, next, val, name) {
  req.user.name = 'xmg2';
  next();
});
// 路径参数，因为这个参数是在路径里面的
// /user/([^/]+?) /user/1
app.get('/user/:uid', function (req, res) {
  // 路径参数对象
  console.log(req.params);
  console.log(req.user);
  res.end('user:' + req.user.name);
});
app.listen(8080);