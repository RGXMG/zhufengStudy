// 可读可写流
// 自定义可读可写流
const { Writable, Readable } = require('stream');
let i = 0;
const rs = Readable({
  highWaterMark: 2,
  read() {
    if (i < 10) {
      this.push('' + i ++ );
    } else {
      // push null 代表结束
      // 否则就会一直读取
      this.push(null);
    }
  }
});
const ws = Writable({
  highWaterMark: 2,
  // 缓存的大小等于highWaterMark时，返回true
  // 手动调用callback，代表可以继续消费，否则不会再次调用write
  write(chunk, encoding, callback) {
    console.log(chunk.toString());
    callback();
  }
});
rs.pipe(ws);