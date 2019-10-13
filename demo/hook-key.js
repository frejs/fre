import { h, render, useState, useEffect } from '../src'
// import { render } from "react-dom"
// import { createElement as h, useState, useEffect,useRef } from "react"

function Counter ({ id, remove }) {
  const [count, setCount] = useState(0)

  console.log(id)

  useEffect(() => {
    document.title = `You clicked ${count} times`

    return () => {
      document.title = `Counter removed`
    }
  })

  return (
    <div>
      Counter {id} is {count}
      <button onClick={() => setCount(count + 1)}>➕</button>
      <button onClick={() => setCount(count - 1)}>➖</button>
      <button onClick={remove}>❌</button>
    </div>
  )
}

let nextId = 3

function App () {
  const [counters, setCounters] = useState([1, 2, 3])

  return (
    <div>
      {counters.map(id => (
        <Counter
          key={id}
          id={id}
          remove={() => setCounters(counters.filter(c => c !== id))}
        />
      ))}
      <hr />
      <button onClick={() => setCounters(counters.concat(++nextId))}>
        Add new
      </button>
      <button
        onClick={() => setCounters(counters.slice(0, counters.length - 1))}
        disabled={counters.length === 1}
      >
        Remove last
      </button>
      <button
        onClick={() => setCounters(counters.slice().reverse())}
        disabled={counters.length === 1}
      >
        Reverse
      </button>
    </div>
  )
}

render(<App />, document.body)
