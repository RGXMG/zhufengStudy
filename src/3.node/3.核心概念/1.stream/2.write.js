/**
 * NOTE 可写流
 */
const fs = require('fs');

/**
 * 写入流
 * 1. 写入数据时，先写入设定的highWaterMark大小的缓存区,当存满了，就一次性真正的写入
 * @type {WriteStream}
 */
const ws = fs.createWriteStream('2.write.txt', {
  flags: 'w',
  mode: 0o666,
  start: 0,
  highWaterMark: 3
});

// 通过flags可以判断是否已经写满缓存区
// NOTE 如果返回false，则代表缓存区已经写满，如果返回true，则可以继续写入
// NOTE 如果返回false，而继续写入的话，数据也不会丢失，会被保存在内存中，待缓存区清空后，会继续写入
let flag = ws.write('1');
console.log(flag);
flag = ws.write('1');
console.log(flag);
flag = ws.write('1');
console.log(flag);
flag = ws.write('1');
console.log(flag);

/**
 * drain事件
 * NOTE 当缓存区被充满时，flag会返回false，在缓存区把文件提交给底层系统并清空之后
 * NOTE 就会触发drain事件，所以在flag返回false之后，就不应再写入数据，知道触发drain事件
 */
ws.on('drain', () => {
  console.log('drain');
});

// end方法
// 表明接下来没有数据要被写入
// NOTE 1.chunk 可选 可以在关闭之前写入一段数据
// NOTE 2.callback 将会作为finish事件的回调函数
ws.end((cc) => {
  console.log('所有数据都已经写入完成1');
});
/**
 * 当调用了end()方法后，且缓冲区的数据都已经传递给了底层系统之后，'finish'事件都会被触发
 */
ws.on('finish', () => {
  console.log('所有数据都已经写入完成');
});