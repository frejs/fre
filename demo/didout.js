import { h, render, useState, useEffect } from '../src'

function App () {
  const [state, setState] = useState([])
  useEffect(() => {
    fetch('https://api.clicli.us/rank')
      .then(res => {
        return res.json()
      })
      .then(res => {
        setState(res.posts)
      })
  },[])
  return (
    <div>
      {state.map(item => {
        return <li>{item.title}</li>
      })}
    </div>
  )
}

render(<App />, document.getElementById('root'))
