const less = require("less");
module.exports = function(source) {
  let css = "";
  less.render(source, (err, result) => {
    css = result.css;
  });
  return css;
};
