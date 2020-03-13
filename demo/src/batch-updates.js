import { h, render, useState } from '../../src'

let i = 0
function App() {
  const [count, setCount] = useState(0)
  const up = () => {
    while (i < 10) {
      i++
      setCount(count + 1)
    }
  }
  return (
    <div>
      {count}
      <button onClick={up}>+</button>
    </div>
  )
}

render(<App />, document.body)
