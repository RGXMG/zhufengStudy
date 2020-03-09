const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
module.exports = {
  entry: './src/index.js',
  output: {
    path: path.join(__dirname, 'dist'),
  },
  // 配置查找loader的目录
  resolveLoader: {
    modules: [
      'node_modules',
      path.resolve('./loaders')
    ]
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: [
          '1.log-loader',
          // {
          //   loader: '4.banner-loader',
          //   options: {
          //     copyright: './loaders/4.copyright.js'
          //   }
          // },
        ]
      },
      {
        test: /\.html$/,
        use: {
          loader: '5.html-layout-loader',
        }
      },
      {
        test: /\.less$/,
        loader: '3.style-loader!2.less-loader'
      },
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/login.html',
      filename: 'login.html'
    }),
    new HtmlWebpackPlugin({
      template: './public/home.html',
      filename: 'home.html'
    }),
  ]
};
