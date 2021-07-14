/**
 * 1. http服务器源码、解析请求头、
 * 2. http压缩
 * 3. 压缩和解压
 */
const http = require("http");
const querystring = require("querystring");
/**
 * 创建服务器，默认回调函数为request的监听事件
 * @type {Server}
 */
const server = http.createServer();
// req和res都是socket生成来的，http内部先监听socket.on('data'),当data事件触发的时候，
// 就会去创建req和res
server.on("request", function (req, res) {
  console.log("url", req.url, "method:", req.method);
  // 调用write方法时就会向客户端发送一次数据
  // 这就是分块传输，直到调用res.end()方法，客户端才会停止
  // 会自动向客户端添加响应头'transfer-encoding': 'chunked'
  // 如果客户端是浏览器，那么类似的可以为图片的加载
  // setInterval(() => {
  //   res.write('nihao~~');
  // }, 1000);
  const result = [];
  req.on("data", function (data) {
    console.log("jieshou:::", data);
    result.push(data);
  });
  req.on("end", function () {
    const str = Buffer.concat(result).toString();
    // 根据headers中不同的ContentType去处理不同的数据格式
    // 如表单格式：application/x-www-form-urlencoded
    // 如json格式：application/json
    const contentType = req.headers["content-type"];
    let data = "";
    switch (contentType) {
      case "application/x-www/form-urlencoded":
        data = querystring.parse(str);
        break;
      case "application/json":
        data = JSON.parse(str);
        break;
      default:
        console.log("we done't know the " + contentType + ":", str);
        break;
    }
    console.log("已经完整的接受到了客户端返回的数据：", JSON.stringify(data));
    res.end(JSON.stringify(data));
  });
});
// connection 监听事件是由tcp服务创建
// 在连接该服务时，会先触发connection事件，再出发request事件
// server.on('connection', function (socket) {
//
// });
server.listen(8080, () => {
  console.log("server already on port 8080");
});
