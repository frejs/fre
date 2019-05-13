import { h, render, useState, useEffect } from '../../src'

function Counter () {
  const [show, set] = useState(true)
  return (
    <div>
      {show ? <A/> : null}
      <button onClick={() => set(!show)}>+</button>
    </div>
  )
}

function A () {
  return <h1>hello</h1>
}

render(<Counter />, document.getElementById('root'))
