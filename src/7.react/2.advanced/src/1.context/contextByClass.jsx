import React from "react";

/**
 * NOTE 只是用Provider组件,class组件中使用静态属性来使用，static contextType = context
 */

/**
 * 自定义的createContext
 * @param initialValue
 */
function createContext(initialValue) {
  class Provider extends React.Component {
    static value;
    $$typeof = Symbol.for("react.provider");
    constructor(props) {
      super(props);
      Provider.value = props.value;
      this.state = { value: props.value };
    }
    /**
     * 改变state以及Provider.value，让传递的value改变
     * @param props
     * @param state
     */
    static getDerivedStateFromProps(props, state) {
      console.log("getDerivedStateFromProps：：：", state, props);
      Provider.value = props.value;
      return { value: props.value };
    }
    render() {
      return this.props.children;
    }
  }
  // $$typeof内部用来校验是否为一个context对象
  // Symbol.for => https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Symbol/for
  return { $$typeof: Symbol.for("react.context"), Provider };
}

/**
 * NOTE 1. 创建一个context
 */
// const ThemeContext = React.createContext({});
const ThemeContext = createContext({});
class ContextByClass extends React.Component {
  constructor() {
    super();
    this.state = {
      color: "#ddd"
    };
  }
  setColor = color => {
    this.setState({ color });
  };
  render() {
    const ctx = { color: this.state.color, setColor: this.setColor };
    /**
     * NOTE 2. 使用context的Provider组件，并赋值value
     */
    return (
      <ThemeContext.Provider value={ctx}>
        <div
          style={{
            width: 200,
            height: 200,
            padding: 10
          }}
        >
          <Child1 />
          <Child2 />
        </div>
      </ThemeContext.Provider>
    );
  }
}
class Child1 extends React.Component {
  /**
   * NOTE 3. 在使用的地方使用static contextType 进行接收
   */
  static contextType = ThemeContext;
  render() {
    // 使用react.createContext
    // const context = this.context;
    // 使用自定义故意的context
    const context = Child1.contextType.Provider.value;
    console.log("child1:::", context);
    return (
      <div
        style={{
          width: 150,
          height: 150,
          padding: 10,
          border: "solid 1px red",
          color: `${context.color}`
        }}
      >
        <span style={{ padding: 10 }}>儿子1</span>
        <GandSon1 />
      </div>
    );
  }
}
class Child2 extends React.Component {
  static contextType = ThemeContext;
  render() {
    // 使用react.createContext
    // const context = this.context;
    // 使用自定义故意的context
    const context = Child1.contextType.Provider.value;
    return (
      <div
        style={{
          width: 150,
          height: 150,
          padding: 10,
          border: "solid 1px red",
          color: `${context.color}`
        }}
      >
        <span style={{ padding: 10 }}>儿子2</span>
        <GandSon2 />
      </div>
    );
  }
}
class GandSon1 extends React.Component {
  static contextType = ThemeContext;
  render() {
    // 使用react.createContext
    // const context = this.context;
    // 使用自定义故意的context
    const context = Child1.contextType.Provider.value;
    return (
      <div
        style={{
          width: 100,
          height: 100,
          padding: 10,
          border: "solid 1px red",
          color: `${context.color}`
        }}
      >
        孙子1
        <button onClick={() => context.setColor("red")}>红色</button>
      </div>
    );
  }
}
class GandSon2 extends React.Component {
  static contextType = ThemeContext;
  render() {
    // 使用react.createContext
    // const context = this.context;
    // 使用自定义故意的context
    const context = Child1.contextType.Provider.value;
    console.log(this.context);
    return (
      <div
        style={{
          width: 100,
          height: 100,
          padding: 10,
          border: "solid 1px red",
          color: `${context.color}`
        }}
      >
        孙子2
        <button onClick={() => context.setColor("green")}>绿色</button>
      </div>
    );
  }
}

export default ContextByClass;
