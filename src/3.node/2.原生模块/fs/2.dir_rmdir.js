const fs = require('fs');
const path = require('path');
const promisify = require('util').promisify;
const stat = promisify(fs.stat);
const unlink = promisify(fs.unlink);
const rmdir = promisify(fs.rmdir);
const readdir = promisify(fs.readdir);

const rmdirp = async function(path, callback = () => {}) {
  const isDir = async (path) => {
    try {
      const statInfo = await stat(path);
      return statInfo.isDirectory();
    } catch (e) {
      throw e;
    }
  };
  const isEmpty = async path => {
    try {
      const child = await readdir(path);
      return !child.length;
    } catch (e) {
      throw e;
    }
  };
  const concatEvery = (array, str) => array.map(i => `${str}${i}`);
  const handle = async function(paths) {
    try {
      for (const p of paths) {
        if (!await isDir(p)) {
          await unlink(p);
          continue;
        }
        await handle(concatEvery(await readdir(p), `${p}/`));
        if (await isEmpty(p)) {
          await rmdir(p);
        }
      }
    } catch (e) {
      callback(e);
    }
  };
  const child = await readdir(path);
  await handle(concatEvery(child, `${path}/`));
  await rmdir(path);
  callback(null);
};
rmdirp('a');
// console.log(path.resolve('b'));
