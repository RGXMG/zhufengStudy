const path = require("path");
const fs = require("fs");
const stat = fs.statSync;
const readdir = fs.readdirSync;

class ClearWebpackPlugin {
  deleteFile(_path) {
    fs.unlinkSync(_path);
  }
  clearFolder(_path) {
    const cStat = stat(_path);
    if (!cStat.isDirectory()) {
      this.deleteFile(_path);
    } else {
      const dirInfo = readdir(_path);
      for (const _path of dirInfo) {
        if (cStat.isDirectory()) {
          this.clearFolder(_path);
        } else this.deleteFile(_path);
      }
    }
  }
  apply(compiler) {
    compiler.hooks.entryOption.tap('clearWebpackPlugin', options => {
      const { output = {} } = options;
      if (output.path) {
        this.clearFolder(output.path);
      }
    });
  }
}
module.exports = ClearWebpackPlugin;
