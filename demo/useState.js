import { h, render, useState } from "../src"

function Counter() {
  const [count, setCount] = useState(0)
  return (
    <div>
      <h1>{count}</h1>
      <button onClick={() => setCount(count => count + 1)}>+</button>
    </div>
  )
}

render(<Counter />, document.getElementById("root"))