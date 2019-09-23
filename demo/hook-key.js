import { h, render, useState } from '../src'

// import { createElement, render, useState, useEffect } from 'preact/compat';

function Counter () {
  const [count, setCount] = useState(0)

  return (
    <div>
      {count}
      <button onClick={() => setCount(count + 1)}>+</button>
    </div>
  )
}

function App () {
  const [counters, setCounters] = useState(1)

  return (
    <div>
      {new Array(counters).fill().map(i => (
        <Counter key={i}/>
      ))}
      <button onClick={() => setCounters(counters + 1)}>+</button>
      <button onClick={() => setCounters(counters - 1)}>-</button>
    </div>
  )
}

render(<App />, document.querySelector('#root'))
