import { h, useLayout } from '../src/index'
import { testUpdates } from './test-util'

export const empty = async t => {
  let effects = []

  const effect = value => {
    effects.push(`effect ${value}`)

    return () => {
      effects.push(`cleanUp ${value}`)
    }
  }

  const Component = ({ deps }) => {
    useLayout(() => effect(deps[0]), deps)
    effects = []

    return <div>foo</div>
  }

  await testUpdates([
    {
      content: <Component deps={[0]} />,
      test: () => {
        t.eq(effects, ['effect 0'])
      }
    },
    {
      content: <Component deps={[1]} />,
      test: () => {
        t.eq(effects, ['cleanUp 0', 'effect 1'])
      }
    },
    {
      content: <Component deps={[1]} />,
      test: () => {
        t.eq(effects, [])
      }
    },
    {
      content: <div>removed</div>,
      test: () => {
        t.eq(effects, ['cleanUp 1'])
      }
    }
  ])
}