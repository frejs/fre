/** @jsx h */

import { h, render, useState, useEffect } from "../src/index"

const testRender = jsx => new Promise(resolve => {
  document.body.innerHTML = ""

  render(jsx, document.body, () => {
    const html = document.createDocumentFragment()

    for (const child of document.body.childNodes) {
      html.appendChild(child)
    }

    resolve(html)
  })
})

const toString = el => Array.from(el.childNodes).map(child => child.outerHTML).join("")

test('render nested HTML elements, apply attributes', done => {
  testRender(<div><span class="foo">test</span></div>).then(html => {
    expect(toString(html)).toBe(`<div><span class="foo">test</span></div>`)

    done()
  })
})

test('apply props to object properties', done => {
  testRender(<input defaultChecked={true}/>).then(html => {
    expect(html.children[0].defaultChecked).toBe(true)

    done()
  })
})

test('render range of HTML elements', done => {
  testRender(<ul><li>1</li><li>2</li><li>3</li></ul>).then(html => {
    expect(toString(html)).toBe("<ul><li>1</li><li>2</li><li>3</li></ul>")

    done()
  })
})

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
})


test('update components; use state and effect hooks', done => {
  const Component = ({ effect }) => {
    const [count, setCount] = useState(0)

    useEffect(effect)

    const onClick = () => setCount(count + 1)

    return (
      <button onclick={onClick}>
        {count}
      </button>
    )
  }

  let effectCalled = false

  let afterEffect = () => effectCalled = true

  testRender(<Component effect={() => afterEffect()}/>).then(html => {
    expect(effectCalled).toBe(true)

    expect(html.children[0].firstChild.nodeValue).toBe("0")

    afterEffect = checkEffect

    html.children[0].click()

    function checkEffect() {
      expect(html.children[0].firstChild.nodeValue).toBe("1")

      done()
    }
  })
})
