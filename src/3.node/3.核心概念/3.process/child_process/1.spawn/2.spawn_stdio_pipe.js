const { spawn } = require("child_process");

/**
 * 将stdio设置为pipe，就能够通过流的方式拿到子进程的输入输出
 * 设置为pipe的情况和默认的情况一样
 * @type {ChildProcessWithoutNullStreams}
 */
const p1 = spawn("node", ["2.childProcess.js"], {
  // stdio: ['pipe', 'pipe', 'pipe']
  stdio: "pipe",
});
p1.stdout.on("data", function (data) {
  console.log(data);
});
