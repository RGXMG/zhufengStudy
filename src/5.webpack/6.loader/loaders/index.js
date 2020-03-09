/**
 * NOTE 用法准则：
 * 1. 单一职责，一个loader只能处理一个情况，原子编程
 * 2. 从右到左，链式执行，上一个loader的处理结果交给下一个
 * 3. 模块化
 * 4. 无状态
 *
 * NOTE 实用工具：
 * 1. loader-utils()：用于获取loader相关数据，如options,https://github.com/webpack/loader-utils#readme
 * 1. schema-utils：用于校验loader的options的合法性,https://github.com/webpack/schema-utils
 *
 * NOTE 缓存：
 * 1. 在某些情况下，有些装换操作需要大量计算非常耗时，所以webpack会默认缓存所有的Loader的处理结果，也就是说在处理的文件或者依赖没有发生改变的时候，是不是调用对应的loader去处理的；
 * 2. 可以手动在loader中关闭缓存：this.cacheable(false);
 *
 * NOTE API：
 * https://webpack.js.org/api/loaders/
 */
