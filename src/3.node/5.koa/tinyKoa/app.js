const TinyKoa = require('./src');
const app = new TinyKoa();
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