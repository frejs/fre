import {
  useReducer,
  useRef,
  useEffect,
  render,
  h,
  useState,
} from "../../src/index"

export const createContext = (defaultValue) => {
  const context = {
    value: defaultValue,
    subs: new Set(),
    Provider: ({ value, children = "" }) => {
      useEffect(() => {
        context.subs.forEach((fn: any) => fn(value))
        context.value = value
      })
      return children
    },
  }
  return context
}

export const useContext = (context, selector?) => {
  const subs = context.subs
  const [, forceUpdate] = useReducer((c) => c + 1, 0)
  const selected = selector ? selector(context.value) : context.value
  const ref = useRef(null)
  useEffect(() => {
    ref.current = selected
  })
  useEffect(() => {
    const fn = (nextValue: unknown) => {
      if (selector && ref.current === selector(nextValue)) return
      forceUpdate(nextValue)
    }
    subs.add(fn)
    return () => subs.delete(fn)
  }, [subs])
  return selected
}

const Theme = createContext(0)

function NestedTheme() {
  const theme = useContext(Theme)
  return <p>Nested Active theme: {theme}</p>
}

function DisplayTheme(props) {
  const theme = useContext(Theme)
  console.log(theme)
  return (
    <div>
      {props && props.children}
      <p>Display Active theme: {theme}</p>
    </div>
  )
}

const App = () => {
  const [count, setCount] = useState(Theme.value)
  return (
    <div>
      <h1>{count}</h1>
      <button onClick={() => setCount(count + 1)}>+</button>
      <Theme.Provider value={count}>
        <DisplayTheme>
          <NestedTheme />
        </DisplayTheme>
        <DisplayTheme />
      </Theme.Provider>
    </div>
  )
}

render(<App />, document.body)
