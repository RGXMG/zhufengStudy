/**
 * Created with JavaScript.
 * User: rgxmg
 * Email: rgxmg@foxmail.com
 * Date: 2021/7/15
 * Time: 17:35
 *
 */

/**
 * 简单快排
 * 1. 取集合的中间索引值(Math.floor(arr.length / 2));
 2. 然后取出这个中间索引对应的值；
 3. 遍历集合，将小于该中间索引值的放在左边新集合，大于的放在右边新集合；
 4. 对左边新集合再次调用该函数进行递归；
 5. 对右边新集合再次调用该函数进行递归；
 6. 将 左递归 concat 中间索引值 concat 右递归
 * @param arr
 */
function quickSortSmall(arr) {
  if (arr.length <= 1) {
    return arr;
  }
  let leftArr = [],
    rightArr = [];
  const pivot = arr.splice(Math.floor(arr.length / 2), 1);
  for (const i of arr) {
    i > pivot ? rightArr.push(i) : leftArr.push(i);
  }
  return quickSortSmall(leftArr).concat(pivot, quickSortSmall(rightArr));
}

console.log(quickSortSmall([3, 2, 4, 5, 1, -1, 9, 0, 15, 2, 3, 1, 5, 3, 6]));
