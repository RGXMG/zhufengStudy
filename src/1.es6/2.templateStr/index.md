 #### 基础的模板字符串 \`${变量名}`
 - 简单原理：就是通过replace进行正则匹配进行替换，但是一些复杂的模板引擎(包含if、else等)的原理跟这个不一样。
 ```javascript
// 定义俩个变量
const name = 'Nick', age = 9;
// es6 自带的模板处理
console.log(`我叫${name}, 今年我${age}岁了！`);
// -> 我叫Nick, 今年我9岁了！
// 简单的实现原理
const tpl = function(str) {
  return str.replace(/\${([^}]+)}/g, function(matched, key) {
    console.log(matched);
    console.log(key);
    // -> ${name}
     // -> name
     // -> ${age}
    // ->  age
    return eval(key);
  })
};
console.log(tpl('我叫${name}, 今年我${age}岁了！'));
// -> 我叫Nick, 今年我9岁了！
```
 - 自定义返回拼接字符串，函数名\``
 ```javascript
/**
 * 返回一个带有内联style属性的div字符串
 * 其中_content代表div内的值
 * @param strings 以${}为分割的字符串数组
 * @param rest ${}变量的值，在strings后依次排列
 */
function returnDiv(strings, ...rest) {
  console.log(strings);
   // -> [ '\n  height: ', ';\n  color: ', ';\n  _content: 你好，我叫', '\n' ]
  console.log(rest);
   // ->     [ '100px', 'red', 'Nick' ]
  let result = '';
  let content = '';
  for (let i = 0; i < rest.length; i ++) {
    const str = strings[i];
    const varVal = rest[i];
    if (str.indexOf('_content') > -1) {
      const expectContent = str.substr(str.indexOf(':') + 1);
      content = expectContent.replace(/\s+/, '') + varVal;
      continue;
    }
    result += str + varVal;
  }
  // 没有_content属性，证明_content存在于最后一个
  return `<div style="${result.replace(/\n+|\s+/g, '')}">${content}</div>`;
}
const color = 'red';
const height = '100px';
console.log(returnDiv`
  height: ${height};
  color: ${color};
  _content: 你好，我叫${name}
`);
// -> <div style="height:100px;color:red">你好，我叫Nick</div>
```