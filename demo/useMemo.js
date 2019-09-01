import { h, render, useState, useMemo } from '../src'

function Counter () {
  const [count, setCount] = useState(0)
  const val = useMemo(() => {
    return count
  }, [])
  return (
    <div>
      <h1>
        {count} - {val}
      </h1>
      <button onClick={() => setCount(count + 1)}>+</button>
    </div>
  )
}

render(<Counter />, document.getElementById('root'))
