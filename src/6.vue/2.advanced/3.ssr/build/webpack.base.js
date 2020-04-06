const path = require("path");
const CleanWebpackPlugin = require("clean-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const VueLoader = require("vue-loader");

module.exports = {
  output: {
    path: path.join(__dirname, "../dist"),
    filename: "[name].[contentHash:4].js"
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
    extensions: [".vue", ".js"]
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: [
              [
                "@babel/env",
                {
                  useBuiltIns: "usage",
                  targets: ">0.2%",
                  corejs: "3"
                }
              ]
            ],
            plugins: [
              [
                "@babel/plugin-transform-runtime",
                {
                  corejs: 3
                }
              ]
            ]
          }
        }
      },
      {
        test: /\.vue$/,
        exclude: /node_modules/,
        loader: "vue-loader"
      },
      {
        test: /\.less/,
        use: [MiniCssExtractPlugin.loader, "css-loader", "less-loader"]
      }
    ]
  },
  plugins: [
    new VueLoader.VueLoaderPlugin(),
    // new CleanWebpackPlugin.CleanWebpackPlugin(),
    new MiniCssExtractPlugin({
      filename: "css/[name].[hash:8].css",
      chunkFilename: "[id].css"
    })
  ]
};
