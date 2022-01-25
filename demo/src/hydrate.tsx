import { render, useState, h, Fragment } from '../../src/index'

const nextTick = fn => Promise.resolve().then(fn)

function App() {
  const [count, setCount] = useState(0)
  return (
    <>
      <h1>{count}</h1>
      <button onClick={() => setCount(count + 1)}>+</button>
      <input type="text" />
    </>
  )
}

render(<App />, document.getElementById('app'))

document.querySelector('#focus').focus()
