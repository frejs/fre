import { render, useState, h } from "../../packages/core"

function App() {
  return (
    <div>
      <Counter />
    </div>
  )
}

function Counter() {
  const [count, setCount] = useState(0)
  return (
    <div>
      <h1>{count}</h1>
      <button onClick={() => setCount(count + 1)}>+</button>
    </div>
  )
}

render(<App />, document.body)
