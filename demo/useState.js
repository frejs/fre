import { h, render, useState } from '../src'

function Counter () {
  const [flag, setFlag] = useState(true)
  return <div>hello world</div>
}

render(<Counter />, document.getElementById('root'))
