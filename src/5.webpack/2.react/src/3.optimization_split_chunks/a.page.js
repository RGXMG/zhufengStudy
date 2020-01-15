import { add, dynamicImport } from './utils/util';

const funA = () => {
  const v = add('util_add');
  return [v].filter((v) => v);
};
export {
  funA
};
dynamicImport();
