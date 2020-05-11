import { scheduleWork, isFn, getCurrentFiber } from './reconciler'
import { Deps } from './type'
let cursor = 0

export function resetCursor() {
  cursor = 0
}

export function useState<T>(initState: T): [T, Function] {
  return useReducer(null, initState)
}

export function useReducer<T>(reducer: Function, initState: T): [T, Function] {
  const [hook, current] = getHook(cursor++)
  const setter = value => {
    let newValue = reducer
      ? reducer(hook[0], value)
      : isFn(value)
      ? value(hook[0])
      : value
    if (newValue !== hook[0]) {
      hook[0] = newValue
      scheduleWork(current)
    }
  }

  if (hook.length) {
    return [hook[0], setter]
  } else {
    hook[0] = initState
    return [initState, setter]
  }
}

export function useEffect(cb: Function, deps: Deps) {
  return effectImpl(cb, deps, 'effect')
}

export function useLayout(cb: Function, deps: Deps) {
  return effectImpl(cb, deps, 'layout')
}

function effectImpl(cb: Function, deps: Deps, key: string) {
  let [hook, current] = getHook(cursor++)
  if (isChanged(hook[1], deps)) {
    hook[0] = useCallback(cb, deps)
    hook[1] = deps
    current.hooks[key].push(hook)
  }
}

export function useMemo(cb: Function, deps: Deps) {
  let hook = getHook(cursor++)[0]
  if (isChanged(hook[1], deps)) {
    hook[1] = deps
    return (hook[0] = cb())
  }
  return hook[0]
}

export function useCallback(cb: Function, deps: Deps) {
  return useMemo(() => cb, deps)
}

export function useRef(current: any) {
  return useMemo(() => ({ current }), [])
}

export function getHook(cursor: number) {
  const current = getCurrentFiber()
  let hooks =
    current.hooks || (current.hooks = { list: [], effect: [], layout: [] })
  if (cursor >= hooks.list.length) {
    hooks.list.push([])
  }
  return [hooks.list[cursor], current]
}

export function isChanged(a: Deps, b: Deps) {
  return !a || b.some((arg, index: number) => arg !== a[index])
}
