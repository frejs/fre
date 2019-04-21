import { createContext, useContext, render, h } from '../../src'

createContext('counter', 0)

function Counter () {
  const [count, setCount] = useContext('counter')

  return (
    <div>
      <h1>{count}</h1>
      <button onClick={() => setCount(count + 1)}>+</button>
    </div>
  )
}

render(<Counter />, document.getElementById('root'))
