const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const cleanWebpackPlugin = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  entry: './src/index.js',
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'app.[hash:8].js'
  },
  watch: true,
  resolve: {
    extensions: ['.vue', '.js'],
    alias: {
      '@': './src',
    },
    modules: [path.join(__dirname, 'source'), path.resolve('node_modules')],
  },
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.vue$/,
        use: {
          loader: 'vue-loader',
          options: {}
        },
      },
      {
        test: /\.(png|jep|jpeg)$/,
        use: {
          loader: 'url-loader',
          options: {
            // 200KB 以内都转为base64
            limit: 10 * 1024,
            name: 'assets/[name].[ext]'
          }
        }
      },
      {
        test: /.less$/,
        loader: [MiniCssExtractPlugin.loader, 'css-loader', 'less-loader']
      }
    ]
  },
  devServer: {
    port: 3001,
    hot: true,
    host: 'localhost',
    contentBase: './dist',
    compress: true
  },
  plugins: [
    new cleanWebpackPlugin.CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: './public/index.html',
      minify: {
        removeAttributeQuotes: true
      }
    }),
    new MiniCssExtractPlugin({
      filename: 'css/[name].[hash:8].css'
    }),
  ]
};