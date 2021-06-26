import { h } from '../src/index'
import { test } from 'zora'
import { testUpdates } from './test-util'

test('reorder and reuse elements during key-based reconciliation of child-nodes', async (t) => {
  const states = [
    [1, 2, 3],
    [3, 1, 2], // shift right
    [1, 2, 3],
    [2, 3, 1], // shift left
    [1, 2, 3],
    [1, 3], // remove from middle
    [1, 2, 3],
    [2, 3], // remove first
    [1, 2, 3],
    [1, 2], // remove last
    [1, 2, 3],
    [3, 2, 1], // reverse order
  ]

  let lastChildren

  await testUpdates(
    states.map((state, stateNumber) => ({
      content: (
        <ul>
          {state.map((value) => (
            <li key={value}>{value}</li>
          ))}
        </ul>
      ),
      test: (elements) => {
        const children = [...elements[0].children]
        t.eq(children.map((el) => el.textContent), state.map((value) => '' + value), `diff => [${state}]`)

        if (stateNumber > 1) {
          const lastState = states[stateNumber - 1]
          state.forEach((value, index) => {
            const lastIndex = lastState.indexOf(value)
            if (lastIndex !== -1) {
              // t.eq(children[index], lastChildren[lastIndex], `${lastIndex} <= ${index}`)
            }
          })
        }

        lastChildren = children
      },
    }))
  )
})