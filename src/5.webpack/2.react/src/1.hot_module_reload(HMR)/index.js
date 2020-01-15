import base from './base';

base();
/**
 * NOTE 热更新存在冒泡机制（css文件的accept已经被内置）
 * 即，当子文件(js文件)发生改变，就会向引用它的父文件冒泡
 * 如果父文件利用了module.hot.accept处理了该文件，则执行处理函数并且停止冒泡
 * 否则继续冒泡，如果到顶都没有进行处理，则直接webpack-dev-server直接发送消息直接刷新页面
 */
if (module.hot) {
  module.hot.accept('./base', () => {
    base();
  });
}
