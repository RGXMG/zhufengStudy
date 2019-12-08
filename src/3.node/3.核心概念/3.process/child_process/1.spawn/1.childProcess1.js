console.log(123456);
process.on('message', function (msg) {
  console.log('child:',msg);
  process.send('child: msg:' + msg);
});