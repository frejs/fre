import { scheduleWork, isFn, getCurrentFiber } from './reconciler'
import { DependencyList, Reducer, IFiber, Dispatch, SetStateAction, EffectCallback, HookTpes, RefObject, IEffect } from './type'
let cursor = 0

export const resetCursor = () => {
  cursor = 0
}

export const useState = <T>(initState: T): [T, Dispatch<SetStateAction<T>>] => {
  return useReducer(null, initState)
}

export const useReducer = <S, A>(reducer?: Reducer<S, A>, initState?: S): [S, Dispatch<A>] => {
  const [hook, current]: [any, IFiber] = getHook<S>(cursor++)
  hook[2] = divide(hook[2])
  if (hook[2] > 1) {
    // current.lane = 0
    hook[3] = false
    scheduleWork(current)
  } else {
    if (hook[3]) {
      hook[0] = initState
    } else {
      hook[0] = isFn(hook[1]) ? hook[1](hook[0]) : hook[1] || initState
    }
    if (typeof hook[3] === 'boolean') hook[3] = !hook[3]
  }
  return [
    hook[0] as S,
    (value: A | Dispatch<A>, priority: number = 2) => {
      hook[1] = reducer || value
      hook[2] = priority
      scheduleWork(current)
    },
  ]
}

export const useEffect = (cb: EffectCallback, deps?: DependencyList): void => {
  return effectImpl(cb, deps!, 'effect')
}

export const useLayout = (cb: EffectCallback, deps?: DependencyList): void => {
  return effectImpl(cb, deps!, 'layout')
}

const effectImpl = (cb: EffectCallback, deps: DependencyList, key: HookTpes): void => {
  let [hook, current] = getHook(cursor++)
  if (isChanged(hook[1], deps)) {
    hook[0] = useCallback(cb, deps)
    hook[1] = deps
    current.hooks[key].push(hook)
  }
}

export const useMemo = <S = Function>(cb: () => S, deps?: DependencyList): S => {
  let hook = getHook<S>(cursor++)[0]
  if (isChanged(hook[1], deps!)) {
    hook[1] = deps
    return (hook[0] = cb())
  }
  return hook[0]
}

export const useCallback = <T extends (...args: any[]) => void>(cb: T, deps?: DependencyList): T => {
  return useMemo(() => cb, deps)
}

export const useRef = <T>(current: T): RefObject<T> => {
  return useMemo(() => ({ current }), [])
}

export const getHook = <S = Function | undefined, Dependency = any>(cursor: number): [[S, Dependency], IFiber] => {
  const current: IFiber<any> = getCurrentFiber()
  let hooks = current.hooks || (current.hooks = { list: [], effect: [], layout: [] })
  if (cursor >= hooks.list.length) {
    hooks.list.push([] as IEffect)
  }
  return [(hooks.list[cursor] as unknown) as [S, Dependency], current]
}

export const isChanged = (a: DependencyList, b: DependencyList) => {
  return !a || b.some((arg, index) => arg !== a[index])
}

function divide(num) {
  let prime = [3, 2]
  for (let i = 0; i < prime.length; i++) {
    if (num % prime[i] === 0) {
      return num / prime[i]
    }
  }
}
