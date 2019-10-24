import { h, render, useState, useEffect } from '../src'

function Counter () {
  const [vdom, setVdom] = useState(<div className='foo1' />)
  useEffect(() => {
    console.log([...document.getElementById('root').childNodes][0])
  })
  return (
    <div>
      {vdom}
      <button onClick={() => setVdom(<div className='foo2' />)}>-</button>
    </div>
  )
}

render(<Counter />, document.getElementById('root'))
