class Global {
  constructor(globalKey) {
    this.globalKey = globalKey;
  }

  getGlobalKey() {
    return this.globaleKey;
  }
};

class Parent extends Global {
  constructor(name) {
    super('987978978');
    this.name = name;
  }

  sa = '123';

  static show() {
    console.log(13);
  }

  showName = function () {
    console.log(this.getGlobalKey());
    console.log(this.name);
  }
  showPro = () => {
    console.log(this.name);
  }

}

const p = new Parent('X<G');
p.showName();

// NOTE babel code
'use strict';

function _typeof(obj) {
  if (typeof Symbol === 'function' && typeof Symbol.iterator === 'symbol') {
    _typeof = function _typeof(obj) {
      return typeof obj;
    };
  } else {
    _typeof = function _typeof(obj) {
      return obj && typeof Symbol === 'function' && obj.constructor === Symbol && obj !== Symbol.prototype ? 'symbol' : typeof obj;
    };
  }
  return _typeof(obj);
}

//
function _possibleConstructorReturn(self, call) {
  if (call && (_typeof(call) === 'object' || typeof call === 'function')) {
    return call;
  }
  return _assertThisInitialized(self);
}

function _getPrototypeOf(o) {
  _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
    return o.__proto__ || Object.getPrototypeOf(o);
  };
  return _getPrototypeOf(o);
}

function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError('this hasn\'t been initialised - super() hasn\'t been called');
  }
  return self;
}

function _inherits(subClass, superClass) {
  // 父类只能是function 或者 null
  if (typeof superClass !== 'function' && superClass !== null) {
    throw new TypeError('Super expression must either be null or a function');
  }
  // 创建一个以父类prototype为基础的新的对象，关联superClass prototype上的方法
  // 重写subClass prototype的属性constructor构造函数，将前面被覆盖的constructor恢复到subClass的constructor
  // 之所以采用Object.create方法，是想建立独立的对象、如果不建立独立的对象，那么改变subClass时就会改变superClass
  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      writable: true,
      configurable: true
    }
  });
  // 让子类拥有父类的静态方法
  // subClass.__proto__ = superClass
  if (superClass) _setPrototypeOf(subClass, superClass);
}

function _setPrototypeOf(o, p) {
  _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
    o.__proto__ = p;
    return o;
  };
  return _setPrototypeOf(o, p);
}

function _defineProperty(obj, key, value) {
  if (key in obj) {
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

// class使用的寄生组合继承
// 在子类的构造函数中调用Parent.call(this);
// 不使用new，而使用Object.create(Parent.prototype)
var Global =
  /*#__PURE__*/
  function () {
    function Global(globalKey) {
      _classCallCheck(this, Global);

      this.globalKey = globalKey;
    }

    _createClass(Global, [{
      key: 'getGlobalKey',
      value: function getGlobalKey() {
        return this.globalKey;
      }
    }]);

    return Global;
  }();

;

var Parent =
  /*#__PURE__*/
  // 1. 将父类作为参数传入
  function (_Global) {
    // 2. 继承
    _inherits(Parent, _Global);

    function Parent(name) {
      var _this;

      _classCallCheck(this, Parent);

      // 调用父类的构造函数
      // super('987978978') -> 就是寄生继承中的Parent.call(this);
      _this = _possibleConstructorReturn(this, _getPrototypeOf(Parent).call(this, '987978978'));

      _defineProperty(_assertThisInitialized(_this), 'sa', '123');

      _defineProperty(_assertThisInitialized(_this), 'showName', function () {
        console.log(this.getGlobalKey());
        console.log(this.name);
      });

      _defineProperty(_assertThisInitialized(_this), 'showPro', function () {
        console.log(_this.name);
      });

      _this.name = name;
      return _this;
    }

    _createClass(Parent, null, [{
      key: 'show',
      value: function show() {
        console.log(13);
      }
    }]);

    return Parent;
  }(Global);

var p = new Parent('X<G');
p.showName();