/**
 * Created with JavaScript.
 * User: rgxmg
 * Email: rgxmg@foxmail.com
 * Date: 2021/6/18
 * Time: 15:48
 *
 */
/**
 *
 * 注意的点：
 *  1. Object.prototype是预先设定好的，不是由谁创建的，因为Object.prototype.__proto__等于null；
 *  2. Function的prototype也是预先设计好的，不是由谁创建的，但是在prototype中存在一个__proto__属性指向了Object.prototype；
 *  3. Function是一个函数的构造函数，所有的函数都是由它自己创建，所以它本身Function Function() {}也是由它自己创建，所以 Function.__proto__ === Function.prototype；
 *  4. Object是对象的构造函数，而函数都是由Function构造生成的，所以Object.__proto__等于Function.prototype；
 **/
