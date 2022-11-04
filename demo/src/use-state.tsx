import { render, useState, h, useEffect } from '../../src/index'

function App() {
  const [list, setList] = useState([1, 2, 3])
  return (
    <div>
      {list.map((d) => (
        <span>{d}</span>
      ))}{' '}
      <button onClick={() => setList(list.concat(4))}>+</button>
    </div>
  )
}

render(<App />, document.getElementById('app'))
