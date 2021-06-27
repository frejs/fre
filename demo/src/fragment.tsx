import { render, Fragment, h, useState } from '../../src/index'



function App() {
  const [key, setKey] = useState([1, 2])
  return (
    <div>
      {key.map((i) => (
        <Li i={i} key={i} />
        // <li key={i} >{i}</li>
      ))}
      <button onClick={() => setKey([5, 3, 4])}>x</button>
    </div>
  )
}
// function Li(props) {
//   return <>
//     <li>{props.i}</li>
//     <li>{props.i}</li>
//   </>
// }
function Li(props) {
  return <li>{props.i}</li>
}
render(<App />, document.getElementById('app'))