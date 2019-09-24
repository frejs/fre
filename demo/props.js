import { h, render, useState } from '../src'

function App () {
  const [count, setCount] = useState(0)
  return (
    <div style={count > 5 ? { color: 'red' } : { backgroundColor: 'black' }}>
      <svg xmlns='http://www.w3.org/2000/svg' version='1.1'>
        <circle
          cx='100'
          cy='50'
          r='40'
          stroke='black'
          stroke-width='2'
          fill='red'
        />
      </svg>
      {/* <button onClick={() => setCount(count + 1)} disabled={count === 3}>
        +
      </button> */}
    </div>
  )
}
render(<App />, document.getElementById('root'))
