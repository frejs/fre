import { h, render, useState, useEffect } from '../src'

function App () {
  const [state, setState] = useState(0)
  useEffect(() => {
    console.log(111)
    return () => {
      console.log(222)
    }
  },[])
  return (
    <div>
      {state}
      <button onClick={() => setState(state + 1)}>+</button>
    </div>
  )
}

render(<App />,document.getElementById('root'))
