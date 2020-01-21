// const SObj = Symbol('obj');
// const obj = {
//   [SObj]: 1
// };
// console.log(Object.getOwnPropertySymbols(obj));

import { flattenDeep } from 'lodash';

const arr = [1,2,[3,[4]],[5,[6],[7]]];
console.log(flattenDeep(arr));
