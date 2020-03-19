import { scheduleWork, isFn, getCurrentFiber } from './reconciler'
import { getTime } from './scheduler'
let cursor = 0
export function useState(initState) {
  return useReducer(null, initState)
}

export function useReducer(reducer, initState) {
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
  if (hook[0]) {
    return [hook[0], setter]
  } else {
    hook[0] = initState
    return [initState, setter]
  }
}

export function useEffect(cb, deps) {
  return effectImpl(cb, deps, 'effect')
}

export function useLayout(cb, deps) {
  return effectImpl(cb, deps, 'layout')
}

function effectImpl(cb, deps, key) {
  let [hook, current] = getHook(cursor++)
  if (isChanged(hook[1], deps)) {
    hook[0] = useCallback(cb, deps)
    hook[1] = deps
    current.hooks[key].push(hook)
  }
}

export function useMemo(cb, deps) {
  let hook = getHook(cursor++)[0]
  if (isChanged(hook[1], deps)) {
    hook[1] = deps
    return (hook[0] = cb())
  }
  return hook[0]
}

export function useCallback(cb, deps) {
  return useMemo(() => cb, deps)
}

export function useRef(current) {
  return useMemo(() => ({ current }), [])
}

export function useContext(context, selector) {
  let [hook, current] = getHook(cursor++)
  const value = current.context[context.id]
  const selected = selector ? selector(value) : value
  if (selected == null) return defaultValue
  if (hook[0] !== selected) {
    hook[0] = selected
    return selected
  } else {
    return hook[0]
  }
}

let id = 0
export function createContext(defaultValue) {
  const context = {
    id: '@' + id++,
    defaultValue,
    Consumer(props, context) {
      return props.children(context)
    },
    Provider(props) {
      let current = getCurrentFiber()
      if (!current.context) current.context = {}
      current.context[context.id] = props.value
      return props.children
    }
  }
  return context
}

export function getHook(cursor) {
  const current = getCurrentFiber()
  let hooks =
    current.hooks || (current.hooks = { list: [], effect: [], layout: [] })
  if (cursor >= hooks.list.length) {
    hooks.list.push([])
  }
  return [hooks.list[cursor], current]
}

export function isChanged(a, b) {
  return !a || b.some((arg, index) => arg !== a[index])
}

export function resetCursor() {
  cursor = 0
}
