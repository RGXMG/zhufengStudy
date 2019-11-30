/**
 * 客户端场景：
 * 1. 爬虫
 * 2. node中间层
 */
const http = require('http');
// 头分为四种：
// 1. 通用头
// 2. 请求头
// 3. 响应头
// 4. 实体头
const options = {
  host: 'localhost',
  port: 8080,
  method: 'POST',
  headers: {
    "Content-Type":"application/x-www/form-urlencoded"
  }
};
// 请求没有真正发出，创建一个req刘对象，是一个可写流
const req = http.request(options);
// 当服务器端把请求体发过来的时候
// 客户端接收到服务器响应的时候
req.on('response', function (res) {
  console.log(res.statusCode);
  console.log(res.headers);
  // 虽然可以直接设置encoding为utf8
  // 但是为了预防出现分块传输(响应头为transfer-encoding: chunked)，显示错误
  // 最好不要这么写
  // res.setEncoding('utf8');
  const result = [];
  // 监听服务器端返回的数据
  res.on('data', function (data) {
    result.push(data);
  });
  res.on('end', function () {
    const str = Buffer.concat(result);
    console.log('result:', str.toString());
  });
});
// 向请求体里面写入数据
req.write('name=rgxmg&age=9');
// 结束写入请求体，只有在end()时候才会真正向服务器发送请求
req.end();
