const array = [
  [3,2,1,3,21],
  [3,21,32,1,321],
  [1,2,3,4,5],
  [2,1,3,41,2],
  [1,1,32,3,1]
];
// 得出array中子元素最长的长度
const maxLen = Math.max(...array.reduce((pre, next) => { pre.push(next.length); return pre; }, []));
[...Array(maxLen).keys()].reduce((pre, next, index) => {
  const vOfArray = [array[0][index]];
}, []);