import React from "react";

/**
 * NOTE 使用Consumer组件,function组件中renderProps来使用
 *  Consumer也可以在class组件中使用，因为都只是使用了renderProps
 */

// const ThemeContext = React.createContext(null);
const ThemeContext = createContext(null);

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
  class Consumer extends React.Component {
    render() {
      return this.props.children(Provider.value);
    }
  }
  // $$typeof内部用来校验是否为一个context对象
  // Symbol.for => https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Symbol/for
  return { $$typeof: Symbol.for("react.context"), Consumer, Provider };
}

class ContextByFunction extends React.Component {
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
export default ContextByFunction;
function Child1() {
  return (
    <ThemeContext.Consumer>
      {context => (
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
      )}
    </ThemeContext.Consumer>
  );
}
function Child2() {
  return (
    <ThemeContext.Consumer>
      {context => (
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
      )}
    </ThemeContext.Consumer>
  );
}
function GandSon1() {
  return (
    <ThemeContext.Consumer>
      {context => (
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
      )}
    </ThemeContext.Consumer>
  );
}
function GandSon2() {
  return (
    <ThemeContext.Consumer>
      {context => (
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
      )}
    </ThemeContext.Consumer>
  );
}
