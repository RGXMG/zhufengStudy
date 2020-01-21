const path = require('path');
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
        loader: '1.log-loader'
      },
      {
        test: /\.less$/,
        loader: '3.style-loader!2.less-loader'
      },
    ]
  }
};
