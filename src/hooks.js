import { scheduleWork, getWIP } from './reconciler'
let cursor = 0

function update (key, reducer, value) {
  const current = this ? this : getWIP()
  value = reducer ? reducer(current.state[key], value) : value
  current.state[key] = value
  scheduleWork(current, true)
}
export function resetCursor () {
  cursor = 0
}
export function useState (initState) {
  return useReducer(null, initState)
}
export function useReducer (reducer, initState) {
  let current = getWIP()
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
  let current = getWIP()
  let key = '$' + cursor
  current.effect = current.effect || {}
  current.effect[key] = useCallback(cb, inputs)
  cursor++
}

export function useCallback (cb, inputs) {
  return useMemo(() => cb, inputs)
}

export function useMemo (cb, inputs) {
  let current = getWIP()
  let isChange = inputs
    ? (current.oldInputs || []).some((v, i) => inputs[i] !== v)
    : true
  if (inputs && !inputs.length && !current.isMounted) {
    isChange = true
    current.isMounted = true
  }
  current.oldInputs = inputs

  return isChange || !current.isMounted ? (current.memo = cb()) : current.memo
}

export function useRef (current) {
  return { current }
}
