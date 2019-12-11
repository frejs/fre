/** @jsx h */
import { h, useState, useRef } from '../src/index'
import { testUpdates } from './test-util'

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
