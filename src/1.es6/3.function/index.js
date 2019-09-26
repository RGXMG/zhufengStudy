// NOTE reduce、reduceRight的简单实现原理
// NOTE 重写Array.prototype上的reduce方法
Array.prototype.reduce = function(reducer, initialValue) {
  if (!this.length) return;
  let i = 0;
  // 稀疏数组的处理
  const isOwn = (h, v) => Object.prototype.hasOwnProperty.call(h, v);
  if (initialValue === undefined) {
    for (let t = 0; t < this.length; t ++) {
      if (isOwn(this, t)) {
        i = t;
        initialValue = this[t];
        break;
      }
      // 全部都是稀疏元素
      if (t === this.length - 1) return initialValue;
    }
  }
  for (; i < this.length; i ++) {
    if (!isOwn) continue;
    initialValue = reducer(initialValue, this[i], i, this);
  }
  return initialValue;
};
// [1,2,3,4].reduce((pre, val, i, arr) => {
//   console.log('pre:',pre, '  ', 'val:', val, '  ', 'i:',i, '  ', 'arr: ', arr);
//   return pre + val;
// }, 9);

// NOTE 展开运算符 此处讲解在function中的传参

function max() {
  return [...arguments].reduce((v, i) => {
    if (v >= i) return v;
    return i;
  });
}
console.log(max(...[1,2,52,3]));
// 
console.log(max.apply(null, [1,2,52,3]));