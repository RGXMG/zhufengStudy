import React, { useEffect, useState } from "react";
import logo from "./logo.svg";
import "./App.css";

interface TP {
  defaultCount?: number;
}
class Count extends React.Component<TP, { count: number; initCount: number }> {
  constructor(props: TP) {
    super(props);
    this.state = {
      count: 0,
      initCount: 0,
    };
  }

  static getDerivedStateFromProps(nextProps: any, prevState: any) {
    console.log("getDerivedStateFromProps:::", nextProps, prevState);
    if (prevState.initCount !== nextProps.defaultCount) {
      return {
        initCount: nextProps.defaultCount,
      };
    }
    return null;
  }

  componentDidMount() {
    console.log(111);
  }

  componentDidUpdate(
    prevProps: Readonly<TP>,
    prevState: Readonly<{ count: number; initCount: number }>,
    snapshot?: any
  ) {
    console.log("componentDidUpdate:::");
  }

  add = () => {
    this.setState({ count: this.state.count + 1 });
    console.log(this.state.count);
    this.setState({ count: this.state.count + 1 });
    console.log(this.state.count);
    setTimeout(() => {
      this.setState({ count: this.state.count + 1 });
      console.log(this.state.count);
      this.setState({ count: this.state.count + 1 });
      console.log(this.state.count);
    });
  };

  render() {
    return (
      <div>
        <p>初识count: {this.state.initCount}</p>
        <p>组件内count: {this.state.count}</p>
        <button onClick={this.add}>点击 + 1</button>
      </div>
    );
  }
}

function App() {
  const [count, setCount] = useState<number>(7);
  useEffect(() => {
    console.log("we423432");
  }, []);
  return (
    <div className="App">
      <Count defaultCount={5} />
      <header className="App-header">
        <button onClick={() => setCount(count - 1)}>点击 - 1</button>
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
