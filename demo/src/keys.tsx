import { h, render, useEffect, useState } from '../../src/index'

function App() {
  const [key, setKey] = useState(['a', 'b', 'c'])
  return [
    <button onClick={() => setKey(['b', 'a', 'c'])}></button>,
    <ul>
      {key.map((i) => (
        <li key={i}>{i}</li>
      ))}
    </ul>,
  ]
}

render(<App />, document.getElementById('root'))
