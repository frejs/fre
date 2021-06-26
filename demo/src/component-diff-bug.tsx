import {render, useState, useEffect ,h,useRef} from '../../src'
// import { render } from 'react-dom'
// import { useEffect, useState, useRef, createElement as h } from 'react'


const style = {width: 300, height: 300};

function A() {
  const canvas_ref = useRef(null);
  useEffect(() => {
    const canvas = canvas_ref.current;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = 'green';
    ctx.fillRect(10, 10, 150, 100);
    console.log(111)
  }, []);
  return <canvas style={style} ref={canvas_ref} />
}

function B() {
  const canvas_ref = useRef(null);
  useEffect(() => {
    const canvas = canvas_ref.current;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = 'blue';
    ctx.fillRect(50, 50, 250, 200);
  }, []);
  return <canvas style={style} ref={canvas_ref} />
}


function App() {
  const [isA, setIsA] = useState(true);
  return (
    <div className="App">
      <button onClick={() => setIsA(v => !v)}>isA: {isA ? 'true' : 'false'}</button>
      {isA ? <A /> : <B />}
    </div>
  );
}

render(<App/>,document.body)