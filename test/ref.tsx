import { h, useRef } from '../src/index'
import { testUpdates } from './test-util'

export const ref = async t => {
  const Component = () => {
    const ref = useRef('')

    ref.current = ref.current + 'x'

    return <p>{ref.current}</p>
  }

  await testUpdates([
    {
      content: <Component />,
      test: ([p]) => {
        t.eq(p.textContent, 'x')
      },
    },
    {
      content: <Component />,
      test: ([p]) => {
        t.eq(p.textContent, 'xx')
      },
    },
  ])
}

export const refer = async t => {
  let refs = []
  const Component = () => {
    const p = (dom) => {
      if (dom) {
        refs.push('ref')
      } else {
        refs.push('cleanup')
      }
    }
    const c = (dom) => {
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
        t.eq(refs, ['ref', 'ref2'])
        refs = []
      },
    },
    {
      content: <div>removed</div>,
      test: () => {
        t.eq(refs, ['cleanup2', 'cleanup'])
      },
    },
  ])
}