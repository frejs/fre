// import { unstable_createRoot } from "react-dom"
// import { createElement as h, useState, useEffect } from "react"
import { h, render, useState, useEffect } from '../../src'

const UPDATE_EVERY = 1000
const BLOCK_FOR = 3
const NUM_COMPONENTS = 20

const App = () => {
  const [count, setCount] = useState(0)

  useEffect(() => {
      setTimeout(() => setCount(count + 1), UPDATE_EVERY)
  })

  const values = []

  for (let i = count; i < count + NUM_COMPONENTS; i++) {
    values.push(i)
  }

  return (
    <div className='wraper'>
      <h1>Count: {count}</h1>
      {values.map((value,index) => (
        <SlowComponent key={value} value={value} />
      ))}
    </div>
  )
}

const SlowComponent = ({ value }) => {
  const start = performance.now()
  while (performance.now() - start < BLOCK_FOR);

  return <li className='slow'>{value}</li>
}

render(<App />, document.getElementById('root'))
// const root = createRoot(document.getElementById('root'))
// root.render(<App />)
