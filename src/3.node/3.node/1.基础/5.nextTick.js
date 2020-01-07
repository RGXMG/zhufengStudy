/**
 * 通过添加process.nextTick
 * 让this.hint尽快执行
 * 调用nextTick时，会将回调函数放入一个单独的队列。
 * 跟setTimeout以及互调函数的队列不一样
 * @constructor
 */
function Hint() {
  this.hint = null;
  process.nextTick(() => {
    this.hint();
  });
}
Hint.prototype.add = function(any) {
  this.hint = () => console.log(any);
};
const h = new Hint();
h.add('Error');