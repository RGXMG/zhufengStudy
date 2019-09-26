// NOTE 一般在只想继承父类原型上的方法, 不想调用父类构造函数时，就采用Object.create(Parent.prototype);
Object.prototype.myCreate = function (obj, properties)  {
  var F = function ()  {};
  F.prototype = obj;
  if (properties) {
    Object.defineProperties(F, properties)
  }
  return myNew(F);
};
function afsd() {
  new XMLDocument
}

var myNew = function ()  {
  var obj = new Object();    // 从Object.prototype上克隆一个空对象 此时 __proto__ 指向Object.prototype
  var Constructor = [].shift.call(arguments);  //取得构造器
  obj.__proto__ = Constructor.prototype;  // 指向构造器的prototype
  var ret = Constructor.apply(obj, arguments);
  return typeof ret === 'object' ? ret : obj
};

const sub = function(name) {
  console.log('sub');
};
@decorator
const spuer = function() {};
spuer.prototype.showSuper = function(){
  console.log('super');
  this.super();
};
sub.prototype = Object.myCreate(spuer.prototype, {
  constructor: {
    value: '123',
    writable: true,
    configurable: true
  }
});
console.log(sub.prototype);