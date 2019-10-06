/** @jsx h */

import { h, render, useState, useEffect } from "../src/index"

const testRender = jsx => new Promise(resolve => {
  document.body.innerHTML = ""

  render(jsx, document.body, () => resolve([...document.body.childNodes]))
})

const toString = elements => elements.map(child => child.outerHTML).join("")

test('render nested HTML elements, apply attributes', done => {
  testRender(<div><span class="foo">test</span></div>).then(elements => {
    expect(toString(elements)).toBe(`<div><span class="foo">test</span></div>`)

    done()
  })
})

test('apply props to object properties', done => {
  testRender(<input defaultChecked={true}/>).then(elements => {
    expect(elements[0].defaultChecked).toBe(true)

    done()
  })
})

test('render range of HTML elements', done => {
  testRender(<ul><li>1</li><li>2</li><li>3</li></ul>).then(elements => {
    expect(toString(elements)).toBe("<ul><li>1</li><li>2</li><li>3</li></ul>")

    done()
  })
})

test('attach DOM event handler', done => {
  let clicked = false

  const handler = () => clicked = true

  testRender(<button onclick={handler}>OK</button>).then(elements => {
    elements[0].click()

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

  testRender(<Component effect={() => afterEffect()}/>).then(elements => {
    expect(effectCalled).toBe(true)

    expect(elements[0].firstChild.nodeValue).toBe("0")

    afterEffect = checkEffect

    elements[0].click()

    function checkEffect() {
      expect(elements[0].firstChild.nodeValue).toBe("1")

      done()
    }
  })
})
