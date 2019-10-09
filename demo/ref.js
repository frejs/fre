import { h, render, useState, useEffect,useRef } from '../src'

function Counter () {
  const t = useRef(null)
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