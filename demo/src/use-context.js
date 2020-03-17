import { h, render, createContext, useContext } from '../../src'

const Context = createContext(null)

function App() {
  return <Context.Provider value={'hello world'}>
    <A/>
  </Context.Provider>
}

function A() {
  const context = useContext(Context)
  return <div>{context}</div>
}

render(<App />, document.body)
