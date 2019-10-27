import { h, render, useState, useEffect } from '../../src'
import { useSuspense } from './use-suspense'

function fetchUsers (num) {
  console.log('fetch users from clicli...')
  return fetch('https://api.clicli.us/users?level=4&page=1&pageSize=' + num)
    .then(res => res.json())
    .then(data => {
      return data.users
    })
}

const result = useSuspense(fetchUsers)

function App () {
  const [state, setState] = useState(1)
  const users = result.read(state)
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
