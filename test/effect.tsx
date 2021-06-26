import { h, useLayout } from '../src/index'
import { testUpdates } from './test-util'

export const change = async t => {
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

export const once = async (t) => {
  let effects = []

  const effect = () => {
    effects.push(`effect`)

    return () => {
      effects.push(`cleanUp`)
    }
  }

  const Component = () => {
    effects = []
    useLayout(effect, [])

    return <div>foo</div>
  }

  await testUpdates([
    {
      content: <Component />,
      test: () => {
        t.eq(effects, ['effect'])
      }
    },
    {
      content: <Component count={0} />,
      test: () => {
        t.eq(effects, [])
      }
    },
    {
      content: <div>removed</div>,
      test: () => {
        t.eq(effects, ['cleanUp'])
      }
    }
  ])
}

export const every = async t => {
  let effects = []

  const effect = value => {
    effects.push(`effect ${value}`)

    return () => {
      effects.push(`cleanUp ${value}`)
    }
  }

  const Component = ({ value }) => {
    effects = []
    useLayout(() => effect(value))

    return <div>foo</div>
  }

  await testUpdates([
    {
      content: <Component value={0} />,
      test: () => {
        t.eq(effects, ['effect 0'])
      }
    },
    {
      content: <Component value={1} />,
      test: () => {
        t.eq(effects, ['cleanUp 0', 'effect 1'])
      }
    },
    {
      content: <Component value={2} />,
      test: () => {
        t.eq(effects, ['cleanUp 1', 'effect 2'])
        effects = [] // next time the Component will not rerender, we need clean here
      }
    },
    {
      content: <div>removed</div>,
      test: () => {
        t.eq(effects, ['cleanUp 2'])
      }
    }
  ])
}