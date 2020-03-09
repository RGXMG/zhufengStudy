const index = 55;

import(/* webpackChunkName: "render" */ "./dynamic.js").then(res => {
  console.log("loading completed:::", res);
});
export default index;
