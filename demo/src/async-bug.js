// import { h, render, useState, useEffect } from '../../src'
import { h, render } from 'preact'
import { useState, useEffect } from 'preact/hooks'

let timer = null

function App() {
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (count === 0) {
      setCount(Math.random())
    }
  }, [count])

  timer = setTimeout(() => {
    console.log(timer)
    // clearTimeout(timer)
    setCount(0)
  }, 1000)

  return <div>{count}</div>
}

render(<App />, document.body)
