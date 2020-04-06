const VueRenderer = require("vue-server-renderer");
const fs = require("fs");
const path = require("path");

function renderer(vm) {
  const template = fs.readFileSync(
    path.join(__dirname, "../template/index.html"),
    "utf8"
  );
  const content = VueRenderer.createRenderer({
    template
  });
  return content.renderToString(vm);
}
exports.renderer = renderer;
