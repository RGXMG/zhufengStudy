/**
 * 内部有个事件流 tapable 1.0
 */

const path = require('path');
const htmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const copyWebpackPlugin = require('copy-webpack-plugin');
const cleanWebpackPlugin = require('clean-webpack-plugin');
/**
 * miniCssExtractPlugin可以将页面的中的css文件单独提取出来，不让其打包到bundle.js中
 * 1. 利用缓存使用公共css
 * 2. 利用浏览器的并行加载，缩小加载时间
 */
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
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


  // 监听原文件的变化，当源文件改变后，则重新打包
  watch: true,
  // watch配置文件
  watchOptions: {
    ignored: /node_modules/,
    // 每秒轮询的次数
    poll: 1000,
    // 每次修改停止之后间隔时间才会编译(毫秒)，类似于防抖
    aggregateTimeout: 500
  },



  // 开发选项，可以设置如何处理编译的源码
  // 各种格式 https://www.webpackjs.com/configuration/devtool/#devtool
  // 下面只是列举几个
  devtool: 'source-map', // 单独放置，打包慢，能准确定位
  // devtool: 'inline-cheap-source-map', // 不单独放置，①base64编码格式追加到js文件末尾，只能定位到哪一行源码出错，打包快
  // devtool: 'cheap-module-source-map', // 单独文件，打包速度一般，只能定位到哪一行出错


  // 负责引入模块的时候，比如modules模块的寻址根路径，alias文件名依赖，extensions文件扩展名
  resolve: {
    // 模块的寻找根目录，当引入一个绝对路径的模块时，就会从下面的路径进行查找，默认是node_modules
    // 比如自己有个lib文件夹，里面全是库，引入的时候不需要使用相对路径，而直接可以使用绝对路径
    modules: ['node_modules', 'lib'],
    // 引入文件的后缀，如引入./base，其中base为base.jsx，那么如果配置了extensions，则不需要在添加上后缀
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
    // 引用一个库时/文件夹时，会首先找寻package.json中的字段中的入口文件，一般是main字段，
    // 下面的意思就是说首先找寻main字段，如果没有则找寻node，这样依次找寻
    mainFields: ['main', 'node', 'browser'],
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
    // 不需要递归解析的文件，适用于排除那些已经编译过得文件，如*.min.js
    noParse: [/.+\.min\.js/],
    // 规则处理
    rules: [
      {
        test: /.jsx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader'
        }
      },
      {
        test: /.less$/,
        // 使用miniCSSExtraPlugin将css-loader处理之后的css单独打包
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'less-loader'],
      },
      {
        test: /.scss$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'],
      },
      {
        // 正则匹配去匹配css文件
        test: /\.css/,
        // loader如果只有单个，那么只需要些一个string就行
        // 多个话使用数组，执行顺序从右到左
        // css-loader解析处理css文件中的url路径，把css文件处理为一个模块
        // style-loader可以把css文件变成style标签插入head中
        loader: [MiniCssExtractPlugin.loader, 'css-loader', {
          loader: 'postcss-loader',
          options: {
            plugins: () => [require('postcss-preset-env')]
          }
        }]
      },
      /**
       * 处理在html模板中的img图片
       * 会改变图片的引用路径
       */
      {
        test: /\.(html|htm)/,
        use: 'html-withimg-loader'
      },
      /**
       * url-loader
       * 允许将文件转换为base64直接嵌入，转换条件为设置的limit大小，小于limit才会转换
       * 如果大于limit的话会自动把控制权交给file-loader
       */
      {
        test: /\.(png|jpg|jpeg|gif|svg|bml)$/,
        use: {
          loader: 'url-loader',
          options: {
            // 200KB 以内都转为base64
            limit: 10 * 1024,

            // file-loader的options
            // file-loader新版本默认就是采用esModule加载
            // 所以如果使用require的话，则需要配置esModule为false即可
            esModule: false,
            name: 'assets/[name].[hash:7].[ext]',
            // 指定输出所有目录
            outputPath: ''
          }
        }
      },
      // file-loader是处理二进制数据，如文件，它会把文件从源位置复制到目标地址并修改引用地址
      {
        // test: /\.(png|jpg|jpeg|gif|svg|bml)/,
        // use: {
        //   loader: 'file-loader',
        //   options: {
            // file-loader的options
            // file-loader新版本默认就是采用esModule加载
            // 所以如果使用require的话，则需要配置esModule为false即可
            // esModule: false,
            // name: '[name].[hash:7].[ext]',
            // 指定输出所有目录
            // outputPath: 'assets/'
          // }
        // }
      },
      // {
      //   test: require.resolve('jquery), // require.resolve拿到一个模块的绝对路径，引入在代码中导入的时候是一个绝对路径
      //   loader: 'expose-loader?$'
      // },
    ]
  },


  // plugins 放置顺序与执行顺序无关，都是监听事件
  plugins: [
    new copyWebpackPlugin([
      {
        from: './public',
        to: './dist',
        ignore: ['html'],
      }
    ]),
    new MiniCssExtractPlugin({
      filename: 'css/[name].[hash:8].css',
      chunkFilename: '[id].css',
    }),
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
