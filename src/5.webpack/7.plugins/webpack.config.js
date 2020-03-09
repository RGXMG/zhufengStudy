const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const InlineWebpackPlugin = require('./plugins/1.inline-plugin');
module.exports = {
  entry: './src/index.js',
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'bundle.js'
  },
  plugins: [
    new HtmlWebpackPlugin(),
    new InlineWebpackPlugin()
  ]
};