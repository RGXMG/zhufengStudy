const ReadStream = require('./ReadStream');

const rs = new ReadStream('./3.read.txt', {
  encoding: 'utf8',
  highWaterMark: 3,
  autoClose: true
});
rs.on('open', () => {
  console.log('open file');
});
rs.on('data', (data) => {
  console.log(data);
});
rs.on('error', (err) => {
  console.log('error', err)
});
rs.on('end', () => {
  console.log('read end');
});
rs.on('close', () => {
  console.log('file close');
});