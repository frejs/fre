import { render, Fragment, h, useState } from '../../src/index'

function View() {
  const [key, setKey] = useState([])
  const modifyList = () => {
    const array = []
    for (let i = 0; i <10000; i++) {
      array.push(1)
    }
    setKey(array)
  }
  return (
    <div className="row-view">
      <div onClick={modifyList}>Modify List {key.length}</div>
      <ul>
        {key.map((item, index) => {
          return <li key={index}>{item}</li>
        })}
      </ul>
    </div>
  )
}
render(<View />, document.getElementById('app'))