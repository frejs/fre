import { h, render, useState, useEffect } from '../src'

function App () {
  const [state, setState] = useState(0)
  console.log(111)
  return (
    <div>
      {state}
      <button onClick={() => setState(state+1)}>+</button>
    </div>
  )
}

function A(props){
  useEffect(() => {
    console.log(111)
    return () => {
      console.log(222)
    }
  })
  return <div>{111}</div>
}

render(<App />,document.getElementById('root'))
