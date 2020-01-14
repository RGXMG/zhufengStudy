// css的使用
require('./index.css');
// 使用css中的url引入
const div = document.createElement('div');
div.className = 'avatar';
document.body.appendChild(div);

// less使用
require('./less.less');
const divLess = document.createElement('div');
divLess.className = divLess.innerText = 'name';
document.body.appendChild(divLess);

// sass使用
require('./sass.scss');
const divSass = document.createElement('div');
divSass.className = divSass.innerText = 'age';
document.body.appendChild(divSass);


// 图片的使用
const imgSrc = require('../assets/img/1.jpg');
// 小于200KB的图片
const imgSrcDva = require('../assets/img/timg.jpg');
const img = new Image();
const imgDva = new Image();
imgDva.src = imgSrcDva;
img.src = imgSrc;
document.body.appendChild(img);
document.body.appendChild(imgDva);

// expose-loader:将一个模块置为全局变量，挂载到window上面
// 这样其他模块的代码就可以直接拿到该模块，不需要引入模块再使用
// expose-loader和webpack自带的plugin中的ProvidePlugin有点类似
// 那就是在使用了之后，无需再次手动引入一个模块而可以直接使用
const $ = require('expose-loader?$!jquery');
require('./use$');
$('#index').html('index');

// es6的代码使用，使用babel编译
import consoleColor from  './es6';
consoleColor();

// react使用
import './reactIndex';
