/**
 * 创建目录
 */
const fs = require('fs');
// 1.创建目录
// 不能创建父目录不存在的目录，如'a/b'，当a目录不存在时候，就不能创建b目录和a目录
// 会直接导致错误
// fs.mkdir('a', function(err) {
//   console.error(err);
// });

// 2. 判断一个目录存不存在
// fs.access('a', fs.constants.R_OK, function(err) {
//   err && console.error(err);
// });

