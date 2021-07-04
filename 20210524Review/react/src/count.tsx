/**
 * Created with JavaScript.
 * User: RGXMG
 * Email: rickgrimes9229@gmail.com/759237309@qq.com
 * Date: 2021/7/3
 * Time: 21:58
 *
 */
import { useState, useEffect } from "react";

export default function Counter() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      console.log("Counter::setInterval", count);
      setCount(count + 1);
    }, 1000);
    return () => {
      clearInterval(id);
      console.log("Counter::clearInterval");
    };
  }, []);

  return <h1>{count}</h1>;
}
