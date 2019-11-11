// import { render } from "react-dom"
// import { createElement as h, useCallback, useEffect,useRef,useState } from "react"

import { h, render, useRef, useEffect, useState } from '../src'

function Counter () {
  const [count, setCount] = useState(true)
  const t = useRef(dom => {
    console.log(dom)
    return dom => {
      console.log(dom)
    }
  })
  return (
    <div>
      {count && <span ref={t}>111</span>}
      <button onClick={() => setCount(!count)} >+</button>
    </div>
  )
}

render(<Counter />, document.getElementById('root'))
