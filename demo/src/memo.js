import { h, render, useState } from '../../src'

function App () {
  const [state, setState] = useState(0)
  return (
    <div>
      {state}
      <A count={1}/>
      <button onClick={() => setState(state+1)}>+</button>
    </div>
  )
}

function A(props){
  console.log(222)
  return <div>{props.count}</div>
}


render(<App />, document.getElementById('root'))
