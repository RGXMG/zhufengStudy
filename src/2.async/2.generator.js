function *go() {
  console.log(1);
  const a = yield 'a';
  console.log(a);
  const b = yield 'b';
  console.log(b);
}

// generator函数(生成器函数)，首次调用返回一个迭代器it
// 首次调用next()传入参数是没有意义的，不需要传入参数
// 当it.next()时会执行go函数，直到碰到yield时go函数会暂定，
// 此时it，next()会得到yield后面的值，此时go函数挂起，
// 再次it.next()时，传入next()里面的参数会返给yield左边的，go函数继续执行
let it = go();
let a = it.next();
console.log(a);
// next中的值会被付给上一个yield左边的值
let b = it.next('i am a');
console.log(b);
it.next('i am b');
let c = it.next();
console.log(c);