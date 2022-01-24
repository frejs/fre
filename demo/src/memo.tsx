import { h, render, useState, memo } from '../../src'

function App() {
  const [state, setState] = useState(0)
  console.log('all')
  return (
    <div>
      {state}
      <A />
      <B />
      <button onClick={() => setState(state + 1)}>+</button>
    </div>
  )
}

const A = memo(function A(props) {
  console.log('a')
  return <div>222</div>
})
function B(props) {
  console.log('b')
  const [state, setState] = useState(0)
  return <button onClick={() => setState(state + 1)}>{state}</button>
}

render(<App />, document.body)
