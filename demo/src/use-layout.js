import { h, render, useState, useLayout, useEffect } from '../../src'

function App() {
  const [count, setCount] = useState(0)
  return (
    <div>
      {count < 3 && <A />}
      <h1>{count}</h1>
      <button onClick={() => setCount(count + 1)}>+</button>
    </div>
  )
}

function A(props) {
  useLayout(() => {
    console.log(111)
    return () => {
      console.log(222)
    }
  })
  useEffect(() => {
    console.log(333)
    return () => {
      console.log(444)
    }
  })
  return 'hello'
}

render(<App />, document.body)
