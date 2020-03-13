import { h, render, useState, memo } from '../../src'

function App() {
  const [state, setState] = useState(0)
  console.log('all')
  return (
    <div>
      {state}
      <A />
      <button onClick={() => setState(state + 1)}>+</button>
    </div>
  )
}

const A = memo(function A(props) {
  console.log('a')
  return 111
})
function B(props) {
  console.log('b')
  const [state, setState] = useState(0)
  return <button onClick={() => setState(state + 1)}>{state}</button>
}

function C() {
  console.log(333)
  return <div>{333}</div>
}

render(<App />, document.body)
