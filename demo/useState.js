import { h, render, useState, useEffect } from '../src'

function App () {
  const [state, setState] = useState(true)
  return (
    <div>
      {state&& <A/>}
      <button onClick={() => setState(!state)}>+</button>
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
