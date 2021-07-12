/**
 * Created with JavaScript.
 * User: rgxmg
 * Email: rgxmg@foxmail.com
 * Date: 2021/7/12
 * Time: 10:24
 *
 */
const fs = require("fs");

// setTimout setInterval setImmediate process.nextTick Promise.then

// let sd = Date.now();
// fs.readFile("./index.js", (res) => {
//   console.log("fs.readFile1111:::", Date.now() - sd);
// });
// setTimeout(() => {
//   console.log("setTimeout:::");
// }, 300);
// setTimeout(() => {
//   console.log("setTimeout:::");
// }, 300);
// setTimeout(() => {
//   console.log("setTimeout:::");
// }, 300);
// setTimeout(() => {
//   console.log("setTimeout:::");
// }, 300);
// let st = Date.now();
// while (Date.now() - st < 290) {}
// setImmediate(() => {
//   // let st = Date.now();
//   // while (Date.now() - st < 10) {}
//   console.log("setImmediate:::");
// });
// fs.readFile("./index.js", (res) => {
//   console.log("fs.readFile222222::");
// });

setTimeout(() => {
  Promise.resolve(null).then(() => {
    console.log("Promise.resolve");
    Promise.resolve(null).then(() => {
      console.log("Promise.resolve");
      Promise.resolve(null).then(() => {
        console.log("Promise.resolve");
      });
    });
  });
  process.nextTick(() => {
    console.log("nextTick");
    process.nextTick(() => {
      console.log("nextTick");
      process.nextTick(() => {
        console.log("nextTick");
        process.nextTick(() => {
          console.log("nextTick");
        });
      });
    });
  });
  console.log(123);
  let s = Date.now();
  setTimeout(() => {
    console.log(123);
    setTimeout(() => {
      console.log(123);
    });
  });
  while (Date.now() - s < 1000) {}
});

setImmediate(() => {
  console.log(321);
  setImmediate(() => {
    console.log(321);
    setImmediate(() => {
      console.log(321);
    });
  });
});
