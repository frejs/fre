import { h, render, useState } from '../../src'

const useUser = lazy(pageSize =>
  fetch(`https://api.clicli.us/users?level=4&page=1&pageSize=${pageSize}`)
    .then(res => res.json())
    .then(next => next.users)
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
