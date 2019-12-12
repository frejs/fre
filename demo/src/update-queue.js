import { h, render, useState, useEffect } from '../../src'

function App() {
  const [state, setState] = useState(0)
  return (
    <div>
      <B />
      <A />
    </div>
  )
}

function A(props) {
  console.log('a')
  const [state, setState] = useState(0)
  useEffect(() => {
    setTimeout(() => {
      setState()
    }, 1000)
  }, [])
  return <C count={0} />
}
function B(props) {
  console.log('b')
  const [state, setState] = useState(0)
  useEffect(() => {
    setTimeout(() => {
      setState()
    }, 1000)
  }, [])
  return <button onClick={() => setState(state + 1)}>{state}</button>
}

function C() {
  console.log(333)
  return <div>{333}</div>
}

render(<App />, document.body)
