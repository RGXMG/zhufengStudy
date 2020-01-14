import React,{ useState, useEffect } from 'react';
import ReactDom from 'react-dom';

const RenderText = () => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    console.log('Effect:::', count);
  }, [count]);
  return <div>
    <p>Count:::{count}</p>
    <input type="button" onClick={() => setCount(count + 1)} value="+"/>
    <input type="button" onClick={() => setCount(count - 1)} value="-"/>
  </div>
};
ReactDom.render(<RenderText />, document.getElementById('root'));
