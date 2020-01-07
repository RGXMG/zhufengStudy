/**
 * node events
 * node 是基于事件驱动，实现就是通过events
 **/
 const EventEmitter = require('./3.events');
 // const EventEmitter = require('events');
 const utils = require('util');

// 创建类
function Bell() {
  // 继承私有属性
  EventEmitter.call(this);
}
// 进行原型继承，继承EventEmitter上的方法
// Object.setProtoTypeOf(ctor.prototype, superCtor.prototype);
// ctor.prototype.__proto__ = superCtor.prototype;
utils.inherits(Bell, EventEmitter);

const bell = new Bell();
function studentInClassroom(rn, bn) {
  console.log(`一些学生带着${bn}进了${rn}教室！`);
}
function teacherInClassroom(rn, bn) {
  console.log(`讲师带着${bn}进了${rn}教室！`);
}
bell.on('ING', studentInClassroom);
bell.on('ING', studentInClassroom);
bell.on('ING', studentInClassroom);
bell.on('ING', studentInClassroom);
bell.on('ING', studentInClassroom);
bell.on('ING', studentInClassroom);
bell.on('ING', studentInClassroom);
bell.on('ING', studentInClassroom);
bell.on('ING', studentInClassroom);
bell.on('ING', studentInClassroom);
bell.on('ING', studentInClassroom);
bell.on('ING', studentInClassroom);
bell.on('ING', studentInClassroom);
bell.on('ING', studentInClassroom);
bell.on('ING', studentInClassroom);
bell.on('ING', studentInClassroom);
bell.on('ING', studentInClassroom);
bell.on('ING', studentInClassroom);
bell.once('ING', teacherInClassroom);
bell.emit("ING", 301, '道家学说');
