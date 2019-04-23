import { h, render, useState, useEffect } from '../../src'

function Counter () {
  const [arr, setArr] = useState(['A', 'B', 'C'])
  // useEffect(() => {
  //   document.title = count
  // })
  return (
    <div>
      {arr.map(item => (
        <li key={item}>{item}</li>
      ))}
      <button onClick={() => setArr(['B', 'C', 'D'])}>+</button>
    </div>
  )
}

render(<Counter />, document.getElementById('root'))
