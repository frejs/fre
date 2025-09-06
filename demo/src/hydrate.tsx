import { render, useState, h, Fragment } from '../../src/index'


function App() {
  const [count, setCount] = useState(0)
  return (<>
  <h1>Hello Fre + Hono</h1><h1>Hello Fre + Hono</h1>
  </>
    
    
  )
}

// setTimeout(() => {
  render(<App />, document.getElementById('app'))
// }, 2000);

// document.querySelector('#focus').focus()
