import { h, render, useReducer, useLayout, useRef } from '../../src'

export const createContext = defaultValue => {
  let context = {}
  context.value = defaultValue
  context.subs = new Set()
  context.Provider = function Provider({ value, children }) {
    useLayout(() => {
      context.subs.forEach(fn => fn(value))
      context.value = value
    })
    return children
  }
  return context
}

export const useContext = (context, selector) => {
  const subs = context.subs
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
    subs.add(fn)
    return () => {
      subs.delete(fn)
    }
  }, [subs])
  return selected
}

const Context = createContext(0)

function App() {
  const [count, setCount] = useReducer(c => c + 1, 0)
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
