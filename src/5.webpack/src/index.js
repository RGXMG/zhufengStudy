// css的使用
require('./index.css');

// 图片的使用
const imgSrc = require('../assets/img/1.jpg');
const img = new Image();
img.src = imgSrc;
document.body.appendChild(img);

// expose-loader:将一个模块置为全局变量，挂载到window上面
// 这样其他模块的代码就可以直接拿到该模块，不需要引入模块再使用
// expose-loader和webpack自带的plugin中的ProvidePlugin有点类似
// 那就是在使用了之后，无需再次手动引入一个模块而可以直接使用
const $ = require('expose-loader?$!jquery');
require('./i2');

console.log('index ---');
$('#index').html('index');