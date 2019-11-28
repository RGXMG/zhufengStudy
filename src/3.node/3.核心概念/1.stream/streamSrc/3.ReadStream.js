const fs = require('fs');
const EventEmitter = require('events');

class 3 extends EventEmitter {
  constructor(path, options) {
    super(path, options);
    const {
      flags = 'r',
      mode = 0o666,
      end = 0,
      start = 0,
      encoding = 'utf8',
      autoClose = false,
      // 默认32k
      highWaterMark = 32 * 1024
    } = options;
    Object.assign(this, {
      flags,
      mode,
      end,
      encoding,
      autoClose,
      highWaterMark,
      path,
      pos: start,
      // 文件描述符
      fd: null,
      // 流动模式
      flowing: undefined,
      // 建立缓存区大小
      buffer: Buffer.alloc(highWaterMark),
      // 开始读取文件
      reading: false
    });
    this.open();
    this.on('newListener', (type,callback) => {
      if (type === 'data' && !this.reading) {
        this.read(callback);
      }
    })
  }
  endFn(err) {
    if (err) {
      this.emit('error', err);
    } else {
      this.emit('end');
    }
    if (this.autoClose) {
      fs.close(this.fd, () => {
        this.emit('close');
      });
    }
  }

  open() {
    fs.open(this.path, this.flags, this.mode, (err, fd) => {
      if (err) {
        return this.close(err);
      }
      this.fd = fd;
      this.emit('open');
    });
  }

  read() {
    const execute = () => {
      let howMuchRead = this.end > 0 ? Math.min(this.end - this.pos + 1, this.highWaterMark) : this.highWaterMark;
      fs.read(this.fd, this.buffer, 0, howMuchRead, this.pos, (err, bytes) => {
        if (err) {
          return this.endFn(err);
        }
        if (!bytes) {
          return this.endFn();
        }
        this.pos += bytes;
        let data = this.buffer.slice(0, bytes);
        if (this.encoding) {
          data = data.toString(this.encoding);
        }
        this.emit('data', data);
        if (this.end && this.pos > this.end) {
          return this.endFn();
        } else if (this.flowing) {
          execute();
        }
      });
    };
    if (!this.fd) {
      this.once('open', execute);
    } else execute();
  }

  pipe(dest) {
    this.on('data', data => {
      const flag = dest.write(data);
      if (!flag) {
        this.pause();
      }
    });
    dest.on('drain', () => {
      this.resume();
    });
  }
  pause() {
    this.flowing = false;
  }
  resume() {
    this.flowing = true;
  }
}
module.exports = ReadStream;