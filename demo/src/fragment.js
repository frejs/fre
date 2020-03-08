import { h, render, Fragment } from '../../src'

function App() {
  const o = 1
  const n = 2
  return (
    <>
      {o}
      {n}
    </>
  )
}

render(<App />, document.body)
