const express = require('express');
const bodyParser = require('body-parser');
const iconv = require('iconv-lite');
const contentTypeParser = require('content-type');
const qs = require('qs');
const zlib = require('zlib');
const querystring = require('querystring');
const app =  express();
// 处理text文本
// app.use(bodyParser.text());
app.use(text());
// 处理json格式
// app.use(bodyParser.json());
app.use(json());
// 处理application/x-www-form-urlencoded格式的请求
// app.use(bodyParser.urlencoded({ extended: true }));
app.use(urlencoded({ extended: true }));
app.post('/user', function (req, res) {
  const body = req.body;
  console.log('接收到客户端发来的数据:::', body);
  // send方法根据参数的类型进行兼容处理
  // 1. body为object，装为json
  // 2. body为数字，将body设为code，并且返回http.STATUS_CODES[body]
  // 3. 其他的直接end()返回
  res.send(body);
});
app.listen(8080);

/**
 * extended 为true代表使用qs库，反之使用queryString
 * @param options
 */
function urlencoded(options) {
  const { extended } = options;
  return function(req, res, next) {
    const contentType = req.headers['content-type'];
    if (contentType !== 'application/x-www-form-urlencoded') return next();
    const buffers = [];
    // http客户端每调用req.write一次，则会触发data事件
    req.on('data', function (data) {
      console.log('data', data);
      buffers.push(data);
    });
    // http客户端调用end事件时触发end
    req.on('end', function () {
      const res = buffers.toString();
      // qs支持对象嵌套，如{ name: { id: 12 } }
      // 而querystring则遇到嵌套对象时直接抛弃
      req.body = extended ? qs.parse(res) : querystring.parse(res);
      next();
    });
  }
}

/**
 * 处理json格式
 * @returns {Function}
 */
function json() {
  return function(req, res, next) {
    const contentType = req.headers['content-type'];
    if (contentType !== 'application/json') return next();
    const buffers = [];
    // http客户端每调用req.write一次，则会触发data事件
    req.on('data', function (data) {
      console.log('data', data);
      buffers.push(data);
    });
    // http客户端调用end事件时触发end
    req.on('end', function () {
      const res = buffers.toString();
      req.body = JSON.parse(res);
      next();
    });
  }
}

/**
 * 处理文本text格式
 * @returns {Function}
 */
function text() {
  return function(req, res, next) {
    const contentType = contentTypeParser.parse(req.headers['content-type']);
    const encoding = req.headers['content-encoding'];
    console.log('contentType::', contentType);
    if (contentType.type !== 'text/plain') return next();
    const buffers = [];
    // http客户端每调用req.write一次，则会触发data事件
    req.on('data', function (data) {
      buffers.push(data);
    });
    // http客户端调用end事件时触发end
    req.on('end', function () {
      let body = Buffer.concat(buffers);
      if (encoding === 'gzip') {
        body = zlib.unzipSync(body);
      }
      const charset = contentType.parameters.charset;
      req.body = charset === 'utf8' ? body.toString() : iconv.decode(body, charset);
      next();
    });
  }
}
