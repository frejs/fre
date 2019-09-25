/** @jsx h */

import { render } from "./reconciler"
import { h } from "./h";

const testRender = jsx => new Promise(resolve => {
  let target = document.createElement("div")
  let dummy = document.createElement("div")

  document.body.appendChild(target)
  document.body.appendChild(dummy)

  render(jsx, target)
  render({ type: () => resolve(target.innerHTML) }, dummy)
})

test('render HTML elements', done => {
  testRender(<div/>).then(html => {
    expect(html).toBe("<div></div>")

    done()
  })
})
