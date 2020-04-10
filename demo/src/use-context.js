import {
  h,
  render,
  useReducer,
  useLayout,
  useRef,
  useState,
  memo
} from '../../src'

export const createContext = defaultValue => {
  const context = {
    value: defaultValue,
    subs: new Set(),
    Provider: function Provider({ value, children }) {
      useLayout(() => {
        context.subs.forEach(fn => fn(value))
        context.value = value
      })
      return children
    }
  }
  return context
}

export const useContext = (context, selector) => {
  const subs = context.subs
  const [, forceUpdate] = useReducer(c => c + 1, 0)
  const selected = selector ? selector(context.value) : context.value
  const ref = useRef(null)
  useLayout(() => {
    ref.current = selected
  })
  useLayout(() => {
    const fn = nextValue => {
      if (ref.current === selector(nextValue)) return
      forceUpdate()
    }
    subs.add(fn)
    return () => subs.delete(fn)
  }, [subs])
  return selected
}

const Context = createContext({
  count1: 0,
  count2: 0
})

function App() {
  const [count, setCount] = useState(Context.value)
  return (
    <Context.Provider value={count}>
      <A />
      <B />
      <C />
      <button onClick={() => setCount({ ...count, count1: count.count1 + 1 })}>
        +
      </button>
    </Context.Provider>
  )
}

function A() {
  const context = useContext(Context, ctx => ctx.count1)
  console.log('A')
  return <div>{context}</div>
}

function B() {
  const context = useContext(Context, ctx => ctx.count2)
  console.log('B')
  return <div>{context}</div>
}

const C = memo(function C() {
  const context = useContext(Context, ctx => ctx.count2)
  console.log('C')
  return <div>{context}</div>
})

render(<App />, document.getElementById('root'))
