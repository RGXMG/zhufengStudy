/**
 * 在node中，不支持GBK的编码格式
 * 因为GBK/GBK2312等此类编码都是国人自己的编码格式
 * 在此类编码中，一个汉字占据2个字节，而node默认的UTF-8一个汉字占据3个字节
 * 现在一般采用iconv-lite库进行读取此类编码格式的文件
 */
const fs = require('fs');
const iconv = require('iconv-lite');

fs.readFile('./2.readGbk.txt', function(err, data) {
  // <Buffer b2 e2 ca d4>
  console.log(data);
  try {
    // TypeError [ERR_UNKNOWN_ENCODING]: Unknown encoding: GBK
    console.log(data.toString('GBK'));
  } catch (e) {
    console.log('无法读取GBK编码格式，采用iconv解决');
    // 进行转码操作，将GBK转为UTF-8字符串
    const str = iconv.decode(data, 'gbk');
    console.log(str);
  }

});