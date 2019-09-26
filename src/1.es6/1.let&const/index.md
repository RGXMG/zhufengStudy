## es6
#### 变量声名：
 - 作用域：es5之前，未使用let或者const，js只有俩个作用域，一个全局作用域，一个函数级作用域。使用let之后，存在块级作用域。
 - let、const声明的变量在作用域中没有变量提升：
 ```js script
    let a = 20;
    {
        console.log(a);
        let a = 10;
    }
    // 运行结果：a is not defind
 ```
 - 经典示例，闭包，采用let声明的变量，如果编译成es5的结果可能为，此处采用babel；编译的原理其实跟es5解决闭包的问题类似,都是靠的是函数作用域。
 ```js script
    // es6代码
    for (let i = 0;i < 10;i ++) {
        setTimeout(function() {
        console.log(i);
        }, 1000);
    }
    // babel编译之后
    'use strict'
    var _loop = function(i) {
         setTimeout(function() {
            console.log(i);
         },1000);
    }
    for (let i = 0;i < 10;i ++) {
        _loop(i);
    }
    // es5下的原理
    for (let i = 0;i < 10;i ++) {
        (function(i) {
           setTimeout(function() {
               console.log(i);
            }, 1000);
        })(i);
    }
 ```