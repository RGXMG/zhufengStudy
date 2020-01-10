// https://github.com/geeknull/tiny-koa/blob/master/src/middleware/tiny-koa-views.js
const path = require('path');
const fs = require('fs');
const mineType = require('mime');
const promisify = require('util').promisify;

module.exports = (baseDirPath) => async (ctx, next) => {
  const { path: url } = ctx;
  const toRender = async (url, dirPath) => {
    const list = await promisify(fs.readdir)(dirPath);
    return render(ctx, list.map(i => url === '/' ?  i : url + '/' + i));
  };
  if (url === '/') {
    return await toRender(url, baseDirPath);
  }
  try {
    const trackPath = path.join(baseDirPath, url);
    const stat = await promisify(fs.stat)(trackPath);
    if (stat.isDirectory()) {
      return await toRender(url, trackPath);
    }
    ctx.response.set('Content-Type', mineType.getType(trackPath));
    return ctx.body = fs.createReadStream(trackPath);
  } catch (e) {
    next();
  }
};

const render = function(ctx, fileList) {
  ctx.response.set('Content-Type', 'text/html');
  ctx.body = `<ul>
       ${
    fileList.map(file => '<li><a href="' + file + '">'+ file +'</a></li>').join('')
  }
    </ul>`;
};
