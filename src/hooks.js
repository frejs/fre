import { scheduleWork, isFn, currentHook } from './reconciler'

let cursor = 0
export function resetCursor () {
  cursor = 0
}

export function useState (initState) {
  return useReducer(null, initState)
}

export function useReducer (reducer, initState) {
  const hook = getHook(cursor++)
  const current = currentHook

  function setter (value) {
    let newValue = reducer ? reducer(hook[0], value) : isFn(value) ? value(hook[0]) : value
    hook[0] = newValue
    scheduleWork(current, true)
  }

  if (hook.length) {
    return [hook[0], setter]
  } else {
    hook[0] = initState
    return [initState, setter]
  }
}

export function useEffect (cb, deps) {
  let hook = getHook(cursor++)
  if (isChanged(hook[1], deps)) {
    hook[0] = useCallback(cb, deps)
    hook[1] = deps
    currentHook.hooks.effect.push(hook)
  }
}

export function useMemo (cb, deps) {
  let hook = getHook(cursor++)
  if (isChanged(hook[1], deps)) {
    hook[1] = deps
    return (hook[0] = cb())
  }
  return hook[0]
}

export function useCallback (cb, deps) {
  return useMemo(() => cb, deps)
}

export function useRef (current) {
  return useMemo(() => ({ current }), [])
}

export function getHook (cursor) {
  let hooks = currentHook.hooks || (currentHook.hooks = { list: [], effect: [], cleanup: [] })
  if (cursor >= hooks.list.length) {
    hooks.list.push([])
  }
  return hooks.list[cursor] || []
}

function isChanged (a, b) {
  return !a || b.some((arg, index) => arg !== a[index])
}