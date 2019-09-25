import { h, render, useState, useEffect } from '../src'

// function Counter () {
//   const [count, setCount] = useState(0)
//   useEffect(() => {
//     document.title = count
//   },[count])
//   return (
//     <div>
//       <h1 key='h1'>{count}</h1>
//       <button onClick={() => setCount(count + 1)}>+</button>
//     </div>
//   )
// }

const Component = props => props.children(1)

const div = <Component>{value=><h1>{value}</h1>}</Component>

render(div, document.getElementById('root'))
