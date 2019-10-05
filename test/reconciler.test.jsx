/** @jsx h */

import { render } from "../src/reconciler"
import { h } from "../src/h";

const testRender = jsx => new Promise(resolve => {
  let target = document.createElement("div")

  document.body.appendChild(target)

  render(jsx, target)

  // TODO add callback to render function, e.g.:
  //   render(jsx, target, () => resolve(target.innerHTML))
  //   remove timeout hack below:
  setTimeout(() => resolve(target.innerHTML), 100)
})

test('render HTML elements', done => {
  testRender(<div>test</div>).then(html => {
    expect(html).toBe("<div>test</div>")

    done()
  })
})
