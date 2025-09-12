import {
  render,
  h,
  useState,
  createContext,
  useContext
} from "../../src/index"

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
  const [count, setCount] = useState(0)
  return (
    <div>
      <h1>{count}</h1>
      <button onClick={() => setCount(count + 1)}>+</button>
      <Theme value={count}>
        <DisplayTheme>
          <NestedTheme />
        </DisplayTheme>
        <DisplayTheme />
      </Theme>
    </div>
  )
}

render(<App />, document.body)
