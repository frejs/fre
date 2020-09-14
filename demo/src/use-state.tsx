import { h, render, useEffect, useState } from '../../src/index'

function App() {
  const [count, setCount] = useState(0)
  useEffect(()=>{
    console.log(123)
  })
  return (
    <div>
      <button onClick={() => setCount(count + 1)}>{count}</button>
    </div>
  )
}

render(<App />, document.body)