import { h, render, useState, useEffect } from '../src'

// A B C D -> B A D C √



// function App () {
//   const [arr, setArr] = useState(1)
//   return (
//     <div>
//       {new Array(arr).fill().map(i=> (
//         <A key={i}/>
//       ))}
//       <button onClick={() => setArr(arr + 1)}>+</button>
//       <button onClick={() => setArr(arr - 1)}>-</button>
//     </div>
//   )
// }

// function A (props) {
//   return <li>1</li>
// }

// function App () {
//   const [arr, setArr] = useState(['A', 'B', 'C', 'D'])
//   return (
//     <div>
//       {arr.map(item => (
//         <li>{item}</li>
//       ))}
//       <button onClick={() => setArr(['C', 'D', 'A', 'B'])}>+</button>
//     </div>
//   )
// }

function App () {
  const [arr, setArr] = useState(['A', 'B', 'C', 'D'])
  return (
    <div>
      {arr.map(item => (
        <li key={item}>{item}</li>
      ))}
      <button onClick={() => setArr(['B', 'A', 'D', 'C'])}>+</button>
    </div>
  )
}

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
//   const [arr, setArr] = useState(['A','B','C','D'])
//   return (
//     <div>
//       <ul>
//         {arr.map(item => (
//           <li key={item}>{item}</li>
//         ))}
//       </ul>
//       <button onClick={() => setArr(['B','C','A','D'])}>+</button>
//     </div>
//   )
// }


// function App () {
//   const [arr, setArr] = useState(['A', 'B'])
//   return (
//     <div>
//         {arr.map(item => (
//           <li key={item}>{item}</li>
//         ))}
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


render(<App />, document.getElementById('root'))
