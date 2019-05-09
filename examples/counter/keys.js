import { h, render, useState, useEffect } from '../../src'

function Counter () {
  const [arr, setArr] = useState(['A'])
  return (
    <div>
      <ul>
        {arr.map(item => (
          <li key={item}>{item}</li>
        ))}
      </ul>
      <button onClick={() => setArr(['B', 'A'])}>+</button>
    </div>
  )
}

render(<Counter />, document.getElementById('root'))
