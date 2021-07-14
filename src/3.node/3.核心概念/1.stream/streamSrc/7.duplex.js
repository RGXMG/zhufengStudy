const { Duplex } = require("stream");

// 双工流
// Duplex 虽然同事具备可读流和可写流，但两者是相对独立的
// 可以生产数据，又可以消费数据，所以才可以处于数据流动管道的中间环节，常见的 Duplex 流有
// Tcp Scoket
// Zlib 读取压缩文件和进行压缩文件
// Crypto
let index = 0;
const duplex = Duplex({
  read() {
    if (index++ < 3) {
      this.push(index + "");
    } else {
      this.push(null);
    }
  },
  write(chunk, encoding, cb) {
    console.log(chunk.toString().toUpperCase());
    cb();
  },
});
// 利用标准输入和标准输出
process.stdin.pipe(duplex).pipe(process.stdout);
