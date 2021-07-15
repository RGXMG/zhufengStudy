/**
 * Created with JavaScript.
 * User: rgxmg
 * Email: rgxmg@foxmail.com
 * Date: 2021/7/15
 * Time: 11:54
 *
 */

// 外层从左到右循环(i ++)，内层从右到左找出最小的排在最左边：
function bubbleSortLeft(arr) {
  for (let i = 0; i < arr.length - 2; i++) {
    for (let j = arr.length - 2; j >= i; j--) {
      if (arr[j] > arr[j + 1]) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
      }
    }
  }
  return arr;
}

console.log(bubbleSortLeft([3, 2, 4, 5, 1, -1, 9, 0, 15, 2, 3, 1, 5, 3, 6]));

// 外层从右到左循环(i --)，内层从左到右冒泡出最大值排在最右边
function bubbleSortRight(arr) {
  for (let i = arr.length - 2; i > 0; i--) {
    for (let j = 0; j <= i; j++) {
      if (arr[j] > arr[j + 1]) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
      }
    }
  }
  return arr;
}

console.log(bubbleSortRight([3, 2, 4, 5, 1, -1, 9, 0, 15, 2, 3, 1, 5, 3, 6]));
