const express = require('express');
const session = require('express-session');
const uuid = require('uuid');
const app = express();
const SessionStore = require('./3.store')(session);
app.use(session({
  // 是否每次请求都需要重新设置session cookie，如cookie有效期为10分钟，则10分钟内重新请求时会重新设置cookie并且刷新有效期
  resave: true,
  // 无论是否存在session cookie, 每次请求都会设置个session cookie，默认给个标识为connect.sid
  saveUninitialized: true,
  // 设置secret字符串，计算hash值并存放在cookie中，使产生的signedCookie放篡改
  secret: 'xmg',
  // 每个请求都重新设置一个cookie到客户端，默认为false
  rolling: true,
  // 产生一个新碟session_id时，所使用的函数，默认使用uid2这个npm包
  genid: function () {
    return uuid.v4();
  },
  // cookie的设置项
  cookie: {
    expires: new Date(Date.now() + 10000)
  },
  // session的存储方式，默认存放在内存中，也可以用redis，mongo等
  store: new SessionStore({ root: './sessions' })
}));
//当使用了session中中间件后，会在req.session属性。
//session就是客户端在服务器上保存的数据
//统计 客户端访问服务器的次数
app.get('/', function (req, res) {
  let count = req.session.count;
  if (count) {
    count += 1;
  } else {
    count = 1;
  }
  req.session.count = count;
  res.send('你这是第' + count + '次访问！');
});
app.listen(8080);