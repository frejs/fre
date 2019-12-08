import { h, render, useState } from '../src'

export function createSuspense(fn) {
  let pending = true
  let result = null
  let error = null
  let oldParams = null

  return params => {
    if (oldParams !== params) {
      pending = true
      oldParams = params
    }
    if (error) throw error
    if (pending) {
      throw fn(params).then(
        res => (result = res),
        err => (error = err)
      )
    }
    return result
  }
}

const useUser = createSuspense(pageSize =>
  fetch(`https://api.clicli.us/users?level=4&page=1&pageSize=${pageSize}`)
    .then(res => res.json())
    .then(params => params.users)
)

function App() {
  const [pageSize, setPageSize] = useState(1)
  const users = useUser(pageSize)

  return (
    <main>
      <div>
        <button onClick={() => setPageSize(pageSize + 1)}>
          Click {pageSize}
        </button>
      </div>
      {users.map(user => (
        <img
          src={`https://q1.qlogo.cn/g?b=qq&nk=${user.qq}&s=640`}
          style={{ height: '100px', margin: '10px' }}
        />
      ))}
    </main>
  )
}

render(<App />, document.getElementById('root'))
