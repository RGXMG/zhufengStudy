import History from "./base";

/**
 * NOTE HashHistory
 *  hash模式的类，包含处理hash类型的一些路由方法，如获取当前path
 */
export default class HashHistory extends History {
  constructor(router) {
    super(router);
    this.router = router;
    ensureFlash();
  }
  getCurrentLocation() {
    return getHash();
  }
  setupListener(cb) {
    window.addEventListener("hashchange", () => {
      cb(this.getCurrentLocation());
    });
  }
}
function getHash() {
  return window.location.hash.slice(1);
}
function ensureFlash() {
  if (window.location.hash) {
    return;
  }
  window.location.hash = "/";
}
