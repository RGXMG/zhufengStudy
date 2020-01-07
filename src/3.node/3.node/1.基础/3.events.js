function EventEmitter() {
  this.eventsObject = {};
  this._maxListeners = 10;
  this._setHintMax = false;
}
EventEmitter.prototype.removeListener = function(name, call) {
  if (!this.eventsObject[name]) return;
  this.eventsObject[name] = this.eventsObject[name].filter(i => i !== call);
};
EventEmitter.prototype.setMaxListeners = function(max) {
  this._maxListeners = max;
};
EventEmitter.prototype.on = EventEmitter.prototype.addEventListener = function(name, call) {
  if (this.eventsObject[name]) {
    this.eventsObject[name].push(call);
    // 检测是否超出限制
    if (!this._maxListeners || this._maxListeners <= this.eventsObject[name].length) return;
    if (this._setHintMax) return;
    this._setHintMax = true;
    setImmediate(function() {
      console.error(`MaxListenersExceededWarning: Possible EventEmitter memory leak detected. 11 ${name} listeners added. Use emitter.setMaxListeners() to increase limit`);
    });
  }
  this.eventsObject[name] = [call];
};
EventEmitter.prototype.emit = function(name, ...rests) {
  if (!this.eventsObject[name]) return;
  this.eventsObject[name].forEach(call => call.apply(this, rests));
};
EventEmitter.prototype.once = function(name, call) {
  const callWrapper = (...args) => {
    call.apply(this, args);
    this.removeListener(name, callWrapper);
  };
  this.addEventListener(name, callWrapper);
};
module.exports = EventEmitter;