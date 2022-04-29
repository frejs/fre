import { h, render, useState, memo } from '../../src'

function App() {
  const [state, setState] = useState(0)
  console.log('all')
  return (
    <div>
      {state}
      <A />
      <B state={state} />
      <C />
      <button onClick={() => setState(state + 1)}>+</button>
    </div>
  )
}

const A = memo(function A() {
  console.log('a')
  return <div>a: </div>
})
const B = memo(function B({ state }: { state: number }) {
  console.log('b')
  return <div>b: {state}</div>
}, (prevProps, nextProps) =>  nextProps.state % 2 === 0)

function C(props) {
  console.log('c')
  const [state, setState] = useState(0)
  return <div><button onClick={() => setState(state + 1)}>c:{state}</button></div>
}


render(<App />, document.body)
