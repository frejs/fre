import { h, render, useState, useEffect } from '../../src'
// import { render, createElement as h } from 'preact'
// import { useState, useEffect } from 'preact/hooks'

function App() {
  return (
    <div>
      <A />
      <B />
    </div>
  )
}

function A(props) {
  console.log('a')
  const [state, setState] = useState(0)
  useEffect(() => {
    setTimeout(() => {
      setState(state+1)
    }, 1000)
  }, [])
  return <C count={0} />
}
function B(props) {
  console.log('b')
  const [state, setState] = useState(0)
  useEffect(() => {
    setTimeout(() => {
      setState(state+1)
    }, 1000)
  }, [])
  return <button onClick={() => setState(state + 1)}>{state}</button>
}

function C() {
  console.log('c')
  return <div>{'c'}</div>
}

render(<App />, document.body)
