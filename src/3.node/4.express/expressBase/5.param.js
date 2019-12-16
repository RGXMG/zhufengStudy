/**
 * NOTE express定义路由的占位符的通用方法
 */
const express = require('express');
// const express = require('./expressSrc');
const app = express();

/**
 * NOTE 通过param定义占位符的处理方法，
 * NOTE 也可以为数组,如['userId','name']，则匹配成功时，该函数会被调用俩次，然后再调用路由处理
 * NOTE 可以通过该处理函数验证占位符数据
 * NOTE 以及向req注入一些公共的数据， 如userId获取userInfo等
 */
app.param('userId', function (req, res, next, id) {
  console.log(id);
  req.userInfo = { id, age: 18 };
  next();
});

app.get('/user/:userId/:age', function (req, res) {
  console.log(req.userInfo);
  res.end('ok');
});
app.listen(8080);