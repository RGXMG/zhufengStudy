/**
 * 换行和回车
 * NOTE unix: \n
 * NOTE windows: \r\n
 * NOTE mac系统中 \n
 * NOTE 在ASCII码中对应关系为： \n: 0a \r: 0d
 */
const EventEmitter = require('events');
const utils = require('util');
const fs = require('fs');
const NEW_LINE = 0x0a;
const RETURN = 0x0d;
function LineReader(path) {
  EventEmitter.call(this);
  this.path = path;
  this.on('newListener', function(type, callback) {
    if (type === 'newLineReader') {
      this.newLineReaderStart();
    }
  });
}
LineReader.prototype.newLineReaderStart = function() {
  const rs = fs.createReadStream(this.path);
  const buffers = [];
  const emitBuffers = () => {
    this.emit('newLineReader', Buffer.from(buffers).toString('utf8'));
    buffers.length = 0;
  };
  rs.on('readable', function() {
    let char = void 0;
    while (char = rs.read(1), char) {
      if (char === NEW_LINE) {
        emitBuffers();
        if ((char = rs.read(1), char[0]) !== RETURN) {
          buffers.push(char[0]);
        }
      } else if (char === RETURN) {
        emitBuffers();
      } else {
        buffers.push(char[0]);
      }
    }
  });
  rs.on('end', () => {
    emitBuffers();
    this.emit('end');
  });
};
utils.inherits(LineReader, EventEmitter);

const lr = new LineReader('./4.newLineEnter.txt');
lr.on('newLineReader', data => {
  console.log(data);
});