const { Transform } = require("stream");

// Transform也是一种双工流
// Transform 的可读流的数据会经过一定的处理过程自动进入可写流。
// 虽然会从可读流进入可写流，但并不意味这两者的数据量相同，上面说的一定的处理逻辑会决定如果 tranform 可读流，然后放入可写流，transform 原义即为转变，很贴切的描述了 Transform 流作用。
// 转换流, 实现数据转换
// 可用作加密
const t = Transform({
  transform(chunk, encoding, callback) {
    console.log(this);
    this.push(chunk.toString().toUpperCase());
    callback();
  },
});
// process.stdin.pipe(t).pipe(process.stdout);
process.stdin.setEncoding("utf-8");
process.stdin.on("data", (err, res) => {
  console.log(err);
});
