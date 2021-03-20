import { h } from './h'
import { dispatchUpdate, isFn, getCurrentFiber, LANE } from './reconciler'


export function lazy(loader) {
  let p
  let comp
  let err
  return function Lazy(props) {
    if (!p) {
      p = loader()
      p.then(
        exports => (comp = exports.default || exports),
        e => (err = e)
      )
    }

    if (err) throw err
    if (!comp) throw p
    return h(comp, props)
  }
}

export function Suspense(props) {
  const current = getCurrentFiber()
  return [props.children, (current.lane & LANE.SUSPENSE) && props.fallback]
}