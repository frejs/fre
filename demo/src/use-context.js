import { h, render, createContext, useContext, useState } from '../../src'


const context = createContext(null)

const Counter1 = () => {
  const count1 = useContext(context, v => v[0].count1)
  const setState = useContext(context, v => v[1])
  const increment = () =>
    setState(s => ({
      ...s,
      count1: s.count1 + 1
    }))
  return (
    <div>
      <span>Count1: {count1}</span>
      <button type="button" onClick={increment}>
        +1
      </button>
      {Math.random()}
    </div>
  )
}

const Counter2 = () => {
  const count2 = useContext(context, v => v[0].count2)
  const setState = useContext(context, v => v[1])
  const increment = () =>
    setState(s => ({
      ...s,
      count2: s.count2 + 1
    }))
  return (
    <div>
      <span>Count2: {count2}</span>
      <button type="button" onClick={increment}>
        +1
      </button>
      {Math.random()}
    </div>
  )
}

const StateProvider = ({ children }) => {
  const [state, setState] = useState({ count1: 0, count2: 0 })
  return (
    <context.Provider value={[state, setState]}>{children}</context.Provider>
  )
}

const App = () => (
  <StateProvider>
    <Counter1 />
    <Counter2 />
  </StateProvider>
)

render(<App />, document.body)
