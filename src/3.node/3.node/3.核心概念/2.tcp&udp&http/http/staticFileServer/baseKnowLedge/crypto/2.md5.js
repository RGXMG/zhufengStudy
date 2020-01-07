/**
 * md5 加密(实际就是生成内容的摘要，并不是对内容进行加密) -
 * 不太安全，因为位数较短32个, 而且加密算法是公开的，输入相同的值输出就是相同的值，可以通过暴力和自建一个md5加密过得密码库进行反推。
 * 1. 可以用来检验要下载的文件是否被改动过 - 见2.md5_server.js
 * 2. 对密码进行加密
 */
const crypto = require('crypto');
const str = 'hello';
// 输出支持的加密方式
// console.log(crypto.getHashes());
const md5 = crypto.createHash('md5');
// 指定要加密的值
md5.update(str);
// 再次添加要加密的值
// md5.update('world');
// 输入加密后的md5值
// hex：16进制， 指定输出的格式
console.log(md5.digest('hex'));
