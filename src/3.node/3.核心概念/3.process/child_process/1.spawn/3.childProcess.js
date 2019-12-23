let i = 0;
const timer =  setInterval(function () {
  if (++ i >=10) {
    clearInterval(timer);
  }
  process.stdout.write(Date.now().toString());
}, 1000);