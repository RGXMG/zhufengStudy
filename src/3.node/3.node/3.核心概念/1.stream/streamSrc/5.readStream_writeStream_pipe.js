const ReadStream = require('./ReadStream');
const WriteStream = require('./WriteStream');

const rs = new ReadStream('./3.read.txt', {
  start: 3,
  autoClose: true
});
const ws = new WriteStream('./3.write.txt', {
  autoClose: true
});
rs.pipe(ws);