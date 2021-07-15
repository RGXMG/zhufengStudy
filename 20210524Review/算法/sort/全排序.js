/**
 * Created with JavaScript.
 * User: rgxmg
 * Email: rgxmg@foxmail.com
 * Date: 2021/7/15
 * Time: 13:07
 *
 */

/**
 * 全排列，即创造出所有可能的组合
 * 主要思想就是：每次组合的集合，用作下一次循环的前置项，然后跟剩下的集合连接
 * 实际上就是一个组合：
 * 3项组合3项变成9项；然后9项再组合3项变成27项；
 * 1. 取出第一项memo作为起始项
 * 2. 循环遍历剩下的项i并创造一个领时保存t
 * 3. 循环遍历第一项memo的作为m
 * 4. 循环i，将连接m和i的值放入m
 * 5. 将m赋值给memo，开始下一轮循环
 * @param arr
 * @returns {*}
 */
function fullCompare(arr) {
  let memo = arr.shift();
  for (const i of arr) {
    let t = [];
    for (const m of memo) {
      for (const it of i) {
        t.push(`${m}-${it}`);
      }
    }
    memo = t;
  }
  return memo;
}

function fullSku(arr) {
  return arr.reduce((a, b) =>
    a.map((i) => b.map((j) => `${i}-${j}`)).reduce((a, b) => [...a, ...b])
  );
}

var data = [
  ["大陆版", "美版", "港版"],
  ["红色", "黑色", "白色"],
  ["32g", "64g", "128g", "256g"],
];

// console.log(fullSku(data));
// console.log(fullCompare(data));

// 输入: n = 4, k = 2
// 输出:
//   [
//     [2,4],
//     [3,4],
//     [2,3],
//     [1,2],
//     [1,3],
//     [1,4],
//   ]

console.log(
  fullCompare([
    [1, 2, 3, 4],
    [1, 2, 3, 4],
  ])
);
