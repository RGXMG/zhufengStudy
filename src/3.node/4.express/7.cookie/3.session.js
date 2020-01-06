const express = require('express');
const cookieParser = require('cookie-parser');
const uuid = require('uuid');
const app = express();
app.set('view engine', 'html');
app.set('views', './2.views');
app.engine('html', require('ejs').__express);
app.use(cookieParser());
// session
// 客户端保存的key
const SESSION_KEY = 'connect_id';
// 记录每一个卡号和内容的对应关系
const sessions = {};
app.get('/', function (req, res) {
  const sessionId = req.cookies[SESSION_KEY];
  if (sessionId) {
    let sessionObj = sessions[sessionId];
    if (sessionObj) {
      sessionObj.balance -= 10;
      res.render('user', { title: '老会员', username: `${sessionId}：消费10元，剩余${sessionObj.balance}` });
    } else {
      const id = createMemberCard();
      res.cookie(SESSION_KEY, id);
      res.render('user', { title: '错误', username: `未找到${sessionId}会员，已经为你重新办理会员卡，卡号为${id}` });
    }
  } else {
    const id = createMemberCard();
    res.cookie(SESSION_KEY, id);
    res.render('user', { title: '新会员', username: id });
  }
});

/**
 * 创建卡号
 * 1. 卡号不能重复
 * 2. 不容易猜测
 */
function createMemberCard() {
  let sessionId = uuid.v4();
  sessions[sessionId] = { balance: 100 };
  return sessionId;
}
app.listen(8080);