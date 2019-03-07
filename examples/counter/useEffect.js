import { h, render, useState, useEffect } from '../../src'

function Counter() {
  const [count, setCount] = useState(0)
  useEffect(() => {
    document.title = 'count is ' + count
  }, [1])
  return (
    <div>
      <h1>{count}</h1>
      <button onClick={() => setCount(count + 1)}>+</button>
    </div>
  )
}

render(<Counter />, document.getElementById('root'))
