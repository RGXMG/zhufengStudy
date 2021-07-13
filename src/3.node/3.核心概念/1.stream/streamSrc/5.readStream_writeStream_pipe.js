const ReadStream = require("./3.ReadStream");
const WriteStream = require("./4.WriteStream");

const rs = new ReadStream("./3.read.txt", {
  start: 3,
  autoClose: true,
});
const ws = new WriteStream("./3.write.txt", {
  autoClose: true,
});
rs.pipe(ws);
