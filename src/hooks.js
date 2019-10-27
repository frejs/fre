import { scheduleWork, getHook, isFn } from './reconciler'

let cursor = 0

export function resetCursor () {
  cursor = 0
}

export function useState (initState) {
  return useReducer(null, initState)
}

export function useReducer (reducer, initState) {
  let wip = getHook()
  let key = getKey()

  function setter (value) {
    let newValue = reducer ? reducer(wip.state[key], value) : isFn(value) ? value(wip.state[key]) : value
    wip.state[key] = newValue
    scheduleWork(wip, true)
  }

  if (key in wip.state) {
    return [wip.state[key], setter]
  } else {
    wip.state[key] = initState
    return [initState, setter]
  }
}

export function useEffect (cb, deps) {
  let wip = getHook()
  let key = getKey()
  if (isChanged(wip.__deps.e[key], deps)) {
    wip.effect[key] = useCallback(cb, deps)
    wip.__deps.e[key] = deps
  }
}

export function useMemo (cb, deps) {
  let wip = getHook()
  let key = getKey()
  if (isChanged(wip.__deps.m[key], deps)) {
    wip.__deps.m[key] = deps
    return (wip.memo[key] = cb())
  }
  return wip.memo[key]
}

export function useCallback (cb, deps) {
  return useMemo(() => cb, deps)
}

export function useRef (current) {
  return useMemo(() => ({ current }), [])
}

function isChanged (a, b) {
  return !a || b.some((arg, index) => arg !== a[index])
}

function getKey () {
  let key = '$' + cursor
  cursor++
  return key
}
