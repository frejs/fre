import { h, render, useState, useReducer, useLayout } from '../../src/index'

const reducer = (state, action) => {
  switch (action.type) {
    case '*throw':
      return lazy(new Promise((r) => setTimeout(r, 3000)).then(() => 'Done'))
    default:
      return state
  }
}

const App = () => {
  const [state, dispatch] = useReducer(reducer, null)
  const [count, setCount] = useState(0)
  useLayout(() => {
    const id = setInterval(() => setCount((c) => c + 1), 1000)
    return () => clearInterval(id)
  }, [])

  console.log(state, count)
  return (
    <div>
      <button onClick={() => dispatch({ type: '*throw' })}>CLICK ME</button>
      <pre>{JSON.stringify({ count }, null, 2)}</pre>
      {state ? state.read() : 'Init'}
    </div>
  )
}

const lazy = (promise) => {
  let result = null
  promise.then((res) => {
    result = res
  })
  return {
    read() {
      if (!result) throw promise
      return result
    },
  }
}

render(<App />, document.body)
