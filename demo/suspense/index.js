import { h, render, useState } from '../../src'
import { createResource } from './dogApi'
const resource = createResource()
function App () {
  const [state, setState] = useState(1)
  const users = resource.read(state)
  const handler = () => setState(state + 1)
  return (
    <main>
      <h1>Fetching clicli users</h1>
      <button onClick={handler}>Click {state}</button>
      {users.map(user => (
        <img alt='woof' src={`https://q1.qlogo.cn/g?b=qq&nk=${user.qq}&s=640`} />
      ))}
    </main>
  )
}

render(<App />, document.getElementById('root'))
