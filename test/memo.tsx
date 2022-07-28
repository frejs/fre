import { h, memo } from '../src/index'
import { testUpdates } from './test-util'

export const memor = async t => {
    let update = 0
  const Component = memo(() => {
    update ++
    return <p>111</p>
  })

  await testUpdates([
    {
      content: <Component a={0}/>,
      test: ([p]) => {
        t.eq(update, 1)
      },
    },
    {
      content: <Component a={1}/>,
      test: ([p]) => {
        t.eq(update, 2)
      },
    },
  ])
}
