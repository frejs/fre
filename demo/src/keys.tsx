import { h, render, useEffect, useState,Fragment } from "../../src/index"

// function App() {
//   const [key, setKey] = useState([3,1,2])
//   return [
//     <button onClick={() => setKey([1,2,3])}>x</button>,
//     <ul>
//       {key.map((i) => (
//         <li key={i}>{i}</li>
//       ))}
//     </ul>,
//   ]
// }

// function App() {
//   const [key, setKey] = useState(['a', 'b', 'c'])
//   return [
//     <button onClick={() => setKey(['b', 'c', 'a'])}>x</button>,
//     <ul>
//       {key.map((i) => (
//         <li key={i}>{i}</li>
//       ))}
//     </ul>,
//   ]
// }

// function App() {
//   const [key, setKey] = useState(['a', 'b', 'c'])
//   return [
//     <button onClick={() => setKey(['c', 'b','a'])}>x</button>,
//     <ul>
//       {key.map((i) => (
//         <li key={i}>{i}</li>
//       ))}
//     </ul>,
//   ]
// }

// function App() {
//   const [key, setKey] = useState([1, 2, 3])
//   return <div>
//     <button onClick={() => setKey([3, 1, 2])}>x</button>,
//     <ul>
//       {key.map((i) => (
//         // <Li i={i} key={i} />
//         <Li key={i} i={i} />
//       ))}
//     </ul>
//   </div>
// }

// function App() {
//   const [key, setKey] = useState([1, 2, 3])
//   return <div>
//     <button onClick={() => setKey([3, 2, 1])}>x</button>,
//     <ul>
//       {key.map((i) => (
//         // <Li i={i} key={i} />
//         <li key={i} >{i}</li>
//       ))}
//     </ul>
//   </div>
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

export default function App() {
  const [state, setState] = useState( ["A", "B", "C", "D", "E"]);

  return (
    <>
      {state.map((item) => {
        return <div key={item}>{item}</div>;
      })}

      <button
        onClick={() => {
          setState(["E", "C", "D"] );
        }}
      >
        set
      </button>
    </>
  );
}

// function Li(props) {
//   return <li>{props.i}</li>
// }

function Li(props) {
  return [<li>{props.i}</li>, <li>{props.i}</li>]
}

render(<App />, document.getElementById("root"))
