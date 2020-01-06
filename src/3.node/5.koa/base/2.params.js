const Koa = require('koa');
const app = new Koa();
// koa全部使用async/await，丢弃了callback
/**
 * ctx 中有4个属性
 * request: koa自己封装request对象
 * response: koa自己封装response对象
 * req: node自己的request对象
 * res: node自己的response对象
 */
app.use(async function(ctx, next) {
  console.log(ctx.method);
  console.log(ctx.url);
  console.log(ctx.headers);
  // 查询字符串
  console.log(ctx.querystring);
  // 查询对象
  console.log(ctx.query);
  // 向客户端写入数据，等于ctx.response.body
  // 但是不能使用res.write/res.end
  // 支持字符串/Buffer/对象/流
  ctx.body = '123';
  await next();
});
app.use(async function(ctx, next) {
  console.log('a');
});
app.listen(8080);
