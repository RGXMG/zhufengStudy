function read(name, cb) {
  setTimeout(() => cb(name + "name:::"), 200);
}
function getName(name) {
  read(name, function(val) {
    return val;
  });
}
try {
  const name = getName();
} catch (e) {
  console.error(e.message);
}
