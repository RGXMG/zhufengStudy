const Koa = require('koa');
const app = new Koa();
// koa全部使用async/await，丢弃了callback
app.use(async function(ctx, next) {
  console.log(1);
  await next();
  console.log(2);
});
app.use(async function(ctx, next) {
  console.log('a');
});
app.listen(8080);
