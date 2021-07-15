/**
 * Created with JavaScript.
 * User: rgxmg
 * Email: rgxmg@foxmail.com
 * Date: 2021/7/15
 * Time: 13:06
 *
 */

/**
 * 选择排序
 * 即针对每个元素，进行比较，一次选择出最小值或者最大值，然后拿选择出的值又进行比较
 * 需要内外层循环都参与
 * 如： [3, 2, 1, 5]
 * 第一次：外=0，内=1，arr[0]=3和arr[1]=2比较，选择出最小值2赋给arr[0] => [2, 3, 1, 5];
 * 第二次：外=0，内=2，arr[0]=2和arr[2]=1比较，选择出最小值1赋给arr[0] => [1, 3, 2, 5];
 * ...
 * @param arr
 * @returns {*}
 */
function selectionSort(arr) {
  for (let i = 0; i < arr.length - 1; i++) {
    for (let j = i + 1; j <= arr.length - 1; j++) {
      if (arr[i] > arr[j]) {
        [arr[i], arr[j]] = [arr[j], arr[i]];
      }
    }
  }
  return arr;
}

console.log(selectionSort([3, 2, 4, 5, 1, -1, 9, 0, 15, 2, 3, 1, 5, 3, 6]));
