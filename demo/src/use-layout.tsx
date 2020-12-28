import { h, render, useState, useEffect, useLayoutEffect } from '../../src'

function App() {
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
      useLayoutEffect(() => {
        console.log(333)
        return () => {
          console.log(444)
        }
      })
    return <div>{props.count}</div>
  }
  
  render(<App />, document.body)