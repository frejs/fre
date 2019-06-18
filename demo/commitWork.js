import { h, render, options, useState } from '../src'

function Counter () {
  const [count, setCount] = useState(0)
  console.log(count)
  return (
    <div>
      <h1>{count}</h1>
      <button onClick={() => setCount(count + 1)}>+</button>
    </div>
  )
}
options.platform = 'miniapp'
options.commitWork = fiber => {
  console.log(fiber)
}

render(<Counter />)
