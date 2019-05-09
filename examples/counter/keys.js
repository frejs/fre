import { h, render, useState, useEffect } from '../../src'

// function App () {
//   const [arr, setArr] = useState(['A','B'])
//   return (
//     <div>
//       <ul>
//         {arr.map(item => (
//           <li key={item}>{item}</li>
//         ))}
//       </ul>
//       <button onClick={() => setArr(['B','A'])}>+</button>
//     </div>
//   )
// }

function App () {
  const [arr, setArr] = useState(['A','B','C','D'])
  return (
    <div>
      <ul>
        {arr.map(item => (
          <li key={item}>{item}</li>
        ))}
      </ul>
      <button onClick={() => setArr(['B','C','A'])}>+</button>
    </div>
  )
}

render(<App />, document.getElementById('root'))
