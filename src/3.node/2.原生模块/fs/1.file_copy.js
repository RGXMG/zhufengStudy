const fs = require('fs');

const open = (path, flag) => {
  return new Promise((res, rej) => {
    fs.open(path, flag, 0o666, function(err, fd) {
      if (err) rej(err);
      else res(fd);
    });
  });
};
const read = (fd, buffer, offset, bufferCount, position = null) => {
  return new Promise((res, rej) => {
    fs.read(fd, buffer, offset, bufferCount, position, function(err, inFactBufferCount, buffer) {
      if (err) rej(err);
      else res(inFactBufferCount);
    });
  });
};
const write = (fd, buffer, offset, bufferCount, position = null) => {
  return new Promise((res, rej) => {
    fs.write(fd, buffer, offset, bufferCount, position, function(err, inFactBufferCount) {
      if (err) rej(err);
      else res(inFactBufferCount);
    });
  });
};
const BUFFER_CACHE_SIZE = 3;
const copy = async function(src, copy) {
  try {
    const buffer = Buffer.alloc(3);
    const readFd = await open(src, 'r');
    const writeFd = await open(copy, 'w');
    (async function writeNext(rFd, wFd, cache, size) {
      const bytes = await read(rFd, cache, 0, size);
      if (bytes) {
        await write(wFd, cache, 0, bytes);
        writeNext(rFd, wFd, cache, size);
      }
      else {
        // 强行的把缓存区的数据写入文件 并且强制关闭描述器
        fs.fsync(rFd, function(err) {
          fs.close(rFd, function() {
            console.log('写入成功，关闭文件');
          })
        });
        fs.fsync(wFd, function(err) {
          fs.close(wFd,function() {
            console.log('写入成功，关闭文件');
          })
        });
      }
    })(readFd, writeFd, buffer, BUFFER_CACHE_SIZE);
  } catch (e) {
    console.error(e);
  }
};
copy('./1.txt', './2.txt');