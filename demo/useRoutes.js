import { h, render } from '../src'
import { useRoutes, push, A } from './use-routes'

function Home () {
  return (
    <div>
      <p>home</p>
      <button onClick={() => push('/home/jack')}>Go jack</button>
    </div>
  )
}

function User ({ id }) {
  return (
    <div>
      <A href='/'>Go home</A>
    </div>
  )
}

const routes = {
  '/': Home,
  '/home/:id': User
}

const App = () => useRoutes(routes)

render(<App />, document.getElementById('root'))
