/** @jsx h */

import { render } from "./reconciler"
import { h } from "./h";

const testRender = jsx => new Promise(resolve => {
  let target = document.createElement("div")

  document.body.appendChild(target)

  render(jsx, target, () => resolve(target.innerHTML))
})

test('render HTML elements', done => {
  testRender(<div>test</div>).then(html => {
    expect(html).toBe("<div>test</div>")

    done()
  })
})
