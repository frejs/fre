import { h, render, useState, useMemo, useEffect } from '../../src'

function Counter() {
  const [count, setCount] = useState(0)
  const one = useMemo(() => 1, [])

  console.log(one)
  useEffect(() => {
    console.log(111)
  })
  return (
    <div>
      <h1>
        {count}-{one}
      </h1>
      <button onClick={() => setCount(count + 1)}>+</button>
    </div>
  )
}

render(<Counter />, document.getElementById('root'))
