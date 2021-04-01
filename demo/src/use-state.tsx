import { h, render, useEffect, useState, Fragment } from "../../src/index"

function App() {
  const [count, setCount] = useState(0)
  const [two, setTwo] = useState(0)
  useEffect(()=>{
    setTimeout(()=>{
      setCount(count+1)
    },3000)
  },[])
  return (
    <>
      <Nil count={count}/>
      <button onClick={() => setCount((c) => c + 1)}>{count}</button>
      <button onClick={() => setTwo(two + 1)} style="color:#2ef">
        {two}
      </button>
    </>
  )
}

function Nil(props) {
  console.log(props.count)
  const [count, setCount] = useState(0)
  return <button onClick={() => setCount((c) => c + 1)}>{count}</button>
}

render(<App />, document.body)
