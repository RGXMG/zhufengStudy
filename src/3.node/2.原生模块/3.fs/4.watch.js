/**
 * 监控文件变化，当文化发生变化时执行对应回调
 * NOTE 存在开源框架node-watch、chokidar
 */
const fs = require('fs');

/**
 * fs.watch
 * NOTE 该方法是通过调用native API实现
 * NOTE 1.能够实时监听更改
 * NOTE 2.能够监听目录下面的源文件改变
 * 能够在文件改变时触发，存在一定的平台差异性
 * args1: filename 显然就是文件名
 * args2: options 可选 对象或者字符串 包含以下三个属性
 *        persistent 文件被监听时进程是否继续，默认true
 *        recursive 是否监控所有子目录，默认false 即当前目录，true为所有子目录。
 *        encoding 指定传递给回调事件的文件名称，默认utf8
 * args3: listener 事件回调 包含两个参数
 *        eventType 事件类型，rename 或者 change
 *        filename 当前变更文件的文件名
 * NOTE 当文件发生变化时，会触发俩次等问题，解决办法参考http://xxdy.tech/2019/04/16/watchfile/
 */

fs.watch('./4.watch.txt', (et, filename) => {
  console.log(et);
  console.log(filename);
});

/**
 * watchFile
 * 该方法是通过轮询进行监听文件
 * NOTE 1. 通过轮询监听文件
 * NOTE 2. 通过fs.stat方法
 * NOTE 3. 只能监听单个文件
 * NOTE 4. 因为采用时间间隔进行轮询，默认是5007ms，所以执行效率慢
 * NOTE 一般能用watch还是会采用watch方法进行文件的监听
 */
