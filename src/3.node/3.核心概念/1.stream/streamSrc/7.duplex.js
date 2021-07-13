const { Duplex } = require("stream");
// 双工流

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
