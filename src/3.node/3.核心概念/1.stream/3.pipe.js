/**
 * linux中经典的管道概念
 * 从一端读取，从另一端输入
 * 优点：
 * NOTE 1. 可以平衡读取和输入的速度，如从网络中读取数据，写入到本地
 * NOTE 2. 维护内存的使用平衡
 */
const fs = require("fs");
const rs = fs.createReadStream("./3.read.txt", {
  flags: "r",
  highWaterMark: 3,
});
const ws = fs.createWriteStream("./3.write.txt", {
  flags: "w",
  mode: 0o666,
  highWaterMark: 3,
});
// 监听读取事件
rs.on("data", function (data) {
  console.log("读取到文件", data);
  const flag = ws.write(data);
  if (!flag) {
    console.log("缓存已满，暂定读取");
    rs.pause();
  }
});
rs.on("end", () => {
  console.log("文件读取完成");
  // 文件读取完成使写入stream关闭
  ws.end();
});
// 缓存的drain事件
// 当缓存中的数据被清空，则继续读取并写入数据
ws.on("drain", () => {
  console.log("缓存已清空，恢复读取");
  // 恢复读取文件
  rs.resume();
});
ws.on("finish", () => {
  console.log("文件写入完成");
});
