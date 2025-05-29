import { render, useState, h, Fragment } from '../../src/index'


function App() {
  const [count, setCount] = useState(0)
  return (
    <h1>Hello Fre + Hono</h1>
  )
}

render(<App />, document.getElementById('app'))

// document.querySelector('#focus').focus()
