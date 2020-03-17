import { h, render, useState, useEffect } from '../../src'

function App() {
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (count === 0) {
      const val = 10 + Math.random() * 200
      setCount(val)
    }
  }, [count])

  setTimeout(() => {
    setCount(0)
  }, 1000)

  return <div>{count}</div>
}

render(<App />, document.body)
