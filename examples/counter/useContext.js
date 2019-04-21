import { createContext, useContext, render, h } from '../../src'

createContext('counter', 0)

function App () {
  const [count, setCount] = useContext('counter')

  return (
    <div>
      <h1>{count}</h1>
      <button onClick={() => setCount(count + 1)}>+</button>
      <Other />
    </div>
  )
}

function Other () {
  const [count, setCount] = useContext('counter')
  return (
    <div>
      <h1>{count}</h1>
      <button onClick={() => setCount(count + 1)}>+</button>
    </div>
  )
}

render(<App />, document.getElementById('root'))
