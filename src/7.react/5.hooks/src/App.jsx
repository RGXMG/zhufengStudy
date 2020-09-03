import React, { useState } from "react";

/**
 * NOTE 在该方法中，操作如下：
 *   1. 先点击两次 +1，之后number变成2；
 *   2. 再点击一次 alert;
 *   3. 马上再点击 +1，将number的值再次增加；
 * NOTE  最后弹出的值是2，并未最后的number值，是因为产生了闭包，当点击alert的时候，alert函数就会立即执行，然后js引擎会保留外部的变量，以便于在alert函数内部使用，所以弹出的是2；这个原理跟下面的代码一样：
 * for (var i = 0; i < 10; i ++) {
 *   let j = i;
 *   setTimeout(() => console.log(j));
 * }
 * @returns {*}
 * @constructor
 */
export default function RenderAlert() {
  const [number, setNumber] = useState(0);
  function alert() {
    setTimeout(() => {
      window.alert(number);
    }, 3000);
  }
  return (
    <>
      <h2>{number}</h2>
      <button onClick={() => setNumber(number + 1)}>+1</button>
      <button onClick={alert}>alert</button>
    </>
  );
}
