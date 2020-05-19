import { Flag, getCurrentFiber, jsx, useEffect, useState,options } from 'fre'
import { Component, Props, Loader,Fiber } from '../src/type'

options.catchError = (error:any,fiber:Fiber){
  if (!!error && typeof error.then === 'function') {
    // this is lazy Component, its parent is a Suspense Component
    fiber.parent.suspenders = fiber.parent.suspenders || []
    fiber.parent.suspenders.push(error)
  }
}

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
