/**
 * NOTE express最主要的功能就是路由功能
 * NOTE 在注册路由的时候，它内部实际上就是按照你定义的顺序进行添加
 * NOTE 所有注册顺序很重要，如果你把all(*)注册在最开始，那么所有的路由都会指向*的这个处理函数
 * @type {createApplication}
 */
// const express = require('./expressBase');
const express = require('express');
const url = require('url');
const app = express();

// NOTE 1. 定义路由规则
app.get('/world', function(req, res) {
  console.log(url.parse(req.url));
  // console.log(req.method);
  res.end('world');
});
app.post('/hello', function(req, res) {
  res.end('hello');
});
app.get('/test', function(req, res) {
  res.end('test');
});

// NOTE 2. 有些时候只想匹配路径，不想区分具体方法
// all可以匹配所有的请求方法,
// 匹配规则：如果存在具体方法请求的处理，则优先使用具体方法的处理，没有再尝试查找all
app.all('/hello', function (req, res) {
  res.end('all hello');
});
app.all('/test', function (req, res) {
  res.end('all test');
});
// 匹配所有路径 *
// 一般作为错误处理
app.all('*', function (req, res) {
  res.end('all *');
});

app.listen(8080);