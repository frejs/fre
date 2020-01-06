import { useEffect, useRef, useState, render, h } from '../../src'
// wouter's implement for fre https://github.com/molefrog/wouter/blob/master/use-location.js

export const useLocation = ({ base = '' } = {}) => {
  const [path, update] = useState(currentPathname(base))
  const prevPath = useRef(path)

  useEffect(() => {
    patchHistoryEvents()
    const checkForUpdates = () => {
      const pathname = currentPathname(base)
      prevPath.current !== pathname && update((prevPath.current = pathname))
    }

    const events = ['popstate', 'pushState', 'replaceState']
    events.map(e => addEventListener(e, checkForUpdates))
    checkForUpdates()

    return () => events.map(e => removeEventListener(e, checkForUpdates))
  }, [])
  const navigate = (to, replace) =>
    history[replace ? 'replaceState' : 'pushState'](0, 0, base + to)

  return [path, navigate]
}

let patched = 0

const patchHistoryEvents = () => {
  if (patched) return
  ['pushState', 'replaceState'].map(type => {
    const original = history[type]

    history[type] = function() {
      const result = original.apply(this, arguments)
      const event = new Event(type)
      event.arguments = arguments

      dispatchEvent(event)
      return result
    }
  })

  return (patched = 1)
}

const currentPathname = (base, path = location.pathname) =>
  !path.indexOf(base) ? path.slice(base.length) || '/' : path

const App = () => {
  const [location, setLocation] = useLocation()

  switch (location) {
    case '/':
      return <button onClick={() => setLocation('/user')}>go user</button>
    case '/user':
      return <button onClick={() => setLocation('/')}>go home</button>
  }
  return 404
}

render(<App />, document.body)
