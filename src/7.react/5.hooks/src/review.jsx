import React, { useState, useRef, useEffect } from "react";

export default () => {
  const [count, setCount] = useState(0);
  const refCount = useRef(0);
  useEffect(() => {
    console.log("count:::", count, "ref:::", refCount);
    return () => {
      console.log("clear count:::", count);
    };
  });
  const click = () => {
    setCount(count + 1);
    refCount.current++;
  };
  return (
    <>
      <div>Hello world</div>
      <button onClick={click}>+</button>
    </>
  );
};
