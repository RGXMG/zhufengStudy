## webpack plugins
> plugin可以实现很复杂的功能，是扩展webpack引擎的必经之路。所以书写插件也必须要了解webpack源码，才可以书写出实用的插件；
> 大致原理：提供一个函数，监听webpack上提供的事件钩子，处理webpack内部实例的特定数据，功能完成之后调用webpack回调；

### compiler
compiler中包含了完整的webpack的环境配置，在webpack被启动时，一次性创建，其中包含了`options`，`loader`，`plugin`，在应用一个插件时，会将compiler传入到插件中去，可以用它来访问webpack主环境；
#### 属性值：
#### [compiler源码](https://github.com/webpack/webpack/blob/master/lib/Compiler.js)
### compilation
compilation对象代表了一次资源版本的构建，当运行webpack开发环境中间件时，每当检测到一个文件的变化，就会创建一个新的compilation，从而生成一个新的compilation，从而生成一组新的编译资源，一个该对象表现了当前的模块资源，编译生成资源，变化的文件，以及被追踪依赖的状态信息，compilation对象也提供很多关键时间的回调，以供插件坐自定义处理时的选择使用，即可以在compilation中自定义事件；
#### 属性值：
- assets：静态文件列表，最后webpack会根据这个变量生成文件，可以通过更改assets的值改变最后生成的文件；
#### [compilation源码](https://github.com/webpack/webpack/blob/master/lib/Compilation.js)
### 实现一个plugin 
- 必须在`prototype`上实现`apply`方法，该方法接受一个`compiler`参数

### plugin
1. plugin自身可以定义事件，其他plugin可以监听这些事件再次处理其他plugin处理过的数据，如[html-webpack-plugin](https://github.com/jantimon/html-webpack-plugin)的一些事件；见plugins中的**1.inline-plugin**中使用的html-webpack-plugin提供的事件；