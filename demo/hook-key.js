import { h, render, useState } from '../src'

function App () {
  const [arr, setArr] = useState(1)
  return (
    <div>
      {new Array(arr).fill().map((_, i) => (
        <li>{i}</li>
      ))}
      <button onClick={() => setArr(arr + 1)}>+</button>
    </div>
  )
}

render(<App />, document.getElementById('root'))
