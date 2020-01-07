/**
 * express内置中间件 static
 */
const express = require('express');
const path = require('path');
const mime = require('mime');
const url = require('url');
const { promisify } = require('util');
const fs = require('fs');
const stat = promisify(fs.stat);
const app = express();

/**
 * 1. 拦截客户端响应、如果是静态文件，则找寻静态文件返回，是路由，则next
 * 2. 确定如何处理点文件, 例如.gitignore这类点文件，deny拒绝访问，allow允许访问，ignore忽略
 * 3. ...
 * @param root
 * @param options
 */
function static(root, options = {}) {
  return function(req, res, next) {
    // 访问localhost:8080/index.html -> pathname=/index.html
    const { pathname } = url.parse(req.url, true);
    // 连接路径
    const filePath =path.join(root, pathname);
    // 确认文件是否存在
    stat(filePath).then(() => {
      // 创建可读流传递给客户端
      // 通过mime获取文件类型
      res.setHeader('Content-Type', mime.getType(filePath));
      fs.createReadStream(filePath).pipe(res)
    }, () => next());
  }
}
app.use(static(path .join(__dirname, 'public')));
app.get('/user', function (req, res) {
  res.join({user: 'xmg'});
});
app.listen(8080);
