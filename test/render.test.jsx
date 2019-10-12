/** @jsx h */

import { h, render, useState, useEffect, useRef } from "../src/index"

const testRender = jsx => new Promise(resolve => {
  document.body.innerHTML = ""

  render(jsx, document.body, () => resolve([...document.body.childNodes]))
})

const testUpdates = async updates => {
  let effect = () => {}
  let setContent

  const Component = () => {
    const [content, _setContent] = useState(updates[0].content)

    setContent = _setContent

    useEffect(effect)

    return content
  }

  const run = index => updates[index].test([...document.body.childNodes])

  await testRender(<Component/>)

  run(0)

  for (let i=1; i<updates.length; i++) {
    await new Promise(resolve => {
      effect = () => {
        run(i)

        resolve()
      }

      setContent(updates[i].content)
    })
  }
}

const toString = elements => elements.map(child => child.outerHTML).join("")

test('render nested HTML elements, apply attributes', async () => {
  const elements = await testRender(<div><span class="foo">test</span></div>)

  expect(toString(elements)).toBe(`<div><span class="foo">test</span></div>`)
})

test('apply props to object properties', async () => {
  const elements = await testRender(<input defaultChecked={true}/>)

  expect(elements[0].defaultChecked).toBe(true)
})

test('render range of HTML elements', async () => {
  const elements = await testRender(<ul><li>1</li><li>2</li><li>3</li></ul>)

  expect(toString(elements)).toBe("<ul><li>1</li><li>2</li><li>3</li></ul>")
})
test('render/update object properties and DOM attributes', async () => {
  let lastChildren = []

  await testUpdates([
    {
      content: (
        <ul>
          <li class="foo"/>
          <li className="bar"/>
          <li data-something="baz" data-remove-me tabIndex={123}/>
        </ul>
      ),
      test: elements => {
        expect(elements[0].tagName).toBe("UL")
        expect(elements[0].children.length).toBe(3)
        expect(elements[0].children[0].getAttribute("class")).toBe("foo")
        expect(elements[0].children[1].className).toBe("bar")
        expect(elements[0].children[2].getAttribute("data-something")).toBe("baz")
        expect(elements[0].children[2].hasAttribute("data-remove-me")).toBe(true)
        expect(elements[0].children[2].tabIndex).toBe(123)

        lastChildren = [...elements[0].children]
      }
    },
    {
      content: (
        <ul>
          <li class="foo2"/>
          <li className="bar2"/>
          <li data-something="baz2" tabIndex={99}/>
        </ul>
      ),
      test: elements => {
        expect(elements[0].tagName).toBe("UL")
        expect(elements[0].children.length).toBe(3)
        expect(elements[0].children[0].getAttribute("class")).toBe("foo2")
        expect(elements[0].children[1].className).toBe("bar2")
        expect(elements[0].children[2].getAttribute("data-something")).toBe("baz2")
        expect(elements[0].children[2].hasAttribute("data-remove-me")).toBe(false)
        expect(elements[0].children[2].tabIndex).toBe(99)

        lastChildren.forEach((lastChild, index) => expect(elements[0].children[index]).toBe(lastChild))
      }
    }
  ])
})

test('attach/remove DOM event handler', async () => {
  let clicks = 0

  const handler = () => clicks += 1

  await testUpdates([
    {
      content: <button onclick={handler}>OK</button>,
      test: ([button]) => {
        button.click()

        expect(clicks).toBe(1)
      }
    },
    {
      content: <button>OK</button>,
      test: ([button]) => {
        button.click()

        expect(clicks).toBe(1) // doesn't trigger handler, which has been removed
      }
    }
  ])
})

test('useEffect(f, [x]) should detect changes to x', async () => {
  let effects = 0
  let cleanUps = 0

  const cleanUp = () => {
    cleanUps += 1
  }

  const effect = () => {
    effects += 1

    return cleanUp
  }

  const Component = ({ value }) => {
    effects = 0
    cleanUps = 0

    useEffect(effect, [value])

    return <div>foo</div>
  }

  await testUpdates([
    // mounted: should trigger effect
    {
      content: <Component value={1}/>,
      test: () => {
        expect(effects).toBe(1)
        expect(cleanUps).toBe(0)
      }
    },
    // updated: should trigger effect
    {
      content: <Component value={2}/>,
      test: () => {
        expect(effects).toBe(1)
        expect(cleanUps).toBe(1)
      }
    },
    // no change: should NOT trigger effect
    {
      content: <Component value={2}/>,
      test: () => {
        expect(effects).toBe(0)
        expect(cleanUps).toBe(0)
      }
    },
    // removal: should trigger clean-up
    {
      content: <div>removed</div>,
      test: () => {
        expect(effects).toBe(0)
        expect(cleanUps).toBe(1)
      }
    }
  ])
})

test('obtain reference to DOM element', async () => {
  const ref = useRef()

  const elements = await testRender(<div ref={ref}/>)

  expect(ref.current).toBe(elements[0])
})

test('reorder and reuse elements during key-based reconciliation of child-nodes', async () => {
  const states = [
    [1,2,3],
    [3,1,2], // shift right
    [1,2,3],
    [2,3,1], // shift left
    [1,2,3],
    [1,3],   // remove from middle
    [1,2,3],
    [2,3],   // remove first
    [1,2,3],
    [1,2],   // remove last
    [1,2,3],
    [3,2,1], // reverse order
    [1,2,3],
  ]

  let lastChildren

  await testUpdates(states.map((state, stateNumber) => ({
    content: (
      <ul>
        {state.map(value => <li key={value}>{value}</li>)}
      </ul>
    ),
    test: (elements) => {
      const children = [...elements[0].children]

      expect(children.map(el => el.textContent)).toStrictEqual(state.map(value => "" + value))

      if (stateNumber >= 1) {
        const lastState = states[stateNumber - 1]

        // console.log(`transition from ${lastState.join(", ")} to ${state.join(", ")}`)

        state.forEach((value, index) => {
          const lastIndex = lastState.indexOf(value)

          if (lastIndex !== -1) {
            // console.log(`item ${value} position ${lastIndex} -> ${index}`)

            expect(children[index]).toBe(lastChildren[lastIndex])
          }
        })
      }

      lastChildren = children
    }
  })))
})
