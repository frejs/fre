import { h, render, useEffect, useState } from "../../src/index";

function App() {
  const [count, setCount] = useState(0);
  // console.log(count,two)


  return (
    <div>
      <Demo title={"props"} />
      <button onClick={() => setCount(count + 1)}>{count}</button>
      {
        new Array(10000).fill(0).map(item => {
          return (
            <div>hello, world</div>
          )
        })
      }
      <span>hello world</span>
      <p>你好,fre</p>
    </div>
  );
}

function Demo(props) {
  const [value, setValue] = useState("red");

  useEffect(() => {
    setTimeout(() => {
      setValue('hello world')
    }, 1000)
  }, [])
  return (
    <div
      style={{
        color: value,
      }}
    >
      {props.title}
      <input onInput={(e) => {
        setValue(e.target.value)
      }} value={value} />
    </div>
  );
}

render(<App />, document.body);