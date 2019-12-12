import { h, render, useState } from '../../src'

function App() {
  const [state, setState] = useState(0)
  return (
    <div>
      {state}
      <B />
      <A />
      <button onClick={() => setState(state + 1)}>+</button>
    </div>
  )
}

function A(props) {
  console.log('a')
  return <C count={[]} />
}
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
