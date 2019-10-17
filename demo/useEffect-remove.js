import { h, render, useState, useEffect } from "../src"

//import { createElement as h, render, useState, useEffect } from "preact/compat"

// import { render } from "react-dom"
// import { createElement as h, useState, useEffect } from "react"

let effectNum = 0

function Counter({ id, remove }) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    const currentEffectNum = effectNum++

    console.log(`  [${currentEffectNum}] effect: Counter #${id} is ${count}`)

    return () => {
      console.log(`  [${currentEffectNum}] clean-up: Counter #${id}`)
    }
  })

  const increment = () => {
    console.log(`Increment Counter ${id}`)
    setCount(count + 1)
  }

  return (
    <div>
      Counter {id} is {count}
      &nbsp;
      <button onClick={increment}>➕</button>
      &nbsp;
      <button onClick={remove}>❌</button>
    </div>
  )
}

let nextId = 1

function App() {
  const [counters, setCounters] = useState([1])

  const addCounter = () => {
    console.log("Adding new Counter")
    setCounters(counters.concat(++nextId))
  }

  const reverseCounters = () => {
    console.log("Reversing Counters")
    setCounters(counters.slice().reverse())
  }

  const removeCounter = id => {
    console.log(`Removing Counter ${id}`)
    setCounters(counters.filter(c => c !== id))
  }

  return (
    <div>
      {counters.map(id => (
        <Counter key={id} id={id} remove={() => removeCounter(id)} />
      ))}
      <hr />
      <button onClick={addCounter}>Add new</button>
      <button onClick={reverseCounters} disabled={counters.length === 1}>
        Reverse
      </button>
    </div>
  )
}

console.log("Starting App")

render(<App />, document.body)


// [0] effect: Counter #1 is 0
// useEffect-remove.js:24 Increment Counter 1
// useEffect-remove.js:19   [0] clean-up: Counter #1
// useEffect-remove.js:16   [1] effect: Counter #1 is 1
// useEffect-remove.js:24 Increment Counter 1
// useEffect-remove.js:19   [1] clean-up: Counter #1
// useEffect-remove.js:16   [2] effect: Counter #1 is 2
// useEffect-remove.js:24 Increment Counter 1
// useEffect-remove.js:19   [2] clean-up: Counter #1
// useEffect-remove.js:16   [3] effect: Counter #1 is 3
// useEffect-remove.js:55 Removing Counter 1
// useEffect-remove.js:19   [3] clean-up: Counter #1
// useEffect-remove.js:45 Adding new Counter
// useEffect-remove.js:16   [4] effect: Counter #2 is 0