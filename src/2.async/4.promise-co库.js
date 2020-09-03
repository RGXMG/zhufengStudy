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

function *read() {
  const a = yield readFile('test/1.txt');
  console.log(a);
  const b = yield readFile('test/2.txt');
  console.log(b);
  const c = yield readFile('test/3.txt');
  console.log(c);
  return '' + a + b + c;
}

function co(func) {
  let ltr = func();
  return new Promise(function(resolved, rejected) {
    ~(function next(lastVal){
      const { done, value } = ltr.next(lastVal);
      if (done) {
        resolved(value);
      } else {
        value.then(next, rejected);
      }
    })()
  });
}
// const ltr = read();
// const res = ltr.next();
// res.value.then(res => {
//   ltr.next(res).value.then(r => {
//     ltr.next(r).value.then(r => {
//       console.log(ltr.next(r).value);
//     });
//   })
// });

co(read).then(res => console.log(res));
