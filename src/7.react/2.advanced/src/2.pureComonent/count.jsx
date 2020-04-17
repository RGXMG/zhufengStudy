import React from "react";
import PureComponent from "./PureComponent";

/**
 * NOTE 1. 使用class组件可以使用PureComponent进行浅比较state/props/context
 *  2. 使用函数式组件时可以使用React.memo进行浅比较props
 */

class Count extends React.Component {
  constructor() {
    super();
    this.state = { count: 0, title: "累加器" };
    this.refInput = React.createRef();
  }
  componentDidUpdate(prevProps, prevState, snapshot) {
    console.log("Count：：：组件更新完毕");
  }
  onClick = () => {
    this.setState({ count: this.refInput.current.value });
  };
  render() {
    return (
      <div>
        <Title title={this.state.title} />
        <TitleOfFunc title={this.state.title} />
        <CountVisible count={this.state.count} />
        <input ref={this.refInput} style={{ width: 200 }} type="text" />
        <button onClick={this.onClick}>+</button>
      </div>
    );
  }
}

// NOTE 1. class组件
class Title extends PureComponent {
  componentDidUpdate(prevProps, prevState, snapshot) {
    console.log("Title：：：组件更新完毕");
  }
  render() {
    return <h1>{this.props.title}</h1>;
  }
}
class CountVisible extends PureComponent {
  constructor() {
    super();
    this.state = { count: 0 };
  }
  static getDerivedStateFromProps(props, state) {
    return { count: ~~props.count + state.count };
  }
  componentDidUpdate(prevProps, prevState, snapshot) {
    console.log("CountVisible：：：组件更新完毕");
  }

  render() {
    return <h2>累计：{this.state.count}</h2>;
  }
}

// NOTE 2. function 组件
function TitleOfFunc(props) {
  console.log("TitleOfFunc：：：组件更新完毕");
  return <h1>{props.title}</h1>;
}
// NOTE 使用memo,memo会浅比较nextProps与props，还可以传入比较函数实现自定义比较，返回true代表相等 =》 不更新，返回false代表不相等 =》更新
TitleOfFunc = memo(TitleOfFunc);
// NOTE 自实现一个memo
function memo(FuncComponent) {
  return class proxy extends React.PureComponent {
    render() {
      return <FuncComponent {...this.props} />;
    }
  };
}
export default Count;
