/**
 *
 */
const fs = require("fs");

/**
 * readFile 读取文件
 * flags:
 * r: 只读
 * r+: 读取并写入，文件不存在就报错
 * w: 写入文件，不存在就创建，存在则清空
 * w+: 读取并写入，文件不存在则创建，存在则清空
 * rs: 同步读取文件并忽略缓存
 * wx: 排它写入文件
 * a(append): 追加写入
 * ax: 与a类似，排它方式写入
 * a+: 读取并追加写入，不存在则创建
 * ax+: 作用与a+类似，但是以排它方式打开文件
 *
 * +：增加相反操作
 * s: 同步操作
 * x: 排它方式，操作该文件期间，其他程序不能操作该文件
 * r+ w+: 1. 当文件不存在时，r+不会创建文件，且会导致调用错误，w+会创建一个新文件
 *        2. 当文件存在时。r+不会清空文件，而w+会清空文件
 */
// fs.readFile('./1.txt', { encoding: 'utf8', flag: 'r+' }, function(err, res) {
//   if (err) {
//     console.log(err);
//   } else {
//     console.log(res);
//   }
// });

/**
 * 写文件
 * mode: 创建 文件的权限位，linux文件权限
 * 0o666
 * -rw-rw-rw-
 * 文件所有者/文件所属组/其他用户
 * -42-42-42
 * 用Linux命令更改2.txt权限为可读可写可执行：chmod 777 2.txt
 */
// fs.writeFile('./2.txt', 'test write content in file',
//   { encoding: 'utf8', flag: 'a', mode: 0o666 }, function(err, res) {
//   if (err) console.log(err);
//   else console.log(res);
// });
// fs.appendFile('./2.txt', 'test write content in file',
//   function(err, res) {
//     if (err) console.log(err);
//     else console.log(res);
//   });
/**
 * NOTE 上述操作都是将文件当成一个整体，readFile,appendFile,writeFile等
 * 直接读入到内存中去操作，在某些情况下存在一些问题：
 * 1. 如果文件太大，甚至超过内存大小，是无法完成的
 * 2. 读取大文件时，性能低下，效率低，
 * NOTE 解决办法，精确的获取想要操作的字节位置，通过open,write等方法
 * fd: file descriptor 文件描述器，当打开一个文件时，node会自动为你分配一个描述器，从0开始
 * 其中 0：标准输入，在控制台输入(process.stdin.on('data', function(data){ console.log(data) }))
 *      1：标准输出(console.log -> process.stdout.write())
 *      2：错误输出(console.error -> process.stderr.write())
 */
// fs.open('./2.txt', 'w', 0o666, function(err, fd) {
//   if (err) {
//     console.error(err);
//     return;
//   }
// 通过write写入
// note 当调用write写入文件时，并不会直接写入到物理文件当中，而是先写入到缓存区，在批量写入物理文件
// NOTE 参数依次为：描述器，写入的buffer, buffer的偏移量, 写入几个字节, 从哪个位置开始写入,位置填写null时位置自动维护
// note callBack中的第二个参数为实际写入的字节数bytesWritten
// fs.write(fd, Buffer.from('珠峰'), 3, 3 , 0, function(err, res) {
//   if (err) {
//     console.error(err);
//     return;
//   }
//   console.log(res);
// });
// });

/**
 * 截断文件
 * fs.truncate(path, len, callback)
 * 参数依次为： 路径，字节长度，回调函数
 * NOTE 该方法会直接更改源文件
 */
fs.truncate("./1.txt", 7, function (err, res) {
  console.log("---", res);
});
