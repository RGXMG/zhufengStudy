/**
 * HMAC 加密 - 也是生成摘要
 * 服务端和客户端双方约定秘钥，然后进行加密和验证
 * 通过秘钥加密 - 实际上就是加盐算法
 * 一般秘钥都是通过openSSL生成
 * openssl genrsa -out rsa rsa_private.key 1024
 * @type {module:crypto}
 */
const crypto = require('crypto');
const path = require('path');

// 向HMAC中指定sha1的加密算法, 同时指定秘钥
const hmac = crypto.createHmac('sha1', 'hello');
hmac.update('123');
console.log(hmac.digest('hex'));