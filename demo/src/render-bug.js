import { h, render, useState, useLayout, useEffect } from '../../src'

function App() {
  const [count, setCount] = useState(0)
  return (
   <A count={count}/>
  )
}

function A({count}){
    return <div>
    <button onClick={() => setCount(count + 1)}>{count}</button>
  </div>
}

render(<App />, document.body)