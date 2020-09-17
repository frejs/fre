import { h, render, useEffect, useState } from '../../src/index'

function App() {
  const [count, setCount] = useState(0)
  const [two, setTwo] = useState(0)
  useEffect(() => {
    setTimeout(() => {
      setTwo(two + 1)
    }, 1000)
  })
  console.log(count,two)
  return (
    <div>
      <button onClick={() => setCount(count + 1, 6)}>{two}</button>
    </div>
  )
}

render(<App />, document.body)
