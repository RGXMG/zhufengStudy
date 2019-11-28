const { Transform } = require('stream');
const fs = require('fs');

// 普通流中放置buffer, 对象流中放置对象

const rs = fs.createReadStream('./9.json.json');
const toJson = Transform({
  // 开启可读对象模式
  readableObjectMode: true,
  transform(t, e, c) {
    this.push(JSON.parse(t.toString()));
  }
});
const outJson = Transform({
  // 开启可写对象模式
  writableObjectMode: true,
  transform(t, e, c) {
    console.log(t);
  }
});
rs.pipe(toJson).pipe(outJson);