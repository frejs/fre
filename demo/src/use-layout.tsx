import {
  render,
  useState,
  useEffect,
  useLayoutEffect,
  h,
  Fragment,
} from '../../src/index'

function App() {
  const [count, setCount] = useState(0)
  return (
    <div>
      <h1>{count}</h1>
      <button onClick={() => setCount(count + 1)}>+</button>
      {count < 5 ? <A count={count} /> : <div>removed</div>}
    </div>
  )
}

function A(props) {
  useLayoutEffect(() => {
    console.log(333)
    return () => {
      console.log(444)
    }
  })
  return <div>{props.count}</div>
}

render(<App />, document.getElementById('app'))
