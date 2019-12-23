/**
 * 中间件
 * 在express中使用use来添加，
 * NOTE 1. 和路由匹配放置在同一地方，也是按照注册顺序进行匹配，先匹配先执行
 * NOTE 1. 一般用来处理中间件逻辑，如身份验证等
 * NOTE 2. 中间件只要匹配前缀，如添加的中间件为/user，则可以匹配/user/add、/user/remove，但是不能匹配/users等
 * NOTE 3. express给中间件提供一个next()函数，当当前中间件执行函数执行完成之后，想要放行的话就调用该方法
 */
// const express = require('./expressSrc');
const express = require('express');
const url = require('url');
const app = express();

/**
 * NOTE 1. 使用use定义中间件，不提供path，则表示匹配所有的请求
 * 调用next则表示该中间件执行完成,
 * 如果传递参数了参数，则express就会跳过后面所有的中间件，交给错误错误处理中间件处理
 */
app.use(function (req,res, next) {
  res.setHeader('Content-Type', 'text/html;charset=utf8');
  console.log('没有路径的中间件');
  // 传递参数，则表示发生错误
  next('我是错误');
});
app.use('/water', function (req,res, next) {
  console.log('过滤杂质');
  next();
});
app.use(function (err, req,res,next) {
  res.end('发生了错误！');
});
app.get('/water', function (req,res) {
  res.end('water');
});
app.listen(8080);