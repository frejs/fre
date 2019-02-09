import { h, render, useState } from '../../src'

function Counter() {
  const [count, setCount] = useState(0)
  const [sex, setSex] = useState('boy')
  return (
    <div class="counter">
      <h1>{count}</h1>
      <button onClick={() => setCount(count + 1)}>+</button>
      <h1>{sex}</h1>
      <button onClick={() => {sex === 'boy' ? setSex('girl') : setSex('boy')}}>x</button>
    </div>
  )
}

// function Sex() {
//   const [sex, setSex] = useState('boy')
//   return (
//     <div>
//       <h1>{sex}</h1>
//       <button onClick={()=>{sex === 'boy' ? setSex('girl') : setSex('boy')}}>x</button>
//     </div>
//   )
// }

render(<Counter />, document.getElementById('app'))
