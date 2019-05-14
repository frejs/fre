import { h, render, useState } from '../src'

function Counter () {
  const [show, set] = useState(false)
  return (
    <div>
      {show ? <A /> : null}
      <button onClick={() => set(!show)}>change</button>
    </div>
  )
}

function A () {
  return <h1>A</h1>
}
render(<Counter />, document.getElementById('root'))
