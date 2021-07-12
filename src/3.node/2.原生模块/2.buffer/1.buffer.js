/**
 * JavaScript 语言没有读取或操作二进制数据流的机制。 Buffer 类被引入作为 Node.js API 的一部分，使其可以在 TCP 流或文件系统操作等场景中处理二进制数据流
 * 创建Buffer
 * 采用UTF-8编码格式
 * @type {Buffer}
 */
// 表示分配 一个长度为6个字节的Buffer
// 会把所有的字节初始化为0
let buf1 = Buffer.alloc(6, 20);
console.log(buf1);

// 不初始化创建,直接从内存中找寻一块内存
let buf2 = Buffer.allocUnsafe(6);
console.log(buf2);

// 根据内容进行创建
let buff3 = Buffer.from("珠峰");
console.log(buff3);

// write, 写入
// 1.写入的字符串，2.填充的开始索引，3.填充的字节长度 4.编码
buf2.write("珠", 0, 3, "utf8");
console.log(buf2);
buf2.write("峰", 3, 3, "utf8");
console.log(buf2);

// writeInt[8/16...]
// writeInt8写入的最大十进制为255
// writeInt16写入的最大十进制为65535
// 向指定的索引写入一个8位/16位的整数，也就是说占用几个字节
const buf3 = Buffer.alloc(6); // 创建一个为0的6个字节的buffer
buf3.writeInt8(0, 0); // 向buf3的第0位写入0, 此时buf3等于<Buffer 00 00 00 00 00 00>
buf3.writeInt8(16, 1); // 向buf3的第1位写入16，此时buf3等于<Buffer 00 10 00 00 00 00>
buf3.writeInt8(32, 2); // 向buf3的第1位写入16，此时buf3等于<Buffer 00 10 20 00 00 00>
console.log(buf3);

// writeInt16BE/writeInt16LE
// 写入16位，也就是8个字节，
// BE: Big Endian 高位在前，
// LE: Little Endian 低位在前，
// 如表示256转为16机制为 01 00 (俩个字节)，BE则为：01 00，LE则为：00 10
// 使用哪种方式进行储存的，就用哪种方式读取，否则会造成误差极大
const buf4 = Buffer.alloc(4);
buf4.writeInt16BE(256, 0); // 存入256，在0开始
console.log(buf4);
buf4.writeInt16LE(256, 2); // 存入256，在2开始
console.log(buf4);
console.log(buf4.readInt16BE(0));
console.log(buf4.readInt16LE(2));

// slice
// 截取一段Buffer，但是是浅拷贝
const buf5 = Buffer.alloc(6, 1);
console.log(buf5); // <Buffer 01 01 01 01 01 01>
const buf6 = buf5.slice(3, 6);
console.log(buf6); // <Buffer 01 01 01>
buf6.fill(12);
console.log(buf6); // <Buffer 0c 0c 0c>
console.log(buf5); // <Buffer 01 01 01 0c 0c 0c>

// string_decoder 模块
// 该模块会判断write写入的buffer是否能够使完整的字符串，
// 它会返回完整的字符串，把剩下的buffer缓存
// 是为了解决非完整字符串Buffer形成的乱码
const buf7 = Buffer.from("珠峰培训");
const buf8 = buf7.slice(0, 5);
console.log(buf8.toString()); // 珠�
const buf9 = buf7.slice(5);
console.log(buf9.toString()); // �培训
// 因为一个中文汉字占用3个字节，而slice时候把峰字的3个字节进行了拆分，导致了乱码
const { StringDecoder } = require("string_decoder");
const sd = new StringDecoder();
console.log(sd.write(buf8)); // 珠, 它会将剩下的buffer进行缓存，
console.log(sd.write(buf9)); // 峰培训, 将上次缓存的buffer进行组合，得到3个字

// copy 方法
// 复制Buffer把多个Buffer拷贝到一个大Buffer
const buf10 = Buffer.from("珠峰");
const buf11 = Buffer.alloc(6);
// 自己实现copy方法
Buffer.prototype.copySelf = function (
  targetBuffer,
  targetStart,
  sourceStart,
  sourceEnd
) {
  for (let i = sourceStart; i < sourceEnd; i++) {
    targetBuffer[targetStart + 1] = this[i];
  }
};
buf10.copySelf(buf11, 0, 0, 3);
console.log(buf10);
console.log(buf11);

// concat 方法
// 连接多个buffer
const buf12 = Buffer.from("珠峰");
const buf13 = Buffer.from("培训");
// 自己实现copy方法
Buffer.concatSelf = function (
  list,
  total = list.reduce((t, i) => i.length + t, 0)
) {
  const flat = [];
  for (const i of list) {
    for (const b of i) {
      flat.push(b);
    }
  }
  return Buffer.from([...Array(total)].map((_, i) => flat[i]));
};
console.log(Buffer.concatSelf([buf12, buf13], 12).toString());
