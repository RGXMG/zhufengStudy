const path = require("path");
module.exports = [
  { n: "index", p: "./src/2.tree_shaking/index.js" },
  { n: "utils", p: "./src/2.tree_shaking/utils.js" }
].map(i => ({
  entry: {
    [i.n]: i.p
  },
  output: {
    path: path.join(__dirname, "./src/2.tree_shaking/dist"),
    filename: "[name].[contentHash:8].js"
  }
}));
// module.exports = {
//   entry: {
//     utils: "./src/2.tree_shaking/utils.js",
//     index: "./src/2.tree_shaking/index.js"
//   },
//
//   output: {
//     path: path.join(__dirname, "./src/2.tree_shaking/dist"),
//     filename: "[name].[contentHash:8].js"
//   },
// };
