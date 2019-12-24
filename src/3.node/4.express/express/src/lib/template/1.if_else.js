/**
 * 模板引擎的核心原理
 * 1. 利用new Function(args..., functionBody)将字符串转为函数执行
 * 2. 利用with(obj) { console.log(name) }创建自己的作用域
 */

const str = `
 <%if(user){%>
 hello <%=user.name%>
 <%}else{%>
 hello rgxmg
 <%}%>
 <ul>
 <%for(let i = 0; i < total; i++){%>
 <li><%=i%><li>
 <%}%>
 </ul>
`;
const options = { user: { name: 'xmg' }, total: 5 };
const render =  function (tpl, options) {
  let head = "with(options) {\n let tpl = '';\ntpl += `";
  let withBody = tpl.replace(/<%=([\s\S]+?)%>/g, function () {
    console.log(arguments);
      return "${" + arguments[1] + "}";
  });
  withBody = withBody.replace(/<%([\s\S]+?)%>/g, function () {
    return "`;\n" + arguments[1] + "\ntpl += `";
  });
  // 替换变量
  const tail = "`;\nreturn tpl;}";
  let html = head + withBody + tail;
  const fn = new Function('options', html);
  return fn(options);
};
console.log(render(str, options));