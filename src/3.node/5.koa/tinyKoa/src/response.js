module.exports = {
  set(name, val) {
    this.res.setHeader(name, val);
  }
};
