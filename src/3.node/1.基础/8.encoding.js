/**
 * 字节编码
 */

// NOTE 进制表示
let a = 0b10100; // 二进制 20
console.log(a);
let b = 0o24; // 8进制 20
console.log(b);
let c = 24; // 10进制 20
console.log(c);
let d = 0x14; // 16进制 20
console.log(d);
// NOTE 将任意进制转为10进制
console.log(parseInt('0x10', 16)); // 将16进制的'0x10'字符串转为10进制得16
// NOTE 将10进制转为任意进制
console.log((20).toString(16)); // 将十进制的20转为16进制得'14'字符

// NOTE 编码格式
// ASCII码：美国人发明的编码格式，用一个8位字节表示，
console.log(15 * 16 ** 3 + 15 * 16 ** 2 + 15 * 16 ** 1 + 15);
