import { h, render, useEffect, useState } from '../../src/index'

function App() {
  const [key, setKey] = useState(['a', 'b', 'c', 'd'])
  return [
    <button onClick={() => setKey(['b', 'c', 'a'])}></button>,
    <ul>
      {key.map((i) => (
        <li key={i}>{i}</li>
      ))}
    </ul>,
  ]
}

render(<App />, document.getElementById('root'))
