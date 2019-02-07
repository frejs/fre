import { h,render } from "../../packages/core"

function Counter() {
  // const [count, setCount] = useState(0)
  return (
    <div class="counter">
      <h1>111</h1>
      <button onClick={() => setCount(count + 1)}>+</button>
    </div>
  )
}

render(<Counter />, document.getElementById('app'))
