/**
 *使用中间件koa-bodyparser来解析body
 */
const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const app = new Koa();

/**
 * 实现简单的路由
 * 1. get 返回简单表单
 * 2. post 提交数据，解析表单数据，然后返回
 */
app.use(bodyParser());
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
    // 通过koa-bodyparser中间件来处理body
    ctx.body = ctx.request.body;
  } else next();
});
app.listen(8080);
