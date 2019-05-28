import { scheduleWork, getCurrentFiber } from './reconciler'
let cursor = 0

function update (key, reducer, value) {
  const current = this ? this : getCurrentFiber()
  value = reducer ? reducer(current.state[key], value) : value
  current.state[key] = value
  scheduleWork(current)
}
export function resetCursor () {
  cursor = 0
}
export function useState (initState) {
  return useReducer(null, initState)
}
export function useReducer (reducer, initState) {
  let current = getCurrentFiber()
  if (!current) return [initState, setter]
  let key = '$' + cursor
  let setter = update.bind(current, key, reducer)
  cursor++
  let state = current.state || {}
  if (key in state) {
    return [state[key], setter]
  } else {
    current.state[key] = initState
    return [initState, setter]
  }
}

export function useEffect (cb, inputs) {
  let current = getCurrentFiber()
  if (current) current.effect = useMemo(cb, inputs)
}

export function useMemo (cb, inputs) {
  return () => {
    let current = getCurrentFiber()
    if (current) {
      let hasChaged = inputs
        ? (current.oldInputs || []).some((v, i) => inputs[i] !== v)
        : true
      if (inputs && !inputs.length && !current.isMounted) {
        hasChaged = true
        current.isMounted = true
      }
      if (hasChaged) cb()
      current.oldInputs = inputs
    }
  }
}

export function createContext (initContext = {}) {
  let context = initContext
  let setters = []
  const update = newContext => setters.forEach(fn => fn(newContext))
  const subscribe = fn => setters.push(fn)
  const unSubscribe = fn => (setters = setters.filter(f => f !== fn))
  
  return { context, update, subscribe, unSubscribe }
}

export function useContext (ctx) {
  const [context, setContext] = useState(ctx.context)

  ctx.subscribe(setContext)
  useEffect(() => ctx.unSubscribe(setContext))

  return [context, ctx.update]
}
