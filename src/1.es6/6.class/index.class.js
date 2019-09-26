class Parent {
  constructor(name) {
    this.name = name;
  }
  static show() {
    console.log(13);
  }
  showName = function(){
    console.log(this.name);
  }
}

'use strict';

function _instanceof(left, right) {
  if (right != null && typeof Symbol !== 'undefined' && right[Symbol.hasInstance]) {
    return right[Symbol.hasInstance](left);
  } else {
    return left instanceof right;
  }
}

function _classCallCheck(instance, Constructor) {
  if (!_instanceof(instance, Constructor)) {
    throw new TypeError('Cannot call a class as a function');
  }
}

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ('value' in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}

function _defineProperty(obj, key, value) {
  if (key in obj) {
    console.log('true');
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }
  return obj;
}

var Parent =
  /*#__PURE__*/
  function () {
    function Parent(name) {
      _classCallCheck(this, Parent);

      // 在constructor以外定义的非原型变量
      // 此属性不属于原型上，为内部私有
      // eg: showName = function() {};
      // eg: showName = () => {};
      _defineProperty(this, 'showName', function () {
        console.log(this.name);
      });

      this.name = name;
    }

    // 向原型上添加属性
    // 第一个参数： prototype上的属性，子类通用
    // 第二个参数： 父类的属性，static属性，不能访问this
    _createClass(Parent, [{
      key: 'showPrototype',
      value: function() {
        console.log('showPrototype');
      }
    }], [{
      key: 'show',
      value: function show() {
        console.log(13);
      }
    }]);

    return Parent;
  }();

var p = new Parent('X<G');
console.log(p);
p.showName();