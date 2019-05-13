import { h, render } from 'fre'
import { useRoutes, push } from 'use-routes'

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

export function A (props) {
  const { onClick: onclick, children } = props

  const onClick = e => {
    e.preventDefault()
    push(e.target.href)

    if (onclick) onclick(e)
  }

  return (
    <a {...props} onClick={onClick}>
      {children}
    </a>
  )
}

const App = () => useRoutes(routes)

render(<App />, document.getElementById('root'))
