#### 箭头函数作用域
- 箭头函数的this指向是被定死的，永远指向外层(外层的意思就是外层函数)this，跟普通函数的this运行时确定不一样。普通函数强调运行时调用宿主关系，被动确定作用域。
```javascript
// NOTE 箭头函数的this指向问题

obj1 = {
  name: 'XMG',
  showName: () => {
    // 此处的this指向为当前最外层
    // 在浏览器环境下 即window对象
    // 在此处，因为是node环境下，存在模块机制，所以是空对象
    console.log(this);
    console.log('showName', this.name);
  },
  showContextName() {
    console.log('showContextName', this.name);
  },
};


// 箭头函数的普通调用
obj1.showName();
// -> undefined

// 普通函数的调用
obj1.showContextName();
// -> XMG
```
#### 函数的调用
1. 普通调用 b()
2. 方法调用 a.b()
3. call,apply调用
4. new 调用 new A()