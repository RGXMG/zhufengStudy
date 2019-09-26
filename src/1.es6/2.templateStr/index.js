// 定义俩个变量
const name = 'Nick', age = 9;
// es6 自带的模板处理
console.log(`我叫${name}, 今年我${age}岁了！`);
// 简单的实现原理
const tpl = function(str) {
  return str.replace(/\${([^}]+)}/g, function(matched, key) {
    console.log(matched);
    console.log(key);
    return eval(key);
  })
};
console.log(tpl('我叫${name}, 今年我${age}岁了！'));

// NOTE 自定义函数，拼接字符
// NOTE styled-components就是利用这样的原理
// NOTE styled.div``;
console.log('---自定义函数，拼接字符---');

/**
 * 返回一个带有内联style属性的div字符串
 * 其中_content代表div内的值
 * @param strings 以${}为分割的字符串数组
 * @param rest ${}变量的值，在strings后依次排列
 */
function returnDiv(strings, ...rest) {
  console.log(strings);
  console.log(rest);
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