### 模块的加载
> node原生模块，放在了node.exe中，无法看到。加载速度最快

#### 要查找的路径
> 根据路径来匹配，分为相对路径和绝对路径

##### 绝对路径
```javascript
const load = require('load');
```
**查找顺序**
1. 查找module.paths，该参数得到一个**数组**，其中保存了**当前模块到根路径node_modules的一层一层的绝对路径**。

    ```javascript
       console.log(module.paths);
       // [
       //   'H:\\web\\study\\前端\\珠峰建构课2018\\projectSrcCode\\src\\3.node\\2.原生模块\\node_modules',
         //  'H:\\web\\study\\前端\\珠峰建构课2018\\projectSrcCode\\src\\3.node\\node_modules',
           // 'H:\\web\\study\\前端\\珠峰建构课2018\\projectSrcCode\\src\\node_modules',
           // 'H:\\web\\study\\前端\\珠峰建构课2018\\projectSrcCode\\node_modules',
            // 'H:\\web\\study\\前端\\珠峰建构课2018\\node_modules',
            // 'H:\\web\\study\\前端\\node_modules',
            // 'H:\\web\\study\\node_modules',
            // 'H:\\web\\node_modules',
            // 'H:\\node_modules'
                 //]
    ```
    
2. 如果上述路径未查找到，则开始查找`global modules`，该值为电脑的环境变量中设置的值，名为`NODE_PATH`，其中保存着全局的`node_modules`地址，如果还是未找到，则表示查找失败。

##### 相对路径
```javascript
const load = require('./load');
```
**查找顺序**
1. 根据相对路径直接获取路径

#### 模块的确认
1. 根据`[.js, .json, .node, 文件夹/index.json]`确认文件
    1. 在**没有找到** `.js`,`.json`,`.node`文件时，如果**匹配到文件夹**，那么就会 尝试**找寻文件夹下面**的`package.json文件`中的`main字段对应的文件`，如果**没有** `package.json`文件或者不存在`main`字段，那么**就会查找文件夹下**的`index.js/json/node` 