// const express = require('express');
const express = require('../src/express');
const app = express();

// 路径分组，如restful接口：
// restful：GET /user | POST /user | DELETE /user | PUT /user
// 相同路径的接口只匹配一次就可以了
app.use(function (req, res, next) {
  console.log('Ware1', Date.now());
  next('error');
});
// 创建一个新的路由容器，或者说是路由系统
const user = express.Router();
user.use(function (req,res,next) {
  console.log('Ware2', Date.now());
  next();
});
// 在子路劲里面的路径是相对于父路径
user.get('/2', function (req, res, next) {
  console.log('222');
  res.end('2');
});
// use 为中间价，所以只需要匹配前缀就可以/user
app.use('/user', user);
app.use(function(err, req, res, next) {
  res.end('catch' + err);
});
app.listen(3000, function () {
  console.log('server is on listen 3000');
});