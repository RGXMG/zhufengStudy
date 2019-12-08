process.on('message', function (msg, socket) {
  if (~msg.indexOf('socket')) {
    let sum = 0;
    for (let i = 0; i < 1000000; i ++) {
      sum += i;
    }
    socket.write('parent' + sum);
  }
});