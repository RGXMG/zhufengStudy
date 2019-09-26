/**
 * async/await 是generator+promise的语法糖
 *
 */
const fs = require('fs');

function readFile(name) {
  return new Promise((res, rej) => {
    fs.readFile(name, 'utf8', function(err, content) {
      if (err) {
        rej(err);
      } else res(content);
    })
  });
}
async function read() {
  const a = await readFile('test/1.txt');
  console.log(a);
  const b = await readFile('test/2.txt');
  console.log(b);
  const c = await readFile('test/3.txt');
  console.log(c);
  return '' + a + b + c;
}
read().then(res => console.log(res));

// NOTE 实现原理
// NOTE 实际上在async函数执行时就会转为下面这种方式
function co(func) {
  const ltr = func();
  return new Promise(function(resolved, rejected) {
    ~(function next(lastVal) {
      const { value, done } = ltr.next(lastVal);
      if (done) {
        resolved(value);
      } else value.then(next, rejected);
    })();
  });
}
// NOTE 执行likeAsync函数
function likeAsync() {
  return co(read);
}