import { h, render, useState } from '../src'

function Counter () {
  const [count, setCount] = useState(0)
  return (
    <ul>
      <li key='a'>1</li>
      <li key='b'>2</li>
      <li key='c'>3</li>
    </ul>
  )
}

render(<Counter />, document.getElementById('root'))
