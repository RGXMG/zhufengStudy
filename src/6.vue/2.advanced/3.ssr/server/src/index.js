const Koa = require("koa");
const path = require("path");
const fs = require("fs");
const Router = require("koa-router");
const serverRender = require("vue-server-renderer");

// NOTE 因为ssr渲染的时候，会请求一些静态文件，如css、js文件等，
//  但是这些文件都是位于dist目录下，所以我们需要一些静态文件的能力去代理这些个静态文件的请求
const Static = require("koa-static");

const app = new Koa();
const router = new Router();

app.use(router.routes());

const dist = p => path.join(__dirname, "../../dist/", p || "");
// 让所有静态文件请求都转发到dist下
app.use(Static(dist()));

// 读取template文件
const template = fs.readFileSync(dist("./index.ssr.html"), "utf8");
// const renderer = serverRender.createRenderer('');

// 通过打包后的dist文件建立client和server端的bundle文件联系
const serverManifest = require(dist("./vue-ssr-server-bundle"));
const clientManifest = require(dist("./vue-ssr-client-manifest"));
const renderer = serverRender.createBundleRenderer(serverManifest, {
  template,
  clientManifest
});
router.get("/", async ctx => {
  try {
    ctx.body = await new Promise((res, rej) => {
      renderer.renderToString({ url: "/" }, (err, content) => {
        if (err) rej(err);
        else res(content);
      });
    });
  } catch (e) {
    console.error(e);
  }
});

// 非/路由访问
app.use(async ctx => {
  try {
    ctx.body = await new Promise((res, rej) => {
      renderer.renderToString({ url: ctx.path }, (err, content) => {
        if (err) rej(err);
        else res(content);
      });
    });
  } catch (e) {
    console.log(e);
    ctx.body = e;
  }
});

app.listen(3000);
