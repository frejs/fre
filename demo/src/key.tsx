import { h, render, useEffect, useState } from '../../src/index'

function App() {
  const [key, setKey] = useState(['a','b','c'])
  return (
    <div>
      <button onClick={() => setKey(['b','a','c'])}>x</button>
      {
          key.map(i=>(<li key={i}>{i}</li>))
      }
    </div>
  )
}

render(<App />, document.getElementById('root'))