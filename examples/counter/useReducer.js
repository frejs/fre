import { h, render, useReducer } from '../../src'

const initialState = { count: 0 }

function reducer(state, action) {
  switch (action.type) {
    case 'increment':
      return { count: state.count + 1 }
    case 'decrement':
      return { count: state.count - 1 }
  }
}

function Counter() {
  const [state, dispatch] = useReducer(reducer, initialState)
  return (
    <div>
      {state.count}
      <button onClick={() => dispatch({ type: 'increment' })}>+</button>
    </div>
  )
}

render(<Counter />, document.getElementById('root'))
