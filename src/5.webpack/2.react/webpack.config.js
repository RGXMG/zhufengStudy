const path = require("path");
const webpack = require("webpack");
// const manifest = require('./dist/manifest');
const HtmlWebpackPlugin = require("html-webpack-plugin");
const WebpackDeepScopeAnalysisPlugin = require("webpack-deep-scope-plugin")
  .default;
const WebpackParalleUglifyPlugin = require("webpack-parallel-uglify-plugin");
const cleanWebpackPlugin = require("clean-webpack-plugin");

/**
 * NOTE thread-loader
 * https://www.webpackjs.com/loaders/thread-loader/
 * 这个 loader 放置在其他 loader 之前， 放置在这个 loader 之后的 loader 就会在一个单独的 worker【worker pool】 池里运行，一个worker 就是一个nodeJS 进程【node.js proces】，每个单独进程处理时间上限为600ms，各个进程的数据交换也会限制在这个时间内
 */

module.exports = {
  // entry: ['./src/index.jsx'],

  // 测试tree-shaking
  entry: ["./src/2.tree_shaking/index.js"],

  // 测试hot-module-reload(HMR)
  // entry: ['./src/1.hot_module_reload(HMR)/index.js'],

  // 测试代码分割 optimization splitChunks
  // 当chunks为initial时，从入口文件分割
  // entry: {
  //   pageA: './src/3.optimization_split_chunks/a.page.js',
  //   pageB: './src/3.optimization_split_chunks/b.page.js',
  //   pageC: './src/3.optimization_split_chunks/c.page.js'
  // },

  // import 动态加载
  // entry: './src/4.webpack_dynamic/index.js',

  output: {
    path: path.join(__dirname, "dist_dynamic"),
    filename: "[name].[contentHash:8].js"
  },

  /**
   * webpack提供的优化选项
   * 默认webpack已经提供了开箱即用的代码分割，但是仅仅是针对异步代码(import动态加载)
   * 也就是chunks的值为async
   * https://www.cnblogs.com/kwzm/p/10314438.html
   * https://webpack.js.org/configuration/optimization/#optimizationsplitchunks
   */
  optimization: {
    // 代码分割, 会将重复引用的代码提取出来
    splitChunks: {
      // chunks表示要分割哪些模块：
      // async表示只从异步加载得模块（动态加载import()）里面进行拆分
      // initial表示只从入口模块进行拆分
      // all表示以上两者都包括(推荐)
      // 还可以传入函数，参数为引入的名称
      // chunks: 'initial',

      // 默认，大于300k的包才做代码分割
      // minSize: 300000,

      // 默认，分割出来的每个包最大size，
      // 比如设为50000（500kb），那如果某个包分离出来后超过50kb，就会进行再分割，保证每个文件都不超过50kb
      // maxSize: 500000,

      // 默认，至少被引入一次就进行代码分隔
      // minChunks: 2,

      // 默认，浏览器最多并行请求5个js文件,也就是说，分割数量超过5个时，就会停止代码分割了
      // maxAsyncRequests: 5,

      // 默认，对于入口文件最多只分割3个js包，超过3个就停止
      // maxInitialRequests: 3,

      // 默认，文件名连接符
      // automaticNameDelimiter: '~',

      // 默认，分割后的文件名将根据chunks和cacheGroups自动生成名称。
      // name: false,
      cacheGroups: {
        // vendors是组名
        vendors: {
          chunks: "async",
          // 默认，只对node_modules里的代码进行分隔
          test: /node_modules/,
          minSize: 300000,
          minChunks: 2,
          /*
            默认，每个组都会有个优先级，
            如果某个包满足多个组的test规则，就按优先级来判断归哪个组
            数值越大，优先级越高
          */
          // priority: -10,
          // 分割后的文件名（默认是：组名~入口名.js，即verdors~main.js）
          filename: "vendors.js"
          // 强制分隔，无视minChunks、maxAsyncRequests等选项，默认false
          // enforce: false
        },
        // default是组名, 分隔不在node_modules里的代码
        commons: {
          chunks: "initial",
          minChunks: 2, // 默认
          priority: -20, // 默认
          filename: "commons.js",
          minSize: 0
          /*
            复用已存在的chunk,
            比如index.js里引入axios和test.js
            test里也引入了axios，那么axios就会被复用
          */
          // reuseExistingChunk: true
        }
      }
    }
  },

  // devtool: 'source-map',

  module: {
    rules: [
      {
        test: /.jsx?$/,
        exclude: /node_module/,
        use: [
          {
            loader: "thread-loader",
            options: {}
          },
          "babel-loader"
        ]
      }
    ]
  },

  devServer: {
    host: "localhost",
    port: 8080,
    // 使用inline模式，在入口文件中注入socket.io
    // 默认就是inline
    inline: true,
    // 热加载
    hot: true
    // watcherOptions: {
    //   ignored: /node_modules/,
    //   aggregateTimeout: 500
    // }
  },

  resolve: {
    extensions: [".js", ".jsx", ".ts", ".tsx"]
  },

  plugins: [
    // webpack默认在进行tree-shaking的时候存在局限性
    // 它只能够进行词法分析，剔除那些未使用到的导出对象
    // 但是那些未使用到的导出对象内部使用的模块，它选择保留
    // 该plugin能够进行作用于词法分析
    // 找出那些没有使用到的变量
    // https://www.cnblogs.com/tugenhua0707/p/9671618.html#_labe1_2
    new WebpackDeepScopeAnalysisPlugin(),

    // 启用多个子线程压缩
    // 具体配置参数：https://www.cnblogs.com/tugenhua0707/p/9569762.html
    // new WebpackParalleUglifyPlugin({
    //   uglifyJS: {
    //     output: {
    //       beautify: false,
    //       comments: false
    //     },
    //     sourceMap: false
    //   },
    // }),

    // 定义运行时的环境变量
    new webpack.DefinePlugin({
      __development__: process.env.env
    }),

    // 根据manifest文件引入已经打包的DLL文件
    // new webpack.DllReferencePlugin({
    //   manifest
    // }),

    new cleanWebpackPlugin.CleanWebpackPlugin(),

    new HtmlWebpackPlugin({
      template: "./public/index.html",
      filename: "index.html",
      hash: true,
      title: "REACT",
      minify: {
        removeAttributeQuotes: true
      }
    })
  ]
};
