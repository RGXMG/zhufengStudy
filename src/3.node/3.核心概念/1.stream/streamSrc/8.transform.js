const { Transform } = require('stream');

// 转换流, 实现数据转换
// 可用作加密
const t  = Transform({
  transform(chunk, encoding, callback) {
    console.log(this);
    this.push(chunk.toString().toUpperCase());
    callback();
  }
});
process.stdin.pipe(t).pipe(process.stdout);
