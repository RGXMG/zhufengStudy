/**
 * 对称加密，直接对内容进行加密，不是md5和hmac的摘要算法
 * 提供一种秘钥，加密和解密都是用同一个秘钥
 */
const crypto = require('crypto');
// 秘钥
// 一般都是通过openSLL生成一个秘钥文件
// const pk = '929692969296fdsfs';
// createCipheriv 加密算法、秘钥，iv初始化向量
// iv初始化向量：见维基百科https://wikipedia.hk.wjbk.site/baike-%E5%88%9D%E5%A7%8B%E5%90%91%E9%87%8F
// 加密
function genSign(src, key, iv) {
  let sign = '';
  const cipher = crypto.createCipheriv('aes-128-cbc', key, iv);
  sign += cipher.update(src, 'utf8', 'hex');
  sign += cipher.final('hex');
  return sign;
}

// 解密
function deSign(sign, key, iv) {
  let src = '';
  const cipher = crypto.createDecipheriv('aes-128-cbc', key, iv);
  src += cipher.update(sign, 'hex', 'utf8');
  src += cipher.final('utf8');
  return src;
}

// 加密
// ase-128-cbc 加密算法要求key和iv长度都为16
const key = Buffer.from('9vApxLk5G3PAsJrM', 'utf8');
const iv = Buffer.from('FnJL7EDzjqWjcaY9', 'utf8');
const sign = genSign('hello world', key, iv);
console.log(sign); // 764a669609b0c9b041faeec0d572fd7a


// 解密
const src=deSign('764a669609b0c9b041faeec0d572fd7a', key, iv);
console.log(src); // hello world
