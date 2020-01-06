/**
 * 简单的form表单提交可以直接使用koa-bodyparser进行解析
 * 解析的值放在ctx.request.body上面
 */
const Koa = require('koa');
const app = new Koa();

/**
 * 实现简单的路由
 * 1. get 返回简单表单
 * 2. post 提交数据，解析表单数据，然后返回
 */
app.use(async function (ctx, next) {
  if (ctx.url === '/user' && ctx.method === 'GET') {
    ctx.set('Content-Type', 'text/html;charset=utf8');
    ctx.body = `
      <form method="post">
        <input type="text" name="username">
        <input type="text" name="pwd">
        <input type="submit">
      </form>
    `;
  } else await next();
});
app.use(async function (ctx, next) {
  if (ctx.url === '/user' && ctx.method === 'POST') {
    ctx.body = await parser(ctx.req);
  } else next();
});
function parser(req) {
  return new Promise(function (resolve, reject) {
    const buffers = [];
    req.on('data', function (data) {
      buffers.push(data);
    });
    req.on('end', function () {
      resolve(Buffer.concat(buffers).toString());
    });
    req.on('error', function (err) {
      reject(err);
    });
  });
}
app.listen(8080);
