const pathToRegexp = require('path-to-regexp');

const path = '/user/:uid/:name';
// const reg = /\/user\/([^/]+)\/([^/]+)/;
const url = '/user/592/xmg';
// console.log(reg.exec(url));
// console.log(url.match(reg));
const keys = [];
const regx = pathToRegexp(path, keys);
const execRes = regx.exec(url);
console.log(regx, execRes, keys);
