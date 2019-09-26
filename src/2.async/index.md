#### 回调函数的弊端
1. 无法捕获错误
    ```javascript
   function read(name, cb) {
     setTimeout(() => cb(name + 'name:::'), 200);
   }
   function getName(name) {
     read(name, function(val) {
       throw new Error('Error');
     });
   }
    try {
      const name = getName();
    } catch (e) {
      console.error(e.message);
    }
    ```
2. 不能return值
  ```javascript
    function read(name, cb) {
       setTimeout(() => cb(name + 'name:::'), 200);
     }
     function getName(name) {
       read(name, function(val) {
         return  name;
       });
     }
      const name = getName();
      console.log(name); // undefined
  ```