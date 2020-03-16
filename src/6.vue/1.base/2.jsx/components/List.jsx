/**
 * NOTE List组件
 *   可以接受父组件传入一个函数返回它想定义的item标签，
 *   需要在在render函数中调用该方法，即可以查找个h参数
 */
export default {
  props: {
    // 定义一个render方法，
    render: Function,
    data: Array
  },
  methods: {
    defaultItemRender(key, item) {
      return <li key={key}>{item}</li>;
    }
  },
  render() {
    const { data, render } = this;
    return (
      <div>
        {data.map(i => (render ? render(i, i) : this.defaultItemRender(i, i)))}
      </div>
    );
  }
};
