#### 对象的继承
- 使用Object.setPrototypeOf(children, parent)
```javaScript
    const obj1 = {
      name: 'obj1 Name',
      showName: function () {
        console.log(this.name);
      }
    };
    let obj2 = {};
    
    // 1. 使用Object.setPrototypeOf(children, parent)
    Object.setPrototypeOf(obj2, obj1);
    
    console.log(obj2.name);
    // -> name

```
- 手动设置__proto__属性
```javascript
// 2. 手动设置__proto__
obj2 = {
  __proto__: obj1
};
console.log(obj2.name);
// -> name

```
#### 当方法被覆盖，调用原型上的方法
- 使用super关键字
```javascript
// 使用super关键字访问原型上的方法
obj2 = {
  __proto__: obj1,
  showName: function() {
    console.log('obj2 Name');
    console.log(super.showName());
  }
};
obj2.showName();
```