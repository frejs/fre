import { dispatchUpdate, isFn, getCurrentFiber } from './reconciler'
import { DependencyList, Reducer, IFiber, Dispatch, SetStateAction, EffectCallback, HookTypes, RefObject, IEffect } from './type'
let cursor = 0

export const resetCursor = () => {
  cursor = 0
}

export const useState = <T>(initState: T): [T, Dispatch<SetStateAction<T>>] => {
  return useReducer(null, initState)
}

export const useReducer = <S, A>(reducer?: Reducer<S, A>, initState?: S): [S, Dispatch<A>] => {
  const [hook, current]: [any, IFiber] = getHook<S>(cursor++)
  console.log(hook[2] && hook[2].toString(2))

  if (hook[2] & (1 << 3 >> 3)) {
    hook[0] = initState
    hook[2] = 0b1100
  } else if (hook[2] & (1 << 3 >> 2)) {
    console.log(hook[2].toString(2))
    hook[2] = 0b1000
  } else {
    hook[0] = isFn(hook[1]) ? hook[1](hook[0]) : hook[1] || initState
  }
  return [
    hook[0] as S,
    (action: A | Dispatch<A>) => {
      hook[1] = reducer ? reducer(hook[0], action as A) : action
      hook[2] = reducer && (action as any).type[0] === '*' ? 0b1100 : 0b1000
      dispatchUpdate(current)
    },
  ]
}

export const useEffect = (cb: EffectCallback, deps?: DependencyList): void => {
  return effectImpl(cb, deps!, 'effect')
}

export const useLayout = (cb: EffectCallback, deps?: DependencyList): void => {
  return effectImpl(cb, deps!, 'layout')
}

const effectImpl = (cb: EffectCallback, deps: DependencyList, key: HookTypes): void => {
  const [hook, current] = getHook(cursor++)
  if (isChanged(hook[1], deps)) {
    hook[0] = useCallback(cb, deps)
    hook[1] = deps
    current.hooks[key].push(hook)
  }
}

export const useMemo = <S = Function>(cb: () => S, deps?: DependencyList): S => {
  const hook = getHook<S>(cursor++)[0]
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
  const hooks = current.hooks || (current.hooks = { list: [], effect: [], layout: [] })
  if (cursor >= hooks.list.length) {
    hooks.list.push([] as IEffect)
  }
  return [(hooks.list[cursor] as unknown) as [S, Dependency], current]
}

export const isChanged = (a: DependencyList, b: DependencyList) => {
  return !a || a.length !== b.length || b.some((arg, index) => arg !== a[index])
}
