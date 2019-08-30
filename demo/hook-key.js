import { h, render, useState } from '../src'

function Counter() {
  const [count, setCount] = useState(0);
  
  return (
    <div>
      {count}
      <button onClick={() => setCount(count + 1)}>
        +
      </button>
    </div>
  );
}

function App() {
  const [counters, setCounters] = useState(1);

  return <div>
    {new Array(counters).fill().map(i => (
      <Counter />
    ))}
    <button onClick={() => setCounters(counters + 1)}>
      Add
    </button>
    <button onClick={() => setCounters(counters - 1)}>
      Remove
    </button>
  </div>
}

// function App () {
//   const [arr, setArr] = useState(['A', 'B','C','D'])
//   return (
//     <div>
//       <ul>
//         {arr.map(item => (
//           <A key={item} val={item}/>
//         ))}
//       </ul>
//       <button onClick={() => setArr(['B','A','D'])}>+</button>
//     </div>
//   )
// }

// function A(props){
//   return <li>{props.val}</li>
// }

// function App () {
//   const [arr, setArr] = useState(['A', 'B','C','D'])
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
