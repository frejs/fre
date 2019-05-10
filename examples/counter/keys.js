import { h, render, useState, useEffect } from '../../src'

function App () {
  const [arr, setArr] = useState(['A','B','C','D'])
  return (
    <div>
      <ul>
        {arr.map(item => (
          <li key={item}>{item}</li>
        ))}
      </ul>
      <button onClick={() => setArr(['B','A','D','C'])}>+</button>
    </div>
  )
}

// 这种情况不支持
// A B C D -> C D A B

// function App () {
//   const [arr, setArr] = useState(['A','B','C','D'])
//   return (
//     <div>
//       <ul>
//         {arr.map(item => (
//           <li key={item}>{item}</li>
//         ))}
//       </ul>
//       <button onClick={() => setArr(['B','C','D','A','E'])}>+</button>
//     </div>
//   )
// }

// render(<App />, document.getElementById('root'))

// function App () {
//   const [arr, setArr] = useState(['A','B','C','D'])
//   return (
//     <div>
//       <ul>
//         {arr.map(item => (
//           <li key={item}>{item}</li>
//         ))}
//       </ul>
//       <button onClick={() => setArr(['C','D','A','B'])}>+</button>
//     </div>
//   )
// }

render(<App />, document.getElementById('root'))
