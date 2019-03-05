import { h, render, useReducer } from '../../src'

function count(state, action) {
  switch (action.type) {
    case 'increment':
      return { count: state.count + 1 }
    case 'decrement':
      return { count: state.count - 1 }
  }
}

function sex(state, action) {
  switch (action.type) {
    case 'boy':
      return { sex: 'boy' }
    case 'girl':
      return { sex: 'girl' }
  }
}

function Counter() {
  const [counter, dispatch] = useReducer(count, { count: 0 })
  const [sexer, change] = useReducer(sex, { sex: 'boy' })
  return (
    <div>
      {counter.count}
      {sexer.sex}
      <button onClick={() => dispatch({ type: 'increment' })}>+</button>
      <button onClick={() => sexer.sex==='boy'?change({ type: 'girl' }):change({ type: 'boy' })}>x</button>
    </div>
  )
}

render(<Counter />, document.getElementById('root'))
