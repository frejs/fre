/** @jsx h */
import { h, useState, memo } from '../src/index'
import { testUpdates } from './test-util'

test('async state update', async () => {
  let updates = 0

  const Component = memo(() => {
    const [count, setState] = useState(0)

    updates += 1

    return <button onClick={() => setState(count => count + 1)}>{count}</button>
  })

  await testUpdates([
    {
      content: <Component/>,
      test: ([button]) => {
        expect(+button.textContent).toBe(0)
        expect(updates).toBe(1)

        // trigger several functional state updates:
        button.click()
        button.click()
        button.click()
      }
    },
    {
      content: <Component/>,
      test: ([button]) => {
        expect(+button.textContent).toBe(3) // all 3 state updates applied
        expect(updates).toBe(2)
      }
    }
  ])
})

test('render/update object properties and DOM attributes', async () => {
  let lastChildren = []

  await testUpdates([
    {
      content: (
        <ul>
          <li class="foo" />
          <li className="bar" />
          <li data-something="baz" data-remove-me tabIndex={123} />
        </ul>
      ),
      test: elements => {
        expect(elements[0].tagName).toBe('UL')
        expect(elements[0].children.length).toBe(3)
        expect(elements[0].children[0].getAttribute('class')).toBe('foo')
        expect(elements[0].children[1].className).toBe('bar')
        expect(elements[0].children[2].getAttribute('data-something')).toBe(
          'baz'
        )
        expect(elements[0].children[2].hasAttribute('data-remove-me')).toBe(
          true
        )
        expect(elements[0].children[2].tabIndex).toBe(123)

        lastChildren = [...elements[0].children]
      }
    },
    {
      content: (
        <ul>
          <li class="foo2" />
          <li className="bar2" />
          <li data-something="baz2" tabIndex={99} />
        </ul>
      ),
      test: elements => {
        expect(elements[0].tagName).toBe('UL')
        expect(elements[0].children.length).toBe(3)
        expect(elements[0].children[0].getAttribute('class')).toBe('foo2')
        expect(elements[0].children[1].className).toBe('bar2')
        expect(elements[0].children[2].getAttribute('data-something')).toBe(
          'baz2'
        )
        expect(elements[0].children[2].hasAttribute('data-remove-me')).toBe(
          false
        )
        expect(elements[0].children[2].tabIndex).toBe(99)

        lastChildren.forEach((lastChild, index) =>
          expect(elements[0].children[index]).toBe(lastChild)
        )
      }
    },
    {
      content: 'removed',
      test: ([text]) => {
        expect(text.textContent).toBe('removed')
      }
    }
  ])
})

test('attach/remove DOM event handler', async () => {
  let clicks = 0

  const handler = () => (clicks += 1)

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

test('diff style-object properties', async () => {
  await testUpdates([
    {
      content: <div style={{ color: 'red', backgroundColor: 'blue' }} />,
      test: ([div]) => {
        expect(div.style.color).toBe('red')
        expect(div.style.backgroundColor).toBe('blue')
      }
    },
    {
      content: <div style={{ color: 'yellow', fontSize: '99px' }} />,
      test: ([div]) => {
        expect(div.style.color).toBe('yellow')
        expect(div.style.backgroundColor).toBe('')
        expect(div.style.fontSize).toBe('99px')
      }
    },
    {
      content: <div />,
      test: ([div]) => {
        expect(div.style.color).toBe('')
      }
    }
  ])
})
