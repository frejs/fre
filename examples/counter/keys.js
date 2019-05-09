import { h, render, useState, useEffect } from '../../src'

// function Counter () {
//   const [arr, setArr] = useState(['A','B','C','D'])
//   return (
//     <div>
//       <ul>
//         {arr.map(item => (
//           <li key={item}>{item}</li>
//         ))}
//       </ul>
//       <button onClick={() => setArr(['B','A','D','C'])}>+</button>
//     </div>
//   )
// }

function Counter () {
  const [arr, setArr] = useState(['A','B','C'])
  return (
    <div>
      <ul>
        {arr.map(item => (
          <li key={item}>{item}</li>
        ))}
      </ul>
      <button onClick={() => setArr(['C','B','A'])}>+</button>
    </div>
  )
}

render(<Counter />, document.getElementById('root'))
