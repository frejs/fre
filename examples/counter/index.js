import { render, useState, h } from "../../packages/core"

function Sex() {
  const [sex, setSex] = useState("boy")
  return (
    <div class="sex">
      <h1>{sex}</h1>
      <button onClick={() => setSex(sex === "boy" ? "girl" : "boy")}>x</button>
      <Counter />
    </div>
  )
}

function Counter() {
  const [count, setCount] = useState(0)
  return (
    <div class="counter">
      <h1>{count}</h1>
      <button onClick={() => setCount(count + 1)}>+</button>
    </div>
  )
}

render(<Sex />, document.getElementById('app'))
