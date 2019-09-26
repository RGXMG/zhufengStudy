#### class 原理
##### 基础写法:
```javascript
 class Parent {
  constructor(name) {
    this.name = name;
  }
  showName(){
    console.log(this.name);
  }
  static show() {
    console.log('show');
  }
 }
 const child =  new Parent();
```
##### 转为es5
```javascript
'use strict';

function _instanceof(left, right) {
  if (right != null && typeof Symbol !== 'undefined' && right[Symbol.hasInstance]) {
    return right[Symbol.hasInstance](left);
  } else {
    return left instanceof right;
  }
}

// 类的调用检查
function _classCallCheck(instance, Constructor) {
  console.log(instance);
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

var Parent =
  /*#__PURE__*/
  function () {
    function Parent(name) {
      _classCallCheck(this, Parent);
      this.name = name;
    }

    _createClass(Parent, [{
      key: 'showName',
      value: function showName() {
        console.log(this.name);
      }
    }]);

    return Parent;
  }();
```