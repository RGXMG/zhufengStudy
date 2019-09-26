const fs = require('fs');
// 3.异步创建文件
const mkdirp = function(dirs, callback = () => {}) {
  const arrayForDirs = dirs.split('/');
  const mkdir = function(path) {
    return new Promise(function(res, rej) {
      fs.mkdir(path, function(err) {
        if (err) rej(err);
        else res();
      })
    });
  };
  const access = function(path) {
    return new Promise(function(res, rej) {
      fs.access(path, fs.constants.R_OK, function(err) {
        if (err) res(false);
        else res(true);
      });
    });
  };
  !(async function executor(index, pathArray, callBack) {
    const path = pathArray.slice(0, index).join('/');
    try {
      const isExisted = await access(path);
      if (!isExisted) {
        await mkdir(path);
      }
      if (index >= pathArray.length) {
        callBack(null);
        return;
      }
      executor(index + 1, pathArray, callBack);
    } catch (e) {
      callBack(e);
    }
  })(1, arrayForDirs, callback);
};
mkdirp('a/b/c/d/e', function(err) {
  console.log(err);
});