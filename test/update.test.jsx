/** @jsx h */
import { h, useState, useRef } from '../src/index'
import { testUpdates } from './test-util'

test('async state update', async done => {
  let updates = 0

  const Component = () => {
    const [count, setState] = useState(0)

    updates += 1

    return <button onClick={() => setState(count => count + 1)}>{count}</button>
  }

  const content = <Component />

  await testUpdates([
    {
      content,
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
      content,
      test: ([button]) => {
        expect(+button.textContent).toBe(3) // all 3 state updates applied
        expect(updates).toBe(2)
        done()
      }
    }
  ])
})

test('persist reference to any value', async done => {
  const Component = () => {
    const ref = useRef('')

    ref.current = ref.current + 'x'

    return <p>{ref.current}</p>
  }

  const content = <Component />

  await testUpdates([
    {
      content,
      test: ([p]) => {
        expect(p.textContent).toBe('x')
      }
    },
    {
      content,
      test: ([p]) => {
        expect(p.textContent).toBe('x')
        done()
      }
    }
  ])
})

test('persist reference to any value', async () => {
  const Component = () => {
    const ref = useRef('')

    ref.current = ref.current + 'x'

    return <p>{ref.current}</p>
  }

  const content = <Component />

  await testUpdates([
    {
      content,
      test: ([p]) => {
        expect(p.textContent).toBe('x')
      }
    },
    {
      content,
      test: ([p]) => {
        expect(p.textContent).toBe('x')
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
