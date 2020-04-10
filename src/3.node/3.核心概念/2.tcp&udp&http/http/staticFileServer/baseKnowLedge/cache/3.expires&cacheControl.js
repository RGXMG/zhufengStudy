/**
 * expires： 强制缓存
 * Expires = 时间，HTTP 1.0 版本，缓存的载止时间，允许客户端在这个时间之前不去检查（发请求）
 * max-age = 秒，HTTP 1.1版本，资源在本地缓存多少秒。
 * 如果max-age和Expires同时存在，则被Cache-Control的max-age覆盖。
 *
 * cache-Control，多个选项由逗号隔开
 * 1. private 只有客户端才能缓存
 * 2. max-age 设置文件的过期时间，单位为秒
 * 2. public 客户端和代理服务器都可以缓存
 * 3. no-cache 禁用强制缓存、需要使用对比缓存(last-modified)验证数据, 强制向服务器发送验证
 * 4. no-store 所有内容都不会缓存、强制缓存和对比缓存都不会触发
 * 5. must-revalidate https://zhuanlan.zhihu.com/p/60357719

 * Expires 的一个缺点就是，返回的到期时间是服务器端的时间，这样存在一个问题，如果客户端的时间与服务器的时间相差很* 大，那么误差就很大，所以在HTTP 1.1版开始，使用Cache-Control: max-age=秒替代。
 * 设置文件的过期时间、在过期时间之内，服务器均不发出真正的请求。直接使用本地文件
 */
const http = require("http");
const fs = require("fs");
const path = require("path");
const { promisify } = require("util");
const mime = require("mime");
const url = require("url");
const stat = promisify(fs.stat);
http
  .createServer(async function(req, res) {
    const { pathname } = url.parse(req.url);
    // 拼接路径
    const filepath = path.join(__dirname, pathname);
    try {
      // 判断当前路径是否存在
      await stat(filepath);
      send(res, filepath);
    } catch (e) {
      console.log(e);
      res.statusCode = 404;
      res.end("资源不存在");
    }
  })
  .listen(8080);
function send(res, filePath) {
  res.setHeader("Content-Type", mime.getType(filePath));
  res.setHeader("cache-Control", "max-age=50000");
  // 1.0版本的expires，现在基本被废弃
  res.setHeader("expires", new Date().toUTCString());
  fs.createReadStream(filePath).pipe(res);
}
