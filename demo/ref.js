// import { render } from "react-dom"
// import { createElement as h, useCallback, useEffect,useRef,useState } from "react"

import { h, render, useRef, useEffect, useState } from '../src'

function Counter () {
  const [count, setCount] = useState(true)
  const t = useRef(null)
  return (
    <div>
      {count && (
        <span
          ref={dom => {
            if (dom) {
              console.log('dosomething')
            } else {
              console.log('cleanup')
            }
          }}
        >
          111
        </span>
      )}
      <button onClick={() => setCount(!count)}>+</button>
    </div>
  )
}

render(<Counter />, document.getElementById('root'))
