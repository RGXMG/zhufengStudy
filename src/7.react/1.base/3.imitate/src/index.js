import Component from "../lib/Component";

export default class Button extends Component {
  constructor(props) {
    super(props);
    this.state = { count: 0 };
  }

  /**
   * NOTE 在react中，更新state可能是同步的，也可能是异步(表现为异步) 的；
   *  1. 异步的：当在一个事件处理函数中同步调用多次setState时，
   *     等待函数同步代码执行完成之后，这个state才会批量更新，并且会将所有的state合并，
   *  2. 同步的：当一个事件处理函数同步代码执行完成之后，如果在这个事件处理函数中存在异步多次调用setState,
   *     则这个state会立马更新，并不会异步更新，也就是说一个setState会阻塞下一个setState
   *  原因则是在react中，在执行一个事件处理函数时，react会在这个事件执行之前开启批量异步更新state，
   *  这个时候在处理函数中同步调用的setState传入的partialState则会被保存，而该组件也会被定义为一个dirty组件，
   *  名为脏组件(试图与state不同步)，待处理函数同步代码执行完成之后，就会将批量更新关闭，
   *  并且统一合并成一个新的state去更新。之后如果在处理函数中存在异步代码，因为批量更新已经关闭，
   *  所以这些连续调用setState的代码就会立刻更新试图；
   */
  add = () => {
    this.setState({ count: this.state.count + 1 });
    console.log(this.state);
    this.setState({ count: this.state.count + 1 });
    console.log(this.state);
    setTimeout(() => {
      this.setState({ count: this.state.count + 1 });
      console.log(this.state);
      this.setState({ count: this.state.count + 1 });
      console.log(this.state);
    });
  };
  reduce = () => {
    this.setState({ count: this.state.count - 1 });
  };
  render() {
    return (
      this.state.count +
      `<br /><button onClick="trigger(event, 'add')">添加</button><br /><button onClick="trigger(event, 'reduce')">减少</button>`
    );
  }
}
new Button().mount(root);
