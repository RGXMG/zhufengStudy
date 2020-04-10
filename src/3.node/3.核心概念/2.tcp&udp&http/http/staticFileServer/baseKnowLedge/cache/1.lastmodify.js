/**
 * 对比缓存 使用响应头的last-modified和if-modified-since
 * 第一次访问服务器时，服务器返回资源和缓存的规则，客户端则会把此资源缓存在本地
 * 第二次客户端访问该数据时，要取得该缓存的标识，然后问一下服务器是否有更新
 * 如果没有更新，则直接使用缓存，如果有更新，那就重新获取最新的数据,然后更新新的缓存规则
 * 1.发送给客户端最后修改时间
 * 2. 客户端会将此值保存，下一次访问该资源时，会带上该时间戳给服务器，存储在last-modified头部信息中
 * 3. 服务端获取头信息if-modified-since，然后比较，如果更改时间戳未改变，则返回状态304、客户端直接使用本地缓存的文件
 *
 * 问题所在：
 * 1. 某些服务器不能精准的获取到文件得修改时间、这样就无法使用最后的修改时间去判断
 * 2. 某些文件的修改时间很频繁、在秒以下的时间内进行修改，而对比缓存只能精确到秒
 * 3. 一些文件的修改时间变了，但是内容并未改变，所以对比缓存并不准确
 * 4. 如果一个文件位于多个CDN服务器上，但是修改时间并未相同
 */

// lastmodify 文件最后修改标识，用于判断客户端文件是否为最新
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
      const statFile = await stat(filepath);
      // 获取文件头信息 比较是否更改过
      const ifModifiedSince = req.headers["if-modified-since"];
      if (ifModifiedSince === statFile.ctime.toGMTString()) {
        res.writeHead(304);
        res.end();
      } else send(res, filepath, statFile);
    } catch (e) {
      console.log(e);
      res.statusCode = 404;
      res.end("资源不存在");
    }
  })
  .listen(8080);
function send(res, filePath, statFile) {
  res.setHeader("Content-Type", mime.getType(filePath));
  res.setHeader("Last-Modified", statFile.ctime.toGMTString());
  fs.createReadStream(filePath).pipe(res);
}
