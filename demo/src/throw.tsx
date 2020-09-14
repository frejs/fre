import { h, render, useState, useEffect } from '../../src/index'

const App = () => {
  const [resource, setResource] = useState(undefined)
  const [count, setCount] = useState(0)
  const [pending, setPending] = useState(false)
  //   useEffect(() => {
  //     const id = setInterval(() => setCount((c) => c + 1), 200)
  //     return () => clearInterval(id)
  //   }, [])
  const update = () => {
    setPending(true)
    setResource(wrapPromise(new Promise((r) => setTimeout(r, 3000)).then(() => 'FETCHED RESULT')))
  }

  console.log(resource)
  return (
    <div>
      <button onClick={update}>CLICK ME</button>
      <pre>{JSON.stringify({ count, pending }, null, 2)}</pre>
      {resource ? resource.read() : 'Initial state'}
    </div>
  )
}

const wrapPromise = (promise) => {
  let result
  promise.then((value) => {
    result = { type: 'success', value }
  })
  return {
    read() {
      if (!result) throw promise
      return result.value
    },
  }
}

render(<App />, document.body)
