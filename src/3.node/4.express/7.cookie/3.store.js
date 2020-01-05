const util = require('util');
const mkdirp = require('mkdirp');
const fs = require('fs');
const path = require('path');

/**
 * 自定义session存放的地方
 * 通过继承和重写express-express的Session对象的get/set/destroy方法实现
 * @param session
 * @returns {Store}
 * @constructor
 */
function SessionStore(session) {
  function Store(options) {
    // session存放的路径
    const { root } = options;
    mkdirp.sync(root);
    this.root = root;
    session.Store.call(this);
  }
  Store.prototype.resolve = function (pt) {
    return path.join(this.root, pt + '.json');
  };
  Store.prototype.get = function (sid, callback) {
    fs.readFile(this.resolve(this.root), 'utf8', function (err, data) {
      if (err) callback(err);
      else callback(null, JSON.parse(data))
    })
  };
  Store.prototype.set = function(sid, content, callback) {
    fs.writeFile(this.resolve(this.root), JSON.stringify(content), callback)
  };
  // 让Store继承session.Store的其他方法
  util.inherits(Store, session.Store);
  return Store;
}
module.exports = SessionStore;