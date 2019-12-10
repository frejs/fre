/** @jsx h */
import { h, useState } from '../src/index'
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
