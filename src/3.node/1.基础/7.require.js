/**
 * NOTE 1. cache
 * NOTE node 的require 加载时同步的
 * NOTE 之所以是同步加载，是因为node使用了cache来解决加载问题
 * NOTE 所有加载过得module都会保存在require.cache里面
 * NOTE 所以说一个module被相同文件或不同文件require多次时，module的代码只会执行一次
 * NOTE 其中require.cache对象的key就是被require模块的绝对路径
 **/
console.log(Object.keys(require.cache));
let oneOfModule = require('./6.oneOfModule');
console.log(Object.keys(require.cache));
oneOfModule = require('./6.oneOfModule');
console.log(Object.keys(require.cache));
// NOTE 上面虽然加载了俩次6.oneOfModule，但是oneOfModule的代码只会执行一次

/**
 * NOTE 2.resolve
 * NOTE require.resolve() 获得一个module的绝对路径，但不去加载它
*/

/**
 * NOTE 3.main
 * NOTE 指的就是入口模块
 */

/**
 * NOTE 4.extensions:::: 添加扩展会降低模块加载程序的速度，因此不应该这样做
 * NOTE 扩展，在node中，模块的类型有三种
 * NOTE 1.JS模块
 *      2.json模块：找到扩展名为json，读取文件，使用JSON.parse解析返回 -> require(*.json);
 *      3.node C++扩展二进制模块, 使用C++编写的二进制模块
 * NOTE 同名加载时，优先级为： JS -> json -> node
 */
console.log(require.extensions);