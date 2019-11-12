const WriteStream = require('./WriteStream');
const fs = require('fs');

const rs = fs.createReadStream('./3.read.txt', {
  flags: 'r',
  mode: 0o666,
  encoding: 'utf8',
  highWaterMark: 1
});
const ws = new WriteStream('./3.write.txt', {
  flags: 'w',
  mode: 0o666,
  encoding: 'utf8',
  highWaterMark: 3
});
// rs.on('data', (data) => {
//   const flag = ws.write(data);
//   console.log('flag', flag);
//   if (!flag) {
//     rs.pause();s
//   }
// });
let i = 9;
const wirte = () => {
  let flag = true;
  while (i > 0 && flag) {
    flag = ws.write((i --).toString());
    console.log(flag);
  }
};
ws.on('open', wirte);
ws.on('drain', () => {
  console.log('drain');
  wirte();
});