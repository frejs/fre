import { h, render, useReducer } from '../src'

function d (state, action) {
  switch (action.type) {
    case 'clear':
      return { data: [1] }
    case 'create':
      return { data: [1, 2, 3] }
  }
}

function Counter () {
  const [data, dispatch] = useReducer(d, { data: [1,2,3] })
  return (
    <div>
      <button onClick={() => dispatch({ type: 'clear' })}>-</button>
      <ul>
        {data.data.map(item => (
          <A item={item} key={item} />
        ))}
      </ul>
    </div>
  )
}

function A (props) {
  return <li>{props.item}</li>
}

render(<Counter />, document.getElementById('root'))
