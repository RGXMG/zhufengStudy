const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const cleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = {
  entry: './src/index.js',
  output: {
    path: path.join(__dirname, 'dist'),
    filename: '[name].[contentHash:8].js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              [
                '@babel/env',
                // {
                //   useBuiltIns: 'usage',
                //   "corejs": 3
                // }
              ],
            ],
            plugins: [
              [
                "extra",
                {
                  "libraryName": "lodash"
                }
              ]
            ]
          }
        }
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin(),
    new cleanWebpackPlugin.CleanWebpackPlugin(),
  ]
};
