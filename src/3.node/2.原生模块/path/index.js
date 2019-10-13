const path = require('path');

// 连接俩个目录
console.log(path.join('a', 'c/d'));

/**
 * resolve 从当前路径出发(__dirname) 解析出一个绝对路径
 * ../ 代表上一个目录
 * . 代表当前目录
 * 字符串 a 代表当前目录 下面的a目录
 * /a 代表分区根目录下面的a目录 -> H:\a
 */
console.log(path.resolve('/a'));

/**
 * delimiter 当前操作系统下变量分割符
 * 1. win32 ;
 * 2. posix :
 * sep 当前系统下路径分割符
 * 1. win32 \
 * 2. posix /
 */
console.log(path.win32.delimiter);
console.log(path.posix.delimiter);
console.log(path.win32.sep);
console.log(path.posix.sep);

/**
 * relative 获得俩个路径之间的相对路径
 */
console.log(path.relative('../path', '../b'));

/**
 * basename 获取的是文件名，包括扩展名，可以提供第二个参数，去掉扩展名
 * extname 扩展名
 */
console.log(path.basename('1.jpg'));
console.log(path.basename('1.jpg', '.jpg'));
console.log(path.extname('1.jpg'));
