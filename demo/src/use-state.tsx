import { h, render, useEffect, useState } from '../../src/index'

function App() {
  const [count, setCount] = useState(0)
  // const [two, setTwo] = useState(0)
  return (
    <div>
      <button onClick={() => setCount(count + 1)}>{count}</button>
    </div>
  )
}

render(<App />, document.body)
