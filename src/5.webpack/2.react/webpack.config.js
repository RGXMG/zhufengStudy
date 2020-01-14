const path = require('path');
const webpack = require('webpack');
const manifest = require('./dist/manifest');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const cleanWebpackPlugin = require('clean-webpack-plugin');
module.exports = {
  entry: ['./src/app.jsx'],
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
        loader: 'babel-loader'
      }
    ]
  },
  devServer: {
    host: 'localhost',
    port: 8080,
    hot: true,
    watcherOptions: {
      ignored: /node_modules/,
      aggregateTimeout: 500
    }
  },
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx']
  },
  plugins: [
    new webpack.DllReferencePlugin({
      manifest
    }),
    // new cleanWebpackPlugin.CleanWebpackPlugin(),
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
