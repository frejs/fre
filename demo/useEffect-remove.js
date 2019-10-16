// import { h, render, useState, useEffect } from '../src'
import { render } from 'react-dom'
import { createElement as h, useState, useEffect, useRef } from 'react'

function App () {
  let effects = []
  let effectNum = 1
  const [state, setState] = useState(true)
  useEffect(() => {
    const currentEffectNum = effectNum++

    effects.push(`effect ${currentEffectNum}`)
    console.log(effects) // ["effect 1", "cleanUp 1", "effect 2"]

    return () => {
      effects.push(`cleanUp ${currentEffectNum}`)
    }
  })
  return (
    <div>
      {state && <div>111</div>}
      <button onClick={() => setState(false)}>remove</button>
    </div>
  )
}

render(<App />, document.body)
