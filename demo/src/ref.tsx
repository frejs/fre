/** @jsx h */

// // preact:
// import { render, createElement as h } from "preact/compat";
// import { useState, useEffect } from "preact/hooks";

// react:
// import { createElement as h, useState, useEffect } from "react";
// import { render } from "react-dom";

// // fre:
import { render, h, useState, useEffect, useRef } from '../../src'


const Wrapper = () => {
  const [showApp, setShowApp] = useState(true)

  useEffect(()=>{
    setTimeout(() => {
      setShowApp(false)
    }, 2000)
  },[])

  const p = dom => {
    if (dom) {
    } else {
      console.log(111)
    }
  }
  const c = dom => {
    if (dom) {
    } else {
      console.log(222)
    }
  }
  console.log(showApp)

  return showApp ? <div ref={p}>
    <p ref={c}>before</p>
  </div> : <p>App removed...</p>
}

render(<Wrapper />, document.getElementById('root'))
