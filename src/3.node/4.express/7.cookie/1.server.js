const express = require('express');
const cookieParser = require('cookie-parser');
const app = express();
// 解析cookie中间件
// 加密
app.use(cookieParser('xmg'));
app.get('/read', function (req, res) {
  // const cookie = req.headers['cookie'];
  // console.log(req.headers['cookie']);
  res.end(req.cookie);
});
app.get('/write', function(req, res) {
  // 使用secret进行签名
  // 防止客户端篡改
  // res.cookie('name', 'xmg', { signed: true });
  res.cookie = function(key, val, options = {}) {
    const { path,
      maxAge,
      expires,
      httpOnly,
      secure, domain } = options;
    const parts = [`${key}=${val}`];
    if (domain) {
      parts.push(`domain=${domain}`);
    }
    if (path) {
      parts.push(`path=${path}`);
    }
    if (maxAge) {
      parts.push(`Max-Age=${maxAge}`);
    }
    if (expires) {
      parts.push(`Expires=${expires.toUTCString()}`);
    }
    if (httpOnly) {
      parts.push('httpOnly');
    }
    if (secure) {
      parts.push(`secure`);
    }
    res.headers('Set-Cookie', parts.join(';'));
  };
  res.cookie('name', 'xmg', {
    domain: 'localhost',
    // 只有在path下才能生效
    path: '/user',
    // 生存时间 毫秒数
    maxAge: 10 * 1000,
    // 过期时间
    expires: new Date(Date.now() + 10 * 1000),
    // 不允许浏览器的js代码访问
    httpOnly: true,
    // 只允许
    secure: true
  });
  res.end();
});
app.listen(8080);
