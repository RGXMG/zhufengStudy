const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const path = require('path');
const app = express();
// 设置模板引擎
app.set('view engine', 'html');
// 设置views根目录
app.set('views', './2.views');
// 设置模板引擎解析
app.engine('html', require('ejs').__express);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.get('/login', function (req, res) {
  res.render('login', { title: '登录' });
});
app.post('/login', function (req, res) {
  const { username, pwd } = req.body;
  // 登录成功，向客户端注入登录成功的信息，cookie
  if (pwd === '1') {
    res.cookie('username', username);
    res.redirect('/user');
  } else {
    // 返回上一级
    res.redirect('back');
  }
});
app.get('/user', checkLogin, function (req, res) {
  // 尝试读取cookie信息，查看是否登录
  const { username } = req.cookies;
  res.render('user', { title: '主页', username });
});
app.listen(8080);

/**
 * 判断用户是否登录
 * @param req
 * @param res
 * @param next
 */
function checkLogin(req, res, next) {
  if (req.cookies.username) {
    next();
  } else {
    res.redirect('/login');
  }
}