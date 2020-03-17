import { h, render, useState, useEffect } from '../../src'

const source = createMutableSource(window, () => window.location.href)

const getSnapshot = window => window.location.pathname
const subscribe = (window, callback) => {
  window.addEventListener('popstate', callback)
  return () => window.removeEventListener('popstate', callback)
}

function App() {
  const pathName = useMutableSource(source, getSnapshot, subscribe)
  return <h1>{pathName}</h1>
}

render(<App />, document.body)

export function createMutableSource(source, version) {
  return {
    version,
    source
  }
}

export function useMutableSource(mutation, snapshot, subscribe) {
  const { source, version } = mutation
  const [snap, setSnap] = useState(snapshot(source))
  useEffect(() => {
      const callback = () => {
          setSnap(snapshot(source))
      }
    const unSubsubscribe = subscribe(source, callback)
    return unSubsubscribe
  }, [version])
  return snap
}
