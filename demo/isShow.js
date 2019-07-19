import { h, render, useState } from '../src'

function Counter () {
  const [isShow, set] = useState(false)
  return (
    <div>
      {isShow ? <h1>222</h1>: <h1>111</h1>}
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
