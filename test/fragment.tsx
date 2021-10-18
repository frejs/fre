import { h, useState, Fragment } from '../src/index'
import { testUpdates } from './test-util'

export const fragment = async (t) => {
  const Component = () => {
    const [state, setState] = useState(true)
    return <>
      <button onClick={() => setState(!state)}>change</button>
      {state ? <span>0</span> : <a>none</a>}
    </>
  }

  await testUpdates([
    {
      content: <Component />,
      test: ([button, span]) => {
        t.eq(button.tagName, 'BUTTON')
        t.eq(span.tagName, 'SPAN')
        button.click()
      },
    },
    {
      content: <Component />,
      test: ([button, a]) => {
        t.eq(button.tagName, 'BUTTON')
        t.eq(a.tagName, 'A')
      },
    },
  ])
}
