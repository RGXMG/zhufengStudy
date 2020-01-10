const Router = require('./src/middleware/tiny-koa-router');
const koaStatic = require('./src/middleware/tiny-koa-static');
const Koa = require('./src');
const app = new Koa();
const router = new Router();
app.use(koaStatic('./src/middleware/tiny-koa-static/views'));
app.use(router.router());
router.all('/hello', async (ctx, next) => {
  console.log('all - hello - s - 1');
  next();
});
router.all('/hello', async (ctx, next) => {
  console.log('all - hello - 2');
  ctx.body = 'Hello world';
});
router.all('/hello', async (ctx, next) => {
  console.log('all - hello - 3');
  next();
});
app.use(async function (ctx, next) {
  console.log('middleware 1 s');
  next();
  console.log('middleware 1 e');
});
app.use(async function (ctx, next) {
  console.log('middleware 2 s');
  next();
  console.log('middleware 2 e');
});
app.listen(8080);
