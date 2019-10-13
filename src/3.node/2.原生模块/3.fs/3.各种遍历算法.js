const fs = require('fs');
const path = require('path');
/**
 * 遍历算法
 *         1
 *     2       3
 *  4             5
 *  先序 + 深度遍历 -> 12435
 * @param paths
 * @param callback
 */
const preDeep = function(paths, callback) {
  console.log(paths);
  fs.readdir(paths, (err, res) => {
    if (err) {}
    let i = 0;
    !function next(files, i, arr, cb) {
      if (i >= arr.length) return cb();
      const child = path.join(paths, arr[i]);
      fs.stat(child, (err, res) => {
        if (err) {}
        if (res.isDirectory()) {
          preDeep(child, () => next(files,i + 1, arr, cb));
        }
        else {
          console.log(child);
          next(files,i + 1, arr, cb);
        }
      });
    }(paths, i, res, callback);
  });
};
// preDeep('a', () => {
//   console.log('done');
// });

/**
 * 遍历算法
 *         1
 *     2       3
 *  4             5
 *  先序 + 广度遍历 -> 12345
 * @param paths
 * @param callback
 * @param childArray
 */
const wide = function(paths, callback) {
  const array = [paths];
  let i = 0;
  !function next(index, array) {
    let paths = array[index];
    console.log(paths);
    for (const i of fs.readdirSync(paths)) {
      const child = path.join(paths,i);
      if (fs.statSync(child).isDirectory()) {
        array.push(child);
      }
      else console.log(child);
    }
    if (index >= array.length - 1) {
      return callback();
    }
    next(index + 1, array);
  }(i, array);
};
console.time('wide');
wide('a', () => {
  console.timeEnd('wide'); // 8ms
  console.log('广度-同步-next-DONE');
});

const wideOfSyncByWhile = function(paths, callback) {
  const array = [paths];
  while(array.length) {
    const current = array.shift();
    if (fs.statSync(current).isDirectory()) {
      console.log(current);
      const childs = fs.readdirSync(current);
      childs.forEach(i => {
        array.push(path.join(current, i));
      });
    }
    else console.log(current);
  }
  callback();
};
console.time('wideWhile');
wideOfSyncByWhile('a', () => {
  console.timeEnd('wideWhile'); // 4ms
  console.log('广度-同步-while-DONE');
});

const wideOfAsync = function(paths, callback) {
  const dirArray = [];
  !function next(dirArray) {
    const current = dirArray.shift();
    if (!current) return callback();
    fs.stat(current, (err, res) => {
      if (res.isDirectory()) {
        fs.readdir(current, (err, res) => {
          dirArray.push(...res);
          next(dirArray);
        })
      } else {
        console.log(current);
        next(dirArray);
      }
    });
  }(dirArray);
};
console.time('wideOfAsync');
wideOfSyncByWhile('a', () => {
  console.timeEnd('wideOfAsync'); // 3ms
  console.log('广度-异步-while-DONE');
});