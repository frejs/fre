import { h, render, createContext, useContext, useState } from '../../src'

const Context = createContext(0)

function App() {
  const [state, setState] = useState({ count1: 1, count2: 2 })
  return (
    <Context.Provider value={state}>
      <A />
      <B />
      <button onClick={() => setState({ ...state, count1: state.count1 + 1 })}>
        +1
      </button>
    </Context.Provider>
  )
}

function A() {
  const count1 = useContext(Context, v => v.count1)
  return <div>{count1}</div>
}

function B() {
  const count2 = useContext(Context, v => v.count2)
  return <div>{count2}</div>
}

render(<App />, document.body)
