import { h, render, useState } from '../src'
import { useRoutes, push, A } from './use-routes'

const routes = {
  '/': function () {
    return h('div', null,
      h('p', null, 'home'),
      h('button', {onClick: () => push('/home/jack')}, 'Go jack')
    )
  },

  // DOM structure is different, causes "NotFoundError: Node was not found" error
  '/home/:id': function ({id}) {
    return h('div', null,
      h('div', null, id),
      h('div', null, 'testing'),
      h('button', {onClick: () => push('/')}, 'Go home')
    )
  }
}

const App = () => useRoutes(routes)
render(h(App), document.getElementById('root'))

// function User ({ id }) {
//   return (
//     <div>
//       <button onClick={() => push('/home/jack')}>Go home</button>
//     </div>
//   )
// }

// const routes = {
//   '/': Home,
//   '/home/:id': User
// }

// const App = () => useRoutes(routes)
