import { Flag, getCurrentFiber } from './reconciler'
import { Component, Props, Loader } from './type'
import { jsx } from './jsx'
import { useEffect, useState } from './hooks'

export function lazy(loader: Component) {
  let p: Promise<Loader>
  let comp: Component
  let err: Error

  function Lazy(props: Props) {
    if (!p) {
      p = loader()
      p.then(
        exports => (comp = exports.default || exports),
        e => (err = e)
      )
    }

    if (err) throw err
    if (!comp) throw p

    return jsx(comp, props)
  }
  Lazy.tag = Flag.LAZY
  return Lazy
}

export function Suspense(props) {
  const current = getCurrentFiber()
  const [vdom, setVdom] = useState(null)
  useEffect(
    () =>
      current.suspenders.forEach(s =>
        s.then(c => setVdom(jsx(c.default || c, null)))
      ),
    []
  )
  return [props.children, !vdom && props.fallback]
}
