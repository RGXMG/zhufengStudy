/**
 * 直接开启一个文件命令，不会创建一个shell
 */

const { execFile } = require('child_process');
const child = execFile('node', ['./1.childProcess.js', 'a', 'b', 'c'], { timeout: 100 }, function (err, stdout, stderr) {
  console.log(err);
  console.log(stdout);
});