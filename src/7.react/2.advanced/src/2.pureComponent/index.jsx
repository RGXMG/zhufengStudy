import React from "react";
export default class Counter extends React.Component {
  constructor() {
    super();
    this.state = {
      count: 0,
      title: "Counter计算"
    };
    this.input = React.createRef();
  }
  componentDidMount() {
    console.log(this.input);
    this.input.current.addEventListener("keyup", e => {
      if (e.code === "Enter") {
        this.add();
      }
    });
  }

  add = () => {
    this.setState({ count: this.input.current.value });
    this.input.current.value = "";
  };
  render() {
    console.log("Counter render -----", this.state);
    return (
      <div style={{ width: 400, padding: 20 }}>
        <Title title={this.state.title} />
        <Sum value={this.state.count} />
        <input type="text" ref={this.input} />
        <button onClick={this.add}>+</button>
      </div>
    );
  }
}
class Sum extends React.Component {
  constructor() {
    super();
    this.state = {
      sum: 0
    };
  }
  static getDerivedStateFromProps(props, state) {
    return { sum: state.sum + ~~props.value };
  }
  render() {
    console.log("Sum render -----", this.props);
    return <h2>{this.state.sum}</h2>;
  }
}
class Title extends React.Component {
  render() {
    console.log("Title render -----", this.props);
    return <h1>{this.props.title}</h1>;
  }
}
