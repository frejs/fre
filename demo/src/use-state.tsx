import { h, render, useEffect, useState } from "../../src/index"

function App() {
  const [count, setCount] = useState(0)
  const [two, setTwo] = useState(0)
  console.log(count, two)
  return (
    <div>
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
    </div>
  )
}

render(<App />, document.body)
