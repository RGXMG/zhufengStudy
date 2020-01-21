const less = require('less');
module.exports = function(source) {
  const cb = this.async();
  less.render(source, (err, result) => {
    cb(null, result.css);
  });
};
