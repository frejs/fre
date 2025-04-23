import { h, render, useState, Fragment } from "../../src/index"
// import {createElement as h,useState,Fragment} from '../react/react'
// import {render} from '../react/react-dom'
// import {h, render} from '../../.ignore/eee'

// const states = [
//   [3, 1, 2], // shift right
//   [1, 2, 3],
//   [2, 3, 1], // shift left
//   [1, 2, 3],
//   [1, 3], // remove from middle
//   [1, 2, 3],
//   [2, 3], // remove first
//   [1, 2, 3],
//   [1, 2], // remove last
//   [1, 2, 3],
//   [3, 2, 1], // reverse order
// ]

// function App() {
//   const [state, setState] = useState([1,2,3])
//   return <>
//     <button onClick={() => setState(!state)}>change</button>
//     {state ? <h1>0</h1> : <a>none</a>}
//   </>
// }
// function A(props){
//   return <li>1</li>
// }
// function App() {
//   const [key, setKey] = useState([1,2,3])
//   const [count, setCount] = useState(0)
//   return [
//     <button onClick={() => {
//       setKey(states[count])
//       setCount(count + 1)
//     }}>x</button>,
//     <ul>
//       {key.map((i) => (
//         <li key={i}>{i}</li>
//       ))}
//     </ul>,
//   ]
// }

// function App() {
//   const [key, setKey] = useState([1,2,6,3])
//   return [
//     <button onClick={() => setKey([1,3,5,2,4])}>x</button>,
//     <ul>
//       {key.map((i) => <Li key={i} i={i}/>
//       )}
//     </ul>
//   ]
// }

// function App() {
//   const [key, setKey] = useState(['a', 'b', 'c'])
//   return h(A, null, 222, " items left")
// }

// function App() {
//   const [key, setKey] = useState([1,2,3])
//   return <div>
//     <button onClick={() => setKey([3,1,2])}>x</button>
//     <ul>
//       {key.map((i) => {
//         return i == 1?<A id={i} key={i} />:<div key={i}>{i}</div>
//       })}
//     </ul>
//   </div>
// }

// function App() {
//   const [list, setList] = useState([1, 2, 3])
//   return <div>{list.map((d) => <span>{d}</span>)} <button onClick={() => setList(list.concat(4))}>+</button></div>
// }

const App = () => {
  let [bool, setbool] = useState(true)
  return <div>
      <div>{bool ? <p>111</p> : <span>222</span>}</div>
      <button onClick={()=>setbool(!bool)}>x</button>
  </div>
}

// function Header(){
//   return <div><a href="">222</a></div>
// }

// function App() {
//   const [key, setKey] = useState([1,2,3,4,5])
//   return (
//     <div>
//       {key.map((i) => (
//         // <Li i={i} key={i} />
//         <li key={i} >{i}</li>
//       ))}
//       <button onClick={() => setKey([5,3,4])}>x</button>
//     </div>
//   )
// }

// export default function App() {
//   const [state, setState] = useState(true);

//   return (
//     <div>
//       <button
//         onClick={() => {
//           setState(false);
//         }}
//       >
//         set
//       </button>
//       {state?<li>111</li>:null}
//     </div>
//   );
// }

// function Li(props) {
//   return <div>
//     <li>{props.i}</li>
//     <li>{props.i}</li>
//   </div>
// }

// function Li(props) {
//   return <li>{props.i}</li>
// }

// const parentNode = document.getElementById("app");

// render(<div><li key={1}>1</li><li key={2}>2</li><li key={3}>3</li></div>, parentNode);

// render(<div><li key={3}>3</li><li key={2}>2</li><li key={1}>1</li></div>, parentNode);

render(<App />, document.getElementById("app"))
