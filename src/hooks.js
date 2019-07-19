import { scheduleWork, getWIP } from './reconciler'
let cursor = 0

function update(key, reducer, value) {
  const current = this ? this : getWIP()
  value = reducer ? reducer(current.state[key], value) : value
  current.state[key] = value
  scheduleWork(current)
}
export function resetCursor() {
  cursor = 0
}
export function useState(initState) {
  return useReducer(null, initState)
}
export function useReducer(reducer, initState) {
  let current = getWIP()
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

export function useEffect(cb, inputs) {
  let current = getWIP()
  if (current) current.effect = useMemo(cb, inputs)
}

export function useMemo(cb, inputs) {
  return () => {
    let current = getWIP()
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

export function createContext(init = {}) {
  let context = init
  let set = {}
  const update = context => {
    for (let key in set) set[key](context)
  }
  const subscribe = (fn, name) => {
    if(name in set) return
    set[name] = fn
  }

  return { context, update, subscribe, set }
}

export function useContext(ctx) {
  const [context, setContext] = useState(ctx.context)
  const name = getWIP().type.name
  ctx.subscribe(setContext, name)
  return [context, ctx.update]
}
