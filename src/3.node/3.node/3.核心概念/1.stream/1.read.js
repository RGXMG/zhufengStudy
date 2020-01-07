/**
 * 流 stream
 * NOTE 俩种模式
 * NOTE 1.flow 流动模式，不缓存，读到内容就发送，如on('data')、pipe();
 * NOTE 2.pause 暂定模式，利用缓存，缓存装满，才发送
 */
// NOTE 可读流: 可以从某地地方读取出数据
let fs = require('fs');

const rs = fs.createReadStream('1.read.txt', {
  flags: 'r',
  mode: 0o666,
  encoding: 'utf8',
  // NOTE 从索引为3的位置开始读取，为闭区间 [
  // start: 3,
  // NOTE 索引为8的时候结束读取，为闭区间 ]
  // end: 8,
  highWaterMark: 3
});
/**
 * NOTE 如果是文件流 则存在open事件
 */
// rs.on('open', () => {
//   console.log("open");
// });
// /**
//  * NOTE 如果是文件流 则存在close事件
//  */
// rs.on('close', () => {
//   console.log('close');
// });
// /**
//  * on data
//  * 监听文件读取data事件
//  * data事件会按照设定的highWaterMark(默认为32KB)读取文件字节数，
//  * NOTE flow模式，不经过缓存
//  * NOTE 所以data事件callback会被回调多次，直到文件读取完成
//  * NOTE 流具有恢复和暂定机制，供接受者处理完刚刚接收到的数据
//  */
// rs.on("data", (data) => {
//   console.log(data);
//   rs.pause(); // 暂定读取
//   setTimeout(() => {
//     rs.resume(); // 恢复读取
//   }, 2000);
// });
// rs.on('error', e => {
//   console.log(e);
// });
// rs.on('end', () => {
//   console.log('end');
// });

/**
 * readabled事件
 * NOTE 监听数据是否准备完成，完成即可调用read事件
 * NOTE pause模式
 * NOTE rs读取highWaterMark指定大小的数据进行缓存，
 * NOTE 当手动调用read方法时，返回数据，并更新缓存，再次异步以highWaterMark指定大小进行读取数据，添加到缓存中
 */
rs.on('readable', () => {
  console.log('触发readable');
    const data = rs.read();
    console.log(data);
  //   // 缓存区大小
    console.log('length',rs._readableState.length);
    const data2 = rs.read();
  console.log(data2);
  console.log('length', rs._readableState.length);
});