const fs = require('fs');
// 未指定encoding，默认返回buffer
// 此处将1.bom.txt保存为utf-8
// BOM 为 EF BB BF
fs.readFile('./1.bom.txt', function (err, data) {
  if (data[0] === 0xEF && data[1] === 0xBB && data[2] === 0xBF) {
    console.log('包含BOM：', data);
    console.log('去掉后：', data.slice(3))
  }
  else {
    console.log('不包含BOM：', data)
  }
});