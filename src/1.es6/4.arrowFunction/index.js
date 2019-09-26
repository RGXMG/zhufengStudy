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
