import { scheduleWork, getWIP } from './reconciler'
let cursor = 0

function update (key, reducer, value) {
  const wip = this ? this : getWIP()
  value = reducer ? reducer(wip.state[key], value) : value
  wip.state[key] = value
  scheduleWork(wip, true)
}
export function resetCursor () {
  cursor = 0
}
export function useState (initState) {
  return useReducer(null, initState)
}
export function useReducer (reducer, initState) {
  let wip = getWIP()
  let key = '$' + cursor
  let setter = update.bind(wip, key, reducer)
  cursor++
  let state = wip.state || {}
  if (key in state) {
    return [state[key], setter]
  } else {
    wip.state[key] = initState
    return [initState, setter]
  }
}

export function useEffect (cb, deps) {
  let wip = getWIP()
  if (isChanged(wip._deps, deps)) {
    let key = '$' + cursor
    wip.effect = {}
    wip.effect[key] = useCallback(cb, deps)
    cursor++
    wip._deps = deps
    wip._cb = cb
  }
}

export function useCallback (cb, deps) {
  return useMemo(() => cb, deps)
}

export function useMemo (cb, deps) {
  let wip = getWIP()
  if (isChanged(wip._deps, deps)) {
    wip._deps = deps
    wip._cb = cb
    return (wip._memo = cb())
  }
  return wip._memo
}

export function useRef (current) {
  return { current }
}

function isChanged (a, b) {
  return !a || b.some((arg, index) => arg !== a[index])
}
