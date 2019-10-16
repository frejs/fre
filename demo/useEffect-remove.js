import { h, render, useState, useEffect } from '../src'
// import { render } from 'react-dom'
// import { createElement as h, useState, useEffect, useRef } from 'react'

function App () {
  let effects = []
  let effectNum = 1
  const [state, setState] = useState(true)
  const [count, setCount] = useState(0)
  useEffect(() => {
    const currentEffectNum = effectNum++

    effects.push(`effect ${currentEffectNum}`)
    console.log(effects) // ["effect 1", "cleanUp 1", "effect 2"]

    return () => {
      effects.push(`cleanUp ${currentEffectNum}`)
      console.log(effects)
    }
  })
  return (
    <div>
      {state && <A val={count} />}
      <button onClick={() => setState(false)}>remove</button>
      <button onClick={() => setCount(count + 1)}>add</button>
    </div>
  )
}

function A ({ val }) {
  return <div>{val}</div>
}

render(<App />, document.body)
