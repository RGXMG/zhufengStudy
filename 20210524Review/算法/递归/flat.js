/**
 * Created with JavaScript.
 * User: RGXMG
 * Email: rickgrimes9229@gmail.com/759237309@qq.com
 * Date: 2021/7/15
 * Time: 23:19
 *
 */

function flat(arr) {
  let res = [];
  for (const i of arr) {
    res.push(...(Array.isArray(i) ? flat(i) : [i]));
  }
  return res;
}

console.log([1, 2, [3, 4]].toString());
