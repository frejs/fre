import { render, useState, h, Fragment } from '../../src/index'


function App() {
  const [count, setCount] = useState(0)
  return (
    <div>
      <h1>{count}</h1>
      <button onClick={() => setCount(count + 1)}>+</button>
      <input type="text" />
    </div>
  )
}

render(<App />, document.getElementById('app'))

// document.querySelector('#focus').focus()
