/**
 * 自定义实现WriteStream类
 * 1. 包含文件读取
 */
const fs = require('fs');
const EventEmitter = require('events');

class WriteStream extends EventEmitter {
  constructor(path, options) {
    super(path, options);
    const {
      flags = 'w',
      mode = 0o666,
      start = 0,
      encoding = 'utf8',
      autoClose = false,
      // 默认16k
      highWaterMark = 16 * 1024
    } = options;
    Object.assign(this, {
      path,
      // 资源读取的标识符
      flags,
      // 权限mode
      mode,
      // 写入的开始位置
      pos: start,
      // 编码格式
      encoding,
      autoClose,
      // 当前的文件读取操作符
      fd: null,
      highWaterMark,
      // 缓存区 用数组暂时代替链表
      buffers: [],
      // 当前缓存区的字节长度
      length: 0,
      // 当前是否正在写入到文件中
      // 因为写入是一个耗时且异步的操作
      // 所以需要一个标识来记录这个状态
      // 以便于在写入文件中，外部写入chunk进来时判断分支
      writing: false
    });
    this.open();
  }

  /**
   * 内部方法
   * 执行fs的写入文件操作
   * @param chunk
   * @param encoding
   * @param cb
   * @private
   */
  _write(chunk, encoding, cb) {
    fs.write(this.fd, chunk, 0, chunk.length, this.pos, (err, bytesWritten) => {
      if (err) {
        return this._close(err);
      }
      this.pos += bytesWritten;
      this.length -= bytesWritten;
      cb && cb();
    });
  }
  _close(error) {
    this.destroy();
    if (error) {
      this.emit('close', error);
    }
  }

  /**
   * 打开文件
   */
  open() {
    fs.open(this.path, this.flags, this.mode, (err, fd) => {
      if (err) {
       return this._close(err);
      }
      this.fd = fd;
      this.emit('open');
    });
  }

  /**
   * 写入文件
   */
  write(chunk, encoding, cb) {
    const buf = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
    this.length += buf.length;
    const rent = this.length < this.highWaterMark;
    if (this.writing) {
      this.buffers.push({
        chunk: buf,
        encoding,
        cb
      });
    } else {
      const execute = () => {
        this.writing = true;
        this._write(buf, encoding, () => {
          // 循环缓存，把缓存里面的数据写入
          const hasBuffers = this.flushBuffers.length;
          this.flushBuffers(() => {
            // 然后更新writing
            this.writing = false;
            hasBuffers && this.emit('drain');
          });
        });
      };
      if (typeof this.fd !== 'number') {
        this.once('open', execute);
      } else execute();
    }
    return rent
  }

  /**
   * 冲刷缓存区数据
   */
  flushBuffers(cb) {
    const thunkObj = this.buffers.shift();
    if (thunkObj) {
      this._write(thunkObj.chunk, thunkObj.encoding, () => {
        thunkObj.cb && thunkObj.cb();
        this.flushBuffers(cb);
      })
    } else {
      cb && cb();
    }
  }
  destroy() {}
}
module.exports = WriteStream;