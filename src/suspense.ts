import { IFiber, EffectCallback } from './type'
import { jsx } from './jsx'
import { useState, useEffect } from './hooks'
import { getCurrentFiber } from './reconciler'

export function catchPromise(WIP: IFiber, e: Function) {
  WIP.parent.promises = WIP.parent.promises || []
  WIP.parent.promises.push(e as any)
}

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
    return jsx(comp, props)
  }
}

export function Suspense(props) {
  const [suspend, setSuspend] = useState(false)
  const current = getCurrentFiber()
  const cb = () => {
    Promise.all(current.promises).then(c => setSuspend(true))
  }
  useEffect(cb as EffectCallback, [])
  return [props.children, !suspend && props.fallback]
}
