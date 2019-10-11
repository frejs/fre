import { useEffect, h, render } from '../src'

function App () {
  return <Component/>
}

// function App () {
//   return <div> <Component value={1} /> </div>
// }

function Component (props) {
  useEffect(() => {
    console.log(111)
  })
  return <span>111</span>
}

render(<App />, document.body)
