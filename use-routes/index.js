import { h, useState } from '../../src'
let stack = {}
let prepared = {}

export function useRoutes (routes) {
  const [rid] = useState(Math.random().toString())
  const setter = useState(0)[1]

  let stackObj = stack[rid]

  if (!stackObj) {
    stackObj = {
      routes: Object.entries(routes),
      setter
    }

    stack[rid] = stackObj
    process(rid)
  }

  return typeof stackObj.component === 'string'
    ? push(stackObj.component)
    : stackObj.component(stackObj.props)
}

function process (rid) {
  const { routes, setter } = stack[rid]
  const currentPath = location.pathname || '/'

  let path, component, props

  for (let i = 0; i < routes.length; i++) {
    ;[path, component] = routes[i]
    const [reg, group] = prepared[path] ? prepared[path] : preparedRoute(path)

    const result = currentPath.match(reg)
    if (!result) {
      component = () => {}
      continue
    }

    if (group.length) {
      props = {}
      group.forEach((item, index) => (props[item] = result[index + 1]))
    }

    break
  }

  Object.assign(stack[rid], {
    path,
    component,
    props
  })

  setter(Date.now())
}

function preparedRoute (route) {
  if (prepared[route]) return prepared[route]
  const prepare = [
    new RegExp(
      `${route.substr(0, 1) === '*' ? '' : '^'}${route
        .replace(/:[a-zA-Z]+/g, '([^/]+)')
        .replace(/\*/g, '')}${route.substr(-1) === '*' ? '' : '$'}`
    )
  ]

  const props = route.match(/:[a-zA-Z]+/g)
  prepare.push(props ? props.map(name => name.substr(1)) : [])

  prepared[route] = prepare
  return prepare
}

export function push (url) {
  window.history.pushState(null, null, url)
  processStack()
}

const processStack = () => Object.keys(stack).forEach(process)

window.addEventListener('popstate', processStack)

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
