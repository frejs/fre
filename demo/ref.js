import { render } from "react-dom"
import { createElement as h, useCallback, useEffect,useRef } from "react"

// import { h, render, useCallback, useEffect,useRef } from '../src'

function Counter () {
  const t = useCallback(node=>{
    console.log(node)
  })
  useEffect(() => {
    console.log(t)
  })
  return (
    <div ref={t}>
      111
    </div>
  )
}


render(<Counter />, document.getElementById('root'))