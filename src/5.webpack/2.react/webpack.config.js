const path = require('path');
const webpack = require('webpack');
// const manifest = require('./dist/manifest');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const WebpackDeepScopeAnalysisPlugin = require('webpack-deep-scope-plugin').default;
const WebpackParalleUglifyPlugin = require('webpack-parallel-uglify-plugin');
const cleanWebpackPlugin = require('clean-webpack-plugin');

/**
 * NOTE thread-loader
 * https://www.webpackjs.com/loaders/thread-loader/
 * 这个 loader 放置在其他 loader 之前， 放置在这个 loader 之后的 loader 就会在一个单独的 worker【worker pool】 池里运行，一个worker 就是一个nodeJS 进程【node.js proces】，每个单独进程处理时间上限为600ms，各个进程的数据交换也会限制在这个时间内
 */

module.exports = {
  // entry: ['./src/index.jsx'],
  // 测试tree-shaking
  entry: ['./src/tree_shaking/index.js'],
  output: {
    path: path.join(__dirname, 'dist'),
    filename: '[name].[hash:8].js'
  },
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /.jsx?$/,
        exclude: /node_module/,
        use: [
          {
            loader: 'thread-loader',
            options: {}
          },
          'babel-loader'
        ]
      }
    ]
  },
  devServer: {
    host: 'localhost',
    port: 8080,
    // 使用inline模式，在入口文件中注入socket.io
    // 默认就是inline
    inline: true,
    // 热加载
    hot: true,
    // watcherOptions: {
    //   ignored: /node_modules/,
    //   aggregateTimeout: 500
    // }
  },
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx']
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
    new WebpackParalleUglifyPlugin({
      uglifyJS: {
        output: {
          beautify: false,
          comments: false
        },
        sourceMap: false
      },
    }),
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
      template: './public/index.html',
      filename: 'index.html',
      hash: true,
      title: 'REACT',
      minify: {
        removeAttributeQuotes: true
      },
    })
  ]
};
