/** @jsx h */
import { h, useRef } from '../src/index'
import { testUpdates } from './test-util'

test('persist reference to any value', async () => {
  const Component = () => {
    const ref = useRef('')

    ref.current = ref.current + 'x'

    return <p>{ref.current}</p>
  }

  await testUpdates([
    {
      content: <Component />,
      test: ([p]) => {
        expect(p.textContent).toBe('x')
      }
    },
    {
      content: <Component />,
      test: ([p]) => {
        expect(p.textContent).toBe('xx')
      }
    }
  ])
})

test('refs with callback and clenups', async () => {
  let refs = []
  const Component = () => {
    const p = dom => {
      if (dom) {
        refs.push('ref')
      } else {
        refs.push('cleanup')
      }
    }
    const c = dom => {
      if (dom) {
        refs.push('ref2')
      } else {
        refs.push('cleanup2')
      }
    }
    return (
      <div ref={p}>
        <p ref={c}>before</p>
      </div>
    )
  }

  await testUpdates([
    {
      content: <Component />,
      test: () => {
        expect(refs).toEqual(['ref', 'ref2'])
        refs = [] // next time the Component will not rerender, we need clean here
      }
    },
    {
      content: <div>removed</div>,
      test: () => {
        expect(refs).toEqual(['cleanup', 'cleanup2'])
      }
    }
  ])
})
