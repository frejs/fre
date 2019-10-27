import { h, render, useState } from '../../src'
import { createFetch } from './use-suspense'

function fetchUsers (size) {
  console.log('fetch users from clicli...')
  return fetch(`https://api.clicli.us/users?level=4&page=1&pageSize=${size}`)
    .then(res => res.json())
    .then(data => {
      return data.users
    })
}

const { useFetch } = createFetch(fetchUsers)

function App () {
  const [state, setState] = useState(1)
  const users = useFetch(state)

  return (
    <main>
      <h1>Fetching clicli users</h1>
      <button onClick={() => setState(state + 1)}>Click {state}</button>
      {users.map(user => (
        <img src={`https://q1.qlogo.cn/g?b=qq&nk=${user.qq}&s=640`} />
      ))}
    </main>
  )
}

render(<App />, document.getElementById('root'))
