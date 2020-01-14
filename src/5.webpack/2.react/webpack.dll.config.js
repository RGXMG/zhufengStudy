const webpack = require('webpack');
const path = require('path');
const dllName = '_dll_[name]';
module.exports = {
  entry: {
    react: ['react', 'react-dom'],
  },
  output: {
    path: path.join(__dirname, 'dist'),
    filename: '[name]_dll.js',
    // libraryTarget library 的含义
    // https://blog.csdn.net/frank_yll/article/details/78992778
    // 只指定library时，libraryTarget为var
    // 不指定 output.library 将取消这个 “var” 配置
    library: dllName,
},
  plugins: [
    new webpack.DllPlugin({
      name: dllName,
      // manifest描述文件
      path: path.join(__dirname, 'dist', 'manifest.json')
    })
  ]

};
