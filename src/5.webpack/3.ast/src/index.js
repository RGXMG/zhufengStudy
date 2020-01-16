let esprima = require('esprima');
const estraverse = require('estraverse');
let code = 'function ast(){}';
let ast = esprima.parse(code);
console.log(ast);
