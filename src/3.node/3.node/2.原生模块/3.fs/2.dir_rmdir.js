const fs = require('fs');
const nodePath = require('path');
const promisify = require('util').promisify;
const stat = promisify(fs.stat);
const unlink = promisify(fs.unlink);
const rmdir = promisify(fs.rmdir);
const readdir = promisify(fs.readdir);

/**
 * 该方法删除策略采用的是先序深度遍历算法
 * @param path
 * @param callback
 * @returns {Promise<void>}
 */
const rmdirp = async function(path, callback = () => {}) {
  const isDir = async (path) => {
    try {
      const statInfo = await stat(path);
      return statInfo.isDirectory();
    } catch (e) {
      throw e;
    }
  };
  const handle = async function(path) {
    try {
      const childs = (await readdir(path)).map(i => nodePath.join(path, i));
      for (const p of childs) {
        if (!await isDir(p)) {
          await unlink(p);
          continue;
        }
        await handle(p);
      }
      await rmdir(path);
    } catch (e) {
      throw new Error(e);
    }
  };
  try {
    await handle(path);
    callback(null);
  } catch (e) {
    callback(e);
  }
};
// console.time('rmdirp');
// rmdirp('a').then(res => {
//   console.timeEnd('rmdirp');
//   console.log(res);
// });
// console.log(path.resolve('b'));

/**
 * 广度遍历删除文件
 * @param paths
 * @param callback
 */
const rmdirOfWide = function(paths, callback) {
  const fileArray = [paths];
  const index = 0;
  const rm = (paths, array) => {
    if (!paths) return callback();
    fs.stat(paths, (err,res) => {
      if (res.isDirectory()) {
        fs.rmdir(paths, () => {});
      } else {
        fs.unlink(paths, () => {});
      }
      rm(array.pop(), array);
    });
  };
  !(function next(index, array) {
    if (index >= array.length) {
      return rm(array.pop(), array);
    }
    const current = array[index];
    fs.stat(current, (err, res) => {
      if (res.isDirectory()) {
        fs.readdir(current, (err, res) => {
          res.forEach(i => {
            array.push(nodePath.join(current, i));
          });
          next(index +1, array);
        });
      } else {
        next(index +1, array);
      }
    });
  })(index, fileArray)
};
console.time('rmdirpAsync');
rmdirOfWide('a', () => {
  console.timeEnd('rmdirpAsync');
  console.log('rmdir-Async-DONE');
});