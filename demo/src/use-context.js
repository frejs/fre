import { h, render, useReducer, useLayout, useRef, useState } from '../../src'

const CONTEXT_LISTENERS = Symbol('CONTEXT_LISTENERS')

export const createContext = defaultValue => {
  let context = {}
  context.value = defaultValue
  context[CONTEXT_LISTENERS] = new Set()
  context.Provider = function Provider({ value, children }) {
    useLayout(() => {
      context[CONTEXT_LISTENERS].forEach(fn => fn(value))
      context.value = value
    })
    return children
  }
  return context
}

export const useContext = (context, selector) => {
  const listeners = context[CONTEXT_LISTENERS]
  const [, forceUpdate] = useReducer(c => c + 1, 0)
  const selected = selector(context.value)
  const ref = useRef(null)
  useLayout(() => {
    ref.current = {
      f: selector,
      v: context.value,
      s: selected
    }
  })
  useLayout(() => {
    const fn = nextValue => {
      if (ref.current.v === nextValue) return
      forceUpdate()
    }
    listeners.add(fn)
    return () => {
      listeners.delete(fn)
    }
  }, [listeners])
  return selected
}

const Context = createContext(0)

function App() {
  const [count, setCount] = useState(0)
  return (
    <Context.Provider value={count}>
      <A />
      <B />
      <button onClick={() => setCount(count + 1)}>+</button>
    </Context.Provider>
  )
}

function A() {
  const context = useContext(Context, ctx => ctx)
  return <div>{context}</div>
}

function B() {
    const context = useContext(Context, ctx => ctx)
    return <div>{context}</div>
  }
  

render(<App />, document.getElementById('root'))
