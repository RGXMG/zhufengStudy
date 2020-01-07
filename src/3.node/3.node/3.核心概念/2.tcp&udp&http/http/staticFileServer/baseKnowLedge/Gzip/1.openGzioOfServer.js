const http = require('http');
const fs = require('fs');
const url = require('url');
const path = require('path');
const zlib = require('zlib');
const { promisify } = require('util');
const statIfy = promisify(fs.stat);
// 通过路径获取一个文件的类型
const mime = require('mime');
/**
 * 服务端需不需要压缩以及压缩格式需要内容协商
 * 由客户端的headers中的字段决定
 * 客户端会通过Accept-Ending中告诉服务端当前支持压缩格式
 */
http.createServer(async function (req, res) {
  console.log('url', req.url, 'method:', req.method);
  // 获取访问的路径
  const { pathname } = url.parse(req.url);
  // 拼接本地路径和访问路径，便于定位真正的物理路径
  const filepath = path.join(__dirname, pathname);
  try {
    // 判断当前路径下的文件是否有状态
    // 如果有状态，证明文件存在，反之不存在
    // 直接返回404
    const status = await statIfy(filepath);
    // 需要根据不同的文件类型放回不同的Content-Type
    res.setHeader('Content-Type', mime.getType(filepath));
    // 获取accept-encoding,
    // 为了兼容所有的浏览器，node将所有的header的字段名改为了小写
    const acceptEncoding = req.headers['accept-encoding'];
    if (!acceptEncoding) {
      return fs.createReadStream(filepath).pipe(res);
    }
    if (acceptEncoding.match(/\bgzip\b/)) {
      // 设置文件的压缩格式
      res.setHeader('Content-Encoding', 'gzip');
      // zlib.createGzip()会返回一个transform转换流
      fs.createReadStream(filepath).pipe(zlib.createGzip()).pipe(res);
    } else if (acceptEncoding.match(/\bdeflate\b/)){
      res.setHeader('Content-Encoding', 'deflate');
      // zlib.createDeflate()会返回一个transform转换流
      fs.createReadStream(filepath).pipe(zlib.createDeflate()).pipe(res);
    }
  } catch (e) {
    res.statusCode = 404;
    res.end();
  }
}).listen(8080);