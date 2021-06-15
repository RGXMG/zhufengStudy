/**
 * Created with JavaScript.
 * User: RGXMG
 * Email: rickgrimes9229@gmail.com/759237309@qq.com
 * Date: 2021/6/14
 * Time: 17:32
 *
 */

// 剖析：https://github.com/mqyqingfeng/Blog/blob/master/demos/ES6/generator/generator-es5.js
// 1. 主要关注俩个函数，mark以及wrap函数；
// 首先会执行mark函数时，该函数会在生成一个对象【mark】，该对象上原型上会实现generator的三个方法【next/throw/return】，三个方法都会调用this上的invoke函数；
// 然后我们所书写的generator函数【innerFn】会被wrap函数包裹：
//  1. 它接收innerFn函数以及mark对象；
//  2. 根据传入的mark对象的原型生成一个generator对象；
//  3. new 一个context对象，该对象上保存在执行generator函数时所包含的数据，如prev，next(下一个执行的switch-case的值)，sent(调用next时传入的参数)和更改context中数据的方法；
//  4. 根据context对象和innerFn函数生成一个invoke函数，在该函数体内就会实际的调用我们的invoke函数；
//  5. 将invoke函数挂在到generator对象上，然后返回；
