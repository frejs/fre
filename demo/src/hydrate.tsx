import { render, useState, h, Fragment, hydrate } from '../../src/index'

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

hydrate(<App />, document.getElementById('app'))

document.querySelector('#focus').focus()
