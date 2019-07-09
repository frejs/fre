import { createContext, useContext, render, h } from '../src'

const ctx = createContext(0)

function App () {
  const [count, setCount] = useContext(ctx)
  return (
    <div>
      <h1>{count}</h1>
      <button onClick={() => setCount(count + 1)}>+</button>
      <Other />
    </div>
  )
}

function Other () {
  const [count] = useContext(ctx)
  return (
    <div>
      <h1>{count}</h1>
      <button onClick={() => setCount(count + 1)}>+</button>
    </div>
  )
}

function Thrid () {
  const [count, setCount] = useContext(ctx)
  return (
    <div>
      <h1>{count}</h1>
      <button onClick={() => setCount(count + 1)}>+</button>
    </div>
  )
}

render(<App />, document.getElementById('root'))