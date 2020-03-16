/**
 * NOTE 函数时组件必须返回一个render函数
 *  该组价传递根据不同的type值(1-6)渲染不同的h标签
 */
export default {
  functional: true,
  render(h, context) {
    const {
      children,
      props: { type }
    } = context;
    console.log(context);
    const Tag = `h${type}`;
    return <Tag>{children}</Tag>;

    // NOTE h就是`createElement`，
    //  1. 第一参数时标签；
    //  2. 第二个是属性：如on绑定事件、attrs属性等等
    //  3. 第三个参数时children，多个儿子可以使用数组
    // h(
    //   "h1",
    //   {
    //     on: {
    //       click() {
    //         alert("标题");
    //       }
    //     }
    //   },
    //   "标题"
    // );
  }
};
