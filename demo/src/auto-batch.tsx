import { render, useState, h } from "../../src/index"
// import { createRoot } from 'react-dom'
// import {useState,createElement as h } from 'react'

function App() {
  const [count, setCount] = useState(0)
  console.log(111)
  const update = () => {
    for (let i = 0; i <= 10; i++) {
      setCount(i)
    }
  }
  return (
    <div>
      <h1>{count}</h1>
      <button onClick={update}>+</button>
    </div>
  )
}

// const root = createRoot(document.getElementById("app"))

// root.render(<App />)

render(<App />, document.body)

