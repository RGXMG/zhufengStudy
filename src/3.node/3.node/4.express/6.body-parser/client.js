const http = require('http');
// 可以创建特定格式的字符，如gbk
const iconv = require('iconv-lite');
const zlib = require('zlib');
const options = {
  host: 'localhost',
  port: 8080,
  path: '/user',
  method: 'post',
  headers: {
    // 表单格式
    // 'Content-Type': 'application/x-www-form-urlencoded',
    // json格式
    // 'Content-Type': 'application/json',
    // 文本格式和编码
    'Content-Type': 'text/plain;charset=gbk',
    // 压缩
    'Content-Encoding': 'gzip'
  }
};
const req = http.request(options, function (response) {
  response.pipe(process.stdout);
});
// x-www-form-urlencoded格式
// req.write('hello=你好！&');
// req.write('hello2=你好！&');
// end方法里面传入数据会触发一次write事件，然后立即触发end事件
// req.end("name=xmg&age=8");

// json格式
// req.end('{"name":"xmg"}');

// text格式 nodejs默认为utf8格式
// req.end('你好！');
// text格式 使用iconv创建gbk编码格式字符
// req.end(iconv.encode('你好！', 'gbk'));

const body = iconv.encode('你好，你好，你好', 'gbk');
zlib.gzip(body, function (err, data) {
  req.end(data);
});
