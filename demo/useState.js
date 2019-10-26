import { h, render, useState } from '../src'

function Counter () {
  const [data] = useState(['a','b'])
  var num = <p>hello</p>

  return (
    <div>
      {data.map(item => {
        console.log(num)
        return (
          <li key={item}>
            {item}
            {num}
          </li>
        )
      })}
    </div>
  )
}

render(<Counter />, document.getElementById('root'))
