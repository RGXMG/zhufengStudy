process.on('message', function (msg) {
  console.log('child:', msg);
  process.send('back:' + msg);
});