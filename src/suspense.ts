import { Component, Props } from './type'
import { jsx } from './jsx'

export function lazy(loader: Component) {
  let p
  let component
  let error

  function Lazy(props: Props) {
    if (!p) {
      p = loader()
      p.then(
        exports => (component = exports.default || exports),
        e => (error = e)
      )
    }

    if (error) throw error
    if (!component) throw p

    return jsx(component, props)
  }
  return Lazy
}
