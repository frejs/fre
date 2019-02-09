import { h,render,useState } from "../../src"

function Counter() {
  const [count, setCount] = useState(0)
  return (
    <div class="counter">
      <h1>{count}</h1>
      <button onClick={() => setCount(count + 1)}>+</button>
      <Sex />
    </div>
  )
}

function Sex(){
  const [sex, setSex] = useState('boy')
  return (
    <div class="counter">
      <h1>{sex}</h1>
    </div>
  )
}

render(<Counter />, document.getElementById('app'))
