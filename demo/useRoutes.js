import { h, render } from 'fre'
import { useRoutes, push, A } from 'use-routes'

const routes = {
  '/': () => (
    <div>
      <p>home</p>
      <button onClick={() => push('/home/jack')}>Go jack</button>
    </div>
  ),
  '/home/:id': ({ id }) => (
    <div>
      <p>{id}</p>
      <A href='/'>jack</A>
    </div>
  )
}

const App = () => useRoutes(routes)

render(<App />, document.getElementById('root'))
