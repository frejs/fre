import { h, render, useState } from '../src'

function App () {
  const [count,setCount] = useState(0)
  return (
    <div style={count > 5 ? { color: 'red' } : { backgroundColor: 'red' }}>
      {count}
      <button onClick={() => setCount(count + 1)}>+</button>
    </div>
  )
}
render(<App/>,document.getElementById('root'))