import { h, render, useReducer } from '../src'

function d (state, action) {
  switch (action.type) {
    case 'clear':
      return { data: [] }
    case 'create':
      return { data: [1, 2] }
  }
}

function Counter () {
  const [data, dispatch] = useReducer(d, { data: [1, 2] })
  return (
    <div>
      <button onClick={() => dispatch({ type: 'clear' })}>-</button>
      <ul>
        {data.data.map(item => (
          <li>{item}</li>
        ))}
      </ul>
    </div>
  )
}

render(<Counter />, document.getElementById('root'))
