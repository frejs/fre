import { h, render, useReducer } from '../../src'

function d(state, action) {
  switch (action.type) {
    case 'clear':
      return { data: [] }
    case 'create':
      return { data: [1, 2, 3] }
  }
}

function Counter() {
  const [data, dispatch] = useReducer(d, { data: [] })

  return (
    <div>
      <button onClick={() => dispatch({ type: 'create' })}>-</button>
      <ul>
        {data.data.map(item => {
          const val = <p>hello</p>
          return (
            <li>
              {item}
              {val}
            </li>
          )
        })}
      </ul>
    </div>
  )
}

render(<Counter />, document.getElementById('root'))
