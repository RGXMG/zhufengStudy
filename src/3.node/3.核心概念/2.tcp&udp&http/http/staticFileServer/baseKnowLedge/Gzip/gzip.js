/**
 * 压缩文件
 */
const fs = require('fs');
const zlib = require('zlib');
// 用于实现压缩
// 实际上createGzip就是transform转换流 继承自duplex双工流
function gzip(src) {
  fs.createReadStream(src).pipe(zlib.createGzip()).pipe(fs.createWriteStream(src + '.gz'));
}
// 解压
// path.basename(path, extra) 获取路径中的文件名称，如果不传extra获取出来的文件就包含扩展名，传extra就不包含扩展名
// path.extname() 获取文件名称中的扩展名
function gunzip(src) {
  fs.createReadStream(src).pipe(zlib.createGunzip()).pipe(fs.createWriteStream(src + '.txt'));
}
// gzip('./msg.txt');
gunzip('./msg.txt.gz');