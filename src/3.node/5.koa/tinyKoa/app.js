const TinyKoa = require('./src');
const staticFile = require('./src/middleware/tiny-koa-static');
const app = new TinyKoa();
app.use(staticFile('./src/middleware/tiny-koa-static/views'));
app.use(async function (ctx, next) {
  console.log('1 - start, ', ctx.res.end);
  await next();
  console.log('1 - end')
});
app.use(async function (ctx, next) {
  console.log('2 - start, ');
  await next();
  console.log('2 - end')
});
app.use(function (ctx, next) {
  console.log('3 - start, ');
  return new Promise(res => {
    setTimeout(() => {
      next();
      console.log('3 - end');
      ctx.body = { name: 'sssss' };
      res();
  }, 2000);
  });
});
app.listen(8080);
