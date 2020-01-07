/**
 * 创建一个服务器，
 * 1. 当向客户端发送数据的时候，
 * 2. 通过md5加密要响应体，将md5值通过响应头发送给客户端
 * 3. 客户端收到数据后(如浏览器是自动计算Content-Md5)，通过比较响应头中的md值是否与响应体加密之后的md5相等
 * 4. 相等就说明响应头未被篡改过，反之就被篡改过
 */
 const fs = require(fs);
 const http = require('http');
 const crypto = require('crypto');

 http.createServer(function(req, res) {
   const rs = fs.createReadStream('./2.msg.txt');
   const md5 = crypto.createHash('md5');
   const result = [];
   rs.on('data', function (data) {
     result.push(data);
     // 直接通过update连续生成摘要
     md5.update(data);
   });
   res.on('end', function () {
     // 设置响应头
     res.setHeader('Content-Md5', md5.digest('hex'));
     res.write(Buffer.concat(result).toString());
   });
 }).listen(8080);