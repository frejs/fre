import { h, render, useState, useEffect } from '../../src'

function Counter () {
  const [arr, setArr] = useState(['A', 'B','C','D'])
  return (
    <div>
      {arr.map(item => (
        <li key={item}>{item}</li>
      ))}
      <button onClick={() => setArr(['B','A','D','C'])}>+</button>
    </div>
  )
}

render(<Counter />, document.getElementById('root'))
