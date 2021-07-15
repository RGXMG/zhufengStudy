function bubleSort(arr) {
  var len = arr.length;
  for (let outer = len; outer >= 2; outer--) {
    for (let inner = 0; inner <= outer - 1; inner++) {
      if (arr[inner] > arr[inner + 1]) {
        let temp = arr[inner];
        arr[inner] = arr[inner + 1];
        arr[inner + 1] = temp;
      }
    }
  }
  return arr;
}

function bubleSort2(arr) {
  for (let i = arr.length; i > 1; i--) {
    for (let j = 0; j < i - 1; j++) {
      if (arr[j] > arr[j + 1]) {
        [arr[j + 1], arr[j]] = [arr[j], arr[j + 1]];
      }
    }
  }
  return arr;
}

function bubleSortLeft(arr) {
  // 6
  // 5
  for (let i = 0; i < arr.length - 1; i++) {
    for (let j = i; j < arr.length - 1; j++) {
      if (arr[j + 1] < arr[j]) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
      }
    }
  }
  return arr;
}

console.log(bubleSort([9, 1, 2, 4, 6, 3]));
console.log(bubleSort2([9, 1, 2, 4, 6, 3]));
console.log(bubleSortLeft([3, 2, 4, 5, 1]));
