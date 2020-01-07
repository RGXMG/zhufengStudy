/**
 * ETag缓存机制 通过ETag(服务端向客户端发送)和if-None-Match(客户端向服务端发送)
 * 根据实体内容生成一段hash字符串、可以标识资源的状态、当资源发生改变时，ETag也会发生改变
 * 实质上就是生成一段文件内容摘要进行判断，所以要用到crypto模块
 *
 * 存在的问题：
 * 1. 如果文件太大、则需要很长的时间生成摘要
 */
const http = require('http');
const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const mime = require('mime');
const crypto = require('crypto');
const url  = require('url');
const stat = promisify(fs.stat);
http.createServer(async function (req, res) {
  const { pathname } = url.parse(req.url);
  // 拼接路径
  const filepath = path.join(__dirname, pathname);
  try {
    // 判断当前路径是否存在
    await stat(filepath);
    // 获取文件头信息 比较是否更改过
    const ifNoneMatch = req.headers['if-none-match'];
    const hash = await getHash(filepath);
    if (ifNoneMatch === hash) {
      res.writeHead(304);
      res.end();
    } else send(res, filepath,  hash);
  } catch (e) {
    console.log(e);
    res.statusCode = 404;
    res.end('资源不存在');
  }

}).listen(8080);
function getHash(filePath) {
  return new Promise(res => {
    const md5 = crypto.createHash('md5');
    const rs = fs.createReadStream(filePath);
    rs.on('data', function (data) {
      md5.update(data)
    });
    rs.on('end', function () {
      res(md5.digest('hex'));
    });
  });
}
function send(res, filePath, hash) {
  res.setHeader('Content-Type', mime.getType(filePath));
  res.setHeader('ETag', hash);
  fs.createReadStream(filePath).pipe(res);
}