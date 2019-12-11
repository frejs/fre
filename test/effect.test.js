/** @jsx h */
import { h, useLayout } from '../src/index'
import { testUpdates } from './test-util'

test('useLayout(f, [x]) should run on changes to x', async () => {
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
        expect(effects).toEqual(['effect 0'])
      }
    },
    {
      content: <Component deps={[1]} />,
      test: () => {
        expect(effects).toEqual(['cleanUp 0', 'effect 1'])
      }
    },
    {
      content: <Component deps={[1]} />,
      test: () => {
        expect(effects).toEqual([])
      }
    },
    {
      content: <div>removed</div>,
      test: () => {
        expect(effects).toEqual(['cleanUp 1'])
      }
    }
  ])
})

test('useEffect(f, []) should run only once', async () => {
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
        expect(effects).toEqual(['effect'])
      }
    },
    {
      content: <Component count={0} />,
      test: () => {
        expect(effects).toEqual([])
      }
    },
    {
      content: <div>removed</div>,
      test: () => {
        expect(effects).toEqual(['cleanUp'])
      }
    }
  ])
})

test('useLayout(f) should run every time', async () => {
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
        expect(effects).toEqual(['effect 0'])
      }
    },
    {
      content: <Component value={1} />,
      test: () => {
        expect(effects).toEqual(['cleanUp 0', 'effect 1'])
      }
    },
    {
      content: <Component value={2} />,
      test: () => {
        expect(effects).toEqual(['cleanUp 1', 'effect 2'])
        effects = [] // next time the Component will not rerender, we need clean here
      }
    },
    {
      content: <div>removed</div>,
      test: () => {
        expect(effects).toEqual(['cleanUp 2'])
      }
    }
  ])
})
