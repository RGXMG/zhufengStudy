const add = v => {
  if (v === 'util_add') {
    return v + 1;
  }
  return v - 1;
};

const dynamicImport = () => {
  window.addEventListener('click', () => {
    import(/* webpackChunkName: "lodash_es" */ 'lodash').then(_ => {
      const div = document.createElement('div');
      div.innerText = _.join(['hello', 'world']);
      document.body.appendChild(div);
    });
  })
};
export {
  add,
  dynamicImport
}
