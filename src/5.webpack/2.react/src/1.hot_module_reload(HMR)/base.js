export default function render() {
  const baseEle = document.querySelector('#base');
  const div = baseEle || document.createElement('div');
  div.id = 'base';
  div.innerText = '6666';
  if (!baseEle) {
    document.body.appendChild(div);
  }
}
