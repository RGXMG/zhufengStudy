for (let i = 2; i < process.argv.length; i ++) {
  process.stdout.write(process.argv[i] + '\r\n');
}
process.on('SIGTERM', function () {
  console.log(arguments);
});