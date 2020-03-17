import { h, render, createContext, useContext } from '../../src'

const Context = createContext(0)

function App() {
  return <Context.Provider value={0}>
    <A/>
  </Context.Provider>
}

function A() {
  const context = useContext(Context)
  return <div>{context}</div>
}

render(<App />, document.body)
