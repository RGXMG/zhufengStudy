const path = require('path');
const htmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const cleanWebpackPlugin = require('clean-webpack-plugin');
// 内部有个事件流 tapable 1.0
module.exports = {
  // 入口、相对路径
  // 1. string，一个入口文件
  entry: './src/index.js',

  // 2. 可以多个入口文件，数组配置，该配置还是会打包成一个输出文件
  // entry: ['./src/index.js', './src/base.js'],

  // 3. 对象，成一个多入口,然后产出多个文件
  // webpack先找到每个入口，然后分别从每个入口出发，找到对应依赖的模块(Module - 多个)，
  // 然后生成一个chunk(代码块 - 一个)
  // 最后把chunk写入到文件系统中(Assets - 不一定,可能会抽离公共，或者分割)，
  // entry: {
  //   index: './src/index.js',
  //   base: './src/base.js',
  // },
  // 出口
  output: {
    // 绝对路径
    path: path.join(__dirname, 'dist'),
    // 打包后的文件名
    // [name]就是entry的名字
    // hash文件摘要，根据文件内容计算，默认很长，20位，:8就是代表8位
    filename: '[name].[hash:8].js'
  },
  resolve: {
    extensions: ['.js', '.ts', '.tsx']
  },
  /**
   * loader可以配置在下方，也可以直接写在代码中的
   * 如：
   * require('./css') -> require('style-loader!css-loader!./css');
   * 意思就是先导入./css文件，然后交给css-loader处理，然后再交给style-loader处理
   * require('jquery') -> require('expose-loader?$!jquery');
   * 意思导入jQuery模块 ，然后交给expose-loader?$处理，而其中的?$代表传递参数$
   *
   * loader 有俩种写法
   * 1.use:
   *  a: string：
   *  {
   *    test: /\.css/,
   *    use: 'style-loader'
   *  }
   *
   *  b: Array<string>:
   *  {
   *    test: /\.css/,
   *    use: ['style-loader', 'css-loader']
   *  }
   *
   *  c: 对象:
   *  {
   *    test: /\.css/,
   *    use: { loader: 'style-loader', options: {} }
   *  }
   *
   *  d：Array<Object<loader, options>>(适用于loader需要使用options):
   *  {
   *    test: /\.css/,
   *    use: [{ loader: 'style-loader', options: {} }, { loader: 'css-loader', options: {} }]
   *  }
   *
   * 2.loader(是use的简写):
   * {
   *    test: /\.css/,
   *    loader: ['style-loader', 'css-loader']
   *  }
   */
  module: {
    // 规则处理
    rules: [
      // file-loader是处理二进制数据，如文件，它会把文件从源位置复制到目标地址并修改引用地址
      {
        test: /\.(png|jpg|jpeg|gif|svg|bml)/,
        use: 'file-loader'
      },
      // {
      //   test: require.resolve('jquery), // require.resolve拿到一个模块的绝对路径，引入在代码中导入的时候是一个绝对路径
      //   loader: 'expose-loader?$'
      // },
      {
        // 正则匹配去匹配css文件
        test: /\.css/,
        // loader如果只有单个，那么只需要些一个string就行
        // 多个话使用数组，执行顺序从右到左
        // css-loader解析处理css文件中的url路径，把css文件处理为一个模块
        // style-loader可以把css文件变成style标签插入head中
        loader: ['style-loader', 'css-loader']
      }
    ]
  },
  // plugins 放置顺序与执行顺序无关，都是监听事件
  plugins: [
    // 用来自动向模块内容注入变量
    // 该插件解决在代码中不想频繁引入(import/require)其他模块(如A)，而直接使用A模块时
    // 只有在检测当前入口文件中使用下面需要注入的变量时才会注入该模块的代码
    new webpack.ProvidePlugin({
      // 注入的模块名称： 引用的路径
      //   $: 'jquery'
    }),
    // 删除output文件夹
    new cleanWebpackPlugin.CleanWebpackPlugin(),
    // 此插件可以产出html文件
    // 对html文件进行压缩minify
    // 引入js文件 插入变量 ejs模板语法
    // 引入的资源文件加hash避免缓存
    new htmlWebpackPlugin({
      minify: {
        removeAttributeQuotes: true
      },
      // 模板
      template: './public/index.html',
      // 产出得文件名称
      filename: 'index.html',
      // 选择在产出的chunk中引入哪些文件
      // 跟entry对象的文件名称
      // chunk: ['index'],
      // 向每个资源文件加入查询参数，hash，避免缓存
      hash: true,
      title: '欢迎光临',
    }),

    // 多页面html产出配置
    // new htmlWebpackPlugin({
    //   minify: {
    //     removeAttributeQuotes: true
    //   },
    //   // 选择在产出的chunk中引入哪些文件
    //   // 跟entry对象的文件名称
    //   chunk: ['index'],
    //   // 模板
    //   template: './public/index.html',
    //   // 产出得文件名称
    //   filename: 'index.html',
    //   // 向每个资源文件加入查询参数，hash，避免缓存
    //   hash: true,
    //   title: '欢迎光临',
    // })
  ],
  // 配置静态文件服务器
  // 打包后的东西放在内存中
  devServer: {
    // root目录，devServer或依托该文件夹作为静态文件目录
    // 但是产出的文件不会放在该目录下，你可以手动添加文件到该目录下
    // 也是可以访问的
    contentBase: './dist',
    host: 'localhost',
    // 默认8080
    port: 8080,
    // 服务器返回给浏览器的时候是否启动gzip压缩
    compress: true,


  }
};