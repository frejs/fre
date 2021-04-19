// // preact:
// import { render, createElement as h } from "preact/compat";
// import { useState, useEffect } from "preact/hooks";

// react:
// import { createElement as h, useState, useEffect } from "react";
// import { render } from "react-dom";

// // fre:
import { render, useState, useEffect, useRef } from "../../src"

const Wrapper = () => {
  const [showApp, setShowApp] = useState(true)

  useEffect(() => {
    setTimeout(() => {
      setShowApp(false)
    }, 2000)
  }, [])

  const p = (dom) => {
    if (dom) {
      console.log(dom)
    } else {
      console.log(111)
    }
  }
  const c = (dom) => {
    if (dom) {
      console.log(dom)
    } else {
      console.log(222)
    }
  }

  return (
    <div>
      {showApp ? <div ref={p}>111</div> : <div ref={c}>App removed...</div>}
    </div>
  )
}

render(<Wrapper />, document.getElementById("app"))
