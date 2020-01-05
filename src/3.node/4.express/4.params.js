/**
 * NOTE express定义路由的占位符匹配任意字符串
 * NOTE 然后在路由处理中通过req.params获取匹配的值
 */
const express = require('express');
// const express = require('./expressSrc');
const app = express();

// /user/xmg/9
// 举例 restful路由：GET /user/1 获取用户id为1的信息
app.get('/user/:name/:age', function (req, res) {
  console.log(req.params);
  res.end('ok');
});
app.listen(8080);
