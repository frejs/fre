import { h, render, useState } from '../src'

function Counter () {
  const [show, set] = useState(true)
  return (
    <div>
      <button onClick={() => set(!show)}>change</button>
      {show ? <A/> : null} 
      {/* 注意，这种组件的增删操作，要放到最后来做 */}
    </div>
  )
}

function A () {
  return <h1>hello</h1>
}

render(<Counter />, document.getElementById('root'))
