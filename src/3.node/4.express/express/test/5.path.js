const path = '/user/:uid/:name';
// const reg = /\/user\/([^/]+)\/([^/]+)/;
// const url = '/user/592/xmg';
// console.log(reg.exec(url));
// console.log(url.match(reg));

const koko = '/user/:name/:age'.replace(/:([^/]+)/g, function() {
  console.log(arguments);
  return '([^/]+)'
});
console.log(koko, new RegExp(koko).exec('/user/jy/12'));
const pathToRegx = require('path-to-regexp');
let keys = [];
const result = pathToRegx(path, keys);
console.log(keys);
console.log(result);