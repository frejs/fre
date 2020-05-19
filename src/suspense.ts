import { Component, Props, Loader } from './type'
import { jsx } from './jsx'

export function lazy(loader: Component) {
  let p:Promise<Loader>
  let comp:Component
  let err:Error

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
  return Lazy
}
