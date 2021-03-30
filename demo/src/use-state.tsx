import { h, render, useEffect, useState,Fragment } from "../../src/index"

function App() {
  const [count, setCount] = useState(0)
  const [two, setTwo] = useState(0)
  return (
    <>
      <Nil/>
      <button
        onClick={() =>
          setCount((c) => {
            return c + 1
          })
        }
      >
        {count}
      </button>
      <button onClick={() => setTwo(two + 1)} style="color:#2ef">{two}</button>
    </>
  )
}

function Nil(){
  return <></>
}

render(<App />, document.body)
