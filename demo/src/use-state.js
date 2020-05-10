import { h, render, useState, useLayout, useEffect } from '../../dist/fre.esm'

function App() {
  const [count, setCount] = useState(0)
  return (
    <div>
      <button onClick={() => setCount(count + 1)}>{count}</button>
    </div>
  )
}

render(<App />, document.body)