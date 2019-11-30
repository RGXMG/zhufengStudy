const zlib = require('zlib');

/**
 * 字符串压缩
 * @type {module:zlib}
 */
const str = 'hello world';
zlib.gzip(str, (err, buffers) => {
  console.log(buffers.length);
  console.log('压缩后', buffers);
  zlib.unzip(buffers, (err, data) => {
    console.log('解压后', data.toString());
  })
});