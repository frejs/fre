import { h, render, useState } from '../src'

function Counter () {
  const [isShow, set] = useState(false)
  return (
    <div>
      {isShow ? <A /> : <B />}
      <button onClick={() => set(!isShow)}>change</button>
    </div>
  )
}

function A () {
  return <h1>A</h1>
}
function B () {
  return <h1>B</h1>
}
render(<Counter />, document.getElementById('root'))
