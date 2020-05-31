import { h, useState, useEffect, options } from '../dist/fre.esm'
const SUSPENSE = 9
let oldCatchError = options.catchError
options.catchError = (fiber, error) => {
  if (!!error && typeof error.then === 'function') {
    fiber.tag = SUSPENSE
    fiber.promises = fiber.promises || []
    fiber.promises.push(error)
    //
  } else oldCatchError(fiber, error)
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
    return h(comp, props)
  }
}

export function Suspense(props) {
  const [suspend, setSuspend] = useState(false)
  useEffect(current => {
    Promise.all(current.promises).then(() => setSuspend(true))
  }, [])
  return [props.children, !suspend && props.fallback]
}
