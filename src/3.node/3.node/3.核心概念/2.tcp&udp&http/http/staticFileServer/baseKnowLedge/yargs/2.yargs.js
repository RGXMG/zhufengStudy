/**
 * yargs可以帮我们解析命令行参数，把参数数组解析成对象的形式
 * http://yargs.js.org/
 */
const yargs = require('yargs');
// const args = yargs.argv;
// console.log(args.name);

/**
 * 定义-n的配置信息
 *
 */
const args2 = yargs.options('n', {
  // 别名，也就是 -n 可以写成 --name
  alias: 'name',
  // 是否必填
  demand: true,
  // 默认值
  default: 'jy',
  // 描述
  description: '请输入你的姓名'
})
  // 执行帮助信息
  .help()
  // 例子
  .example('2.yargs --name hello 执行2.yargs命令，然后传入--name属性，并传入name的值')
  // 别名
  .alias('help', 'h')
  .argv;
console.log(args2);