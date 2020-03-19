import { h, render, useState, useLayout, useEffect } from '../../src'

function App() {
  // console.log(888)
  const [count, setCount] = useState(0)
  return (
    <div>
      {count < 5 && <A count={count < 1 ? count : 2} />}
      <h1>{count}</h1>
      <button onClick={() => setCount(count + 1)}>+</button>
    </div>
  )
}

function A(props) {
  console.log('a')
  // useLayout(() => {
  //   console.log(111)
  //   return () => {
  //     console.log(222)
  //   }
  // }, [props.count])
  useEffect(() => {
    console.log(333)
    return () => {
      console.log(444)
    }
  })
  return 'hello'
}

render(<App />, document.body)
