// import { render } from "react-dom"
// import { createElement as h, useCallback, useEffect,useRef,useState } from "react"

import { h, render, useRef, useEffect, useState } from '../src'

function Counter () {
  const [count, setCount] = useState(true)
  return (
    <div>
      {count && <B />}
      <button onClick={() => setCount(!count)}>+</button>
    </div>
  )
}

function B () {
  return (
    <span
      ref={dom => {
        console.log(dom)
        if (dom) {
          console.log('dosomething')
        } else {
          console.log('cleanup')
        }
      }}
    >
      111
    </span>
  )
}

render(<Counter />, document.getElementById('root'))
