import { h, render, useState } from '../src'

function App () {
  const [arr, setArr] = useState(['A', 'B', 'C', 'D'])
  return (
    <div>
      {arr.map(item => (
        <A key={item} value={item}/>
      ))}
      <button onClick={() => setArr(['C', 'D', 'A', 'B'])}>+</button>
    </div>
  )
}

function A(props){
  return <li>{props.value}</li>
}
render(<App />, document.getElementById('root'))