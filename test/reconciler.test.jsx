/** @jsx h */

import { render } from "../src/reconciler"
import { h } from "../src/h";

const testRender = jsx => new Promise(resolve => {
  document.body.innerHTML = ""

  render(jsx, document.body, () => {
    const html = document.createDocumentFragment();

    for (const child of document.body.childNodes) {
      html.appendChild(child);
    }

    resolve(html)
  })
})

const toString = el => Array.from(el.childNodes).map(child => child.outerHTML).join("")

test('render nested HTML elements', done => {
  testRender(<div><span class="foo">test</span></div>).then(html => {
    expect(toString(html)).toBe(`<div><span class="foo">test</span></div>`)

    done()
  })
});

test('render range of HTML elements', done => {
  testRender(<ul><li>1</li><li>2</li><li>3</li></ul>).then(html => {
    expect(toString(html)).toBe("<ul><li>1</li><li>2</li><li>3</li></ul>")

    done()
  })
});

test('attach DOM event handler', done => {
  let clicked = false

  const handler = () => clicked = true

  testRender(<button onclick={handler}>OK</button>).then(html => {
    html.children[0].click()

    setTimeout(() => {
      expect(clicked).toBe(true)

      done()
    })
  })
});
