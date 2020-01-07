/**
 * 复杂一点的数据，如表单上传文件等，则需要使用koa-better-body中间件来解析
 */
const Koa = require('koa');
const path = require('path');
const fs = require('fs');
const betterBody = require('koa-better-body');
const queryString = require('querystring');
const convert = require('koa-convert');
const uuid = require('uuid');
const app = new Koa();

// app.use(convert(betterBody({
//   // 上传文件的路径
//   uploadDir: './uploads'
// })));
/**
 * 实现简单的路由
 * 1. get 返回简单表单
 * 2. post 提交数据，解析表单数据，然后返回
 */
app.use(async function (ctx, next) {
  if (ctx.url === '/user' && ctx.method === 'GET') {
    ctx.set('Content-Type', 'text/html;charset=utf8');
    ctx.body = `
      <form method="POST" enctype="multipart/form-data">
               <input type="text" name="username">
               <input type="file" name="file">
               <input type="submit">
      </form>
    `;
  } else await next();
});
app.use(async function (ctx, next) {
  if (ctx.url === '/user' && ctx.method === 'POST') {
    // 使用koa-better-body之后，提交的数据保存在ctx.request.fields中
    // ctx.body = ctx.request.fields;
    // 自实现
    const contentType = ctx.headers['content-type'];
    if (~contentType.indexOf('multipart/form-data')) {
      // 找到分隔符
      ctx.body = await receiveBody(ctx.req, contentType.match(/\bboundary=(.*)/)[1]);
    }
  } else next();
});

/**
 * 通过分隔符boundary获取body数据
 * @param req
 * @param boundary
 * @returns {Promise<unknown>}
 * ------WebKitFormBoundary2WK3bilBxisKdBXD
 Content-Disposition: form-data; name="username"

 123
 ------WebKitFormBoundary2WK3bilBxisKdBXD
 Content-Disposition: form-data; name="avatar"; filename="msg.txt"
 Content-Type: text/plain

 abc
 ------WebKitFormBoundary2WK3bilBxisKdBXD--
 */
function receiveBody (req, boundary) {
  return new Promise((resolve, reject) => {
    const buffers = [];
    req.on('data', function (data) {
      buffers.push(data);
    });
    req.on('end', function () {
      const fields = {};
      const buffersBody = Buffer.concat(buffers);
      const bodyParts = buffersBody.split('--' + boundary);
      // 去掉尾部的结束符(------WebKitFormBoundary2WK3bilBxisKdBXD--)的buffer
      bodyParts.pop();
      // 去掉开头的空白符
      bodyParts.shift();
      const getName = (v, name = 'name') => new RegExp(`${name}="([^"]+)`).exec(v)[1];
      bodyParts.forEach(part => {
        // 每个块内容的描述信息和内容都是有俩个换行符，windows: \r\n, mac/linux: \n
        const [ desc, content ] = part.split('\r\n\r\n');
        // 文件
        if (~desc.indexOf('filename')) {
          // 提取两行描述信息的name和filename属性
          const fieldName = getName(desc.toString());
          const fileExt = getName(desc.toString(), 'filename').split('.')[1];
          const filePath = path.join(__dirname, `uploads/${uuid.v4()}.${fileExt}`);
          // 写入文件到文件夹,同时去掉占据俩个字节的\r\n
          // 由于Windows的txt文件会加入ef bb bf
          fs.writeFileSync(filePath, content.slice(0, -2), { encoding: 'utf8' });
          // 读取文件信息
          const statInfo = fs.statSync(filePath);
          console.log('statInfo:::', statInfo);
          fields[fieldName] = {
            path: filePath, size: statInfo.size
          };
        } else {
          // 普通的键值对
          fields[getName(desc.toString())] = content.toString().replace('\r\n');
        }
      });
      resolve(fields);
      // 按照分割符分割，中间内容的分割符为--+boundary
    });
  })
}
app.listen(8080);
/**
 * 为Buffer曾加split方法
 * 实现原理，使用Buffer提供的split方法实现
 * 每次匹配到之后，保存从开始位置到匹配到分隔符位置的字符就是需要分割的内容
 */
Buffer.prototype.split = function (boundary) {
  let pos = 0;
  let index;
  const boundaryLen = boundary.length;
  const splitContent = [];
  while (~(index = this.indexOf(boundary, pos))) {
    splitContent.push(this.slice(pos, index));
    pos = index + boundaryLen;
  }
  // push未匹配到分隔符的最后一个内容(可能为空，但是依然需要保存)
  splitContent.push(this.slice(pos));
  return splitContent;
};
