import React from "react";
import ReactDOM from "react-dom";

/**
 * NOTE 1. 创建一个context
 */
const ThemeContext = React.createContext({});
class Parent extends React.Component {
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
    const context = this.context;
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
    const context = this.context;
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
    const context = this.context;
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
    const context = this.context;
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

ReactDOM.render(<Parent />, document.getElementById("root"));
