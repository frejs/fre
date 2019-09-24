import { h, render, useState } from '../src'

function App () {
  const [flag, setFlag] = useState(true)
  return (
    <div style={flag? { color: 'red' } : { backgroundColor: 'black' }}>
      <svg xmlns='http://www.w3.org/2000/svg' version='1.1'>
        <circle
          cx='100'
          cy='50'
          r='40'
          stroke='black'
          stroke-width='2'
          fill={flag?'black':'red'}
        />
      </svg>
      <button onClick={() => setFlag(!flag)}>
        +
      </button>
    </div>
  )
}
render(<App />, document.getElementById('root'))
