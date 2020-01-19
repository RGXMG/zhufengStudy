import { flattenDeep } from 'lodash';

const arr = [1,2,[3,[4]],[5,[6],[7]]];
console.log(flattenDeep(arr));
