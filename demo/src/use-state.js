import { h, render, useState } from '../../src'

function Counter() {
  const [up, setUp] = useState(0)
  const [down, setDown] = useState(0)
  return (
    <div class="counter">
      <h1>{up}</h1>
      <button onClick={() => setUp(up + 1)}>+</button>
      <h1>{down}</h1>
      <button onClick={() => setDown(down - 1)}>-</button>
      <Count count={up} />
    </div>
  )
}

function Count(props) {
  const [add, setAdd] = useState(0)
  const [cut, setCut] = useState(0)
  return (
    <div class="counter">
      <h2>{props.count}</h2>
      <h1>{add}</h1>
      <button onClick={() => setAdd(add + 1)}>+</button>
      <h1>{cut}</h1>
      <button onClick={() => setCut(cut - 1)}>-</button>
    </div>
  )
}

render(<Counter />, document.body)
