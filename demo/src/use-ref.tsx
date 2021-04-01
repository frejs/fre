/** @jsx h */

// // preact:
// import { render, createElement as h } from "preact/compat";
// import { useState, useEffect } from "preact/hooks";

// react:
// import { createElement as h, useState, useEffect } from "react";
// import { render } from "react-dom";

// // fre:
import { render, h, useState, useEffect, useRef } from '../../src'

const refNum = { div: 0, h1: 0 }

const makeRef = name => el =>
  console.log(
    `- <${name}> updated: ` +
      ((el && el.tagName) || el) +
      ` [#${++refNum[name]}]`
  )

const App = () => {
  console.log('App render')

  const [count, setCount] = useState(0)

  useEffect(() => {
    console.log(`- App effect, deps: [${count}]`)

    return () => {
      console.log(`- App effect, deps: [${count}] -> clean-up`)
    }
  }, [count])

  if (count < 2) {
    setTimeout(() => {
      console.log('App update')

      setCount(count + 1)
    }, 500)
  }

  return (
    <div ref={makeRef('div')}>
      <h1 ref={makeRef('h1')}>Hello World</h1>
      <p id="test">{count}</p>
    </div>
  )
}

const Wrapper = () => {
  const [showApp, setShowApp] = useState(true)

  if (showApp) {
    setTimeout(() => {
      console.log('Removing App...')
      setShowApp(false)
    }, 2000)
  }

  return showApp ? <App /> : <p>App removed...</p>
}

render(<Wrapper />, document.getElementById('root'))
