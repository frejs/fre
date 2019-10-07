import { h, render, useState } from '../src'

// import { createElement, render, useState, useEffect } from 'preact/compat';

function Counter (props) {
  const [count, setCount] = useState(props.value)

  return (
    <div>
      {count}
      <button onClick={() => setCount(count + 1)}>+</button>
    </div>
  )
}

function App () {
  const [counters, setCounters] = useState([1,2,3])

  return (
    <div>
      {counters.map(i => (
        <Counter key={i} value={i}/>
      ))}
      <button onClick={() => setCounters(counters.slice().reverse())}>+</button>
    </div>
  )
}

render(<App />, document.querySelector('#root'))
