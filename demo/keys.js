import { h, render, useState, useEffect } from '../src'

// A B C D -> B A D C √

function App () {
  const [arr, setArr] = useState(['A', 'B','C','D'])
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
// function App () {
//   const [arr, setArr] = useState(['A', 'B','C','D','E','F'])
//   return (
//     <div>
//       <ul>
//         {arr.map(item => (
//           <li key={item}>{item}</li>
//         ))}
//       </ul>
//       <button onClick={() => setArr(['B','A','D','C','F','E'])}>+</button>
//     </div>
//   )
// }
// function App () {
//   const [arr, setArr] = useState(['A', 'B', 'C', 'D', 'E','F'])
//   return (
//     <div>
//       <ul>
//         {arr.map(item => (
//           <li key={item}>{item}</li>
//         ))}
//       </ul>
//       <button onClick={() => setArr(['E','F','C', 'D', 'A', 'B'])}>+</button>
//     </div>
//   )
// }

// A B C D -> C D A B √

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

// function App () {
//   const [arr, setArr] = useState(['A', 'B'])
//   return (
//     <div>
//       <ul>
//         {arr.map(item => (
//           <li key={item}>{item}</li>
//         ))}
//       </ul>
//       <button onClick={() => setArr(['B', 'A'])}>+</button>
//     </div>
//   )
// }

// function App () {
//   const [arr, setArr] = useState(['A', 'B'])
//   return (
//     <div>
//       <ul>
//         {arr.map(item => (
//           <li key={item}>{item}</li>
//         ))}
//       </ul>
//       <button onClick={() => setArr(['B'])}>+</button>
//     </div>
//   )
// }

// function App () {
//   const [arr, setArr] = useState(['A', 'B', 'C', 'D', 'E', 'F'])
//   return (
//     <div>
//       <ul>
//         {arr.map(item => (
//           <li key={item}>{item}</li>
//         ))}
//       </ul>
//       <button onClick={() => setArr(['E', 'F', 'C', 'D', 'A', 'B'])}>+</button>
//     </div>
//   )
// }

// function App () {
//   const [arr, setArr] = useState(['A', 'B'])
//   return (
//     <div>
//       <ul>
//         {arr.map(item => (
//           <li key={item}>{item}</li>
//         ))}
//       </ul>
//       <button onClick={() => setArr(['B'])}>+</button>
//     </div>
//   )
// }

render(<App />, document.getElementById('root'))
