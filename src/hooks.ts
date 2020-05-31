import { scheduleWork, isFn, getCurrentFiber } from './reconciler'
import {
  DependencyList,
  Reducer,
  IFiber,
  Dispatch,
  SetStateAction,
  EffectCallback,
  HookTpes,
  RefObject,
  IEffect
} from './type'
let cursor = 0

export const resetCursor = () => {
  cursor = 0
}

export const useState = <T>(initState: T): [T, Dispatch<SetStateAction<T>>] => {
  return useReducer(null, initState)
}

export const useReducer = <S, A, Dependency = any>(
  reducer?: Reducer<S, A>,
  initState?: S
): [S, Dispatch<A>] => {
  const [hook, current]: [[S | A, Dependency], IFiber] = getHook<S>(cursor++)
  const setter = (value: A | Dispatch<A>) => {
    let newValue = reducer
      ? reducer((hook as [S, Dependency])[0], value as A)
      : isFn(value as Dispatch<A>)
      ? (value as Dispatch<A>)((hook as [A, Dependency])[0])
      : value
    if (newValue !== hook[0]) {
      ;(hook as [S | A | Dispatch<A> | void, Dependency])[0] = newValue
      scheduleWork(current)
    }
  }

  if (hook.length) {
    return [hook[0] as S, setter]
  } else {
    hook[0] = initState as S
    return [initState!, setter]
  }
}

export const useEffect = (cb: EffectCallback, deps?: DependencyList): void => {
  return effectImpl(cb, deps!, 'effect')
}

export const useLayout = (cb: EffectCallback, deps?: DependencyList): void => {
  return effectImpl(cb, deps!, 'layout')
}

const effectImpl = (
  cb: EffectCallback,
  deps: DependencyList,
  key: HookTpes
): void => {
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

export const useCallback = <T extends (...args: any[]) => void>(
  cb: T,
  deps?: DependencyList
): T => {
  return useMemo(() => cb, deps)
}

export const useRef = <T>(current: T): RefObject<T> => {
  return useMemo(() => ({ current }), [])
}

export const getHook = <S = Function | undefined, Dependency = any>(
  cursor: number
): [[S, Dependency], IFiber] => {
  const current: IFiber<any> = getCurrentFiber()
  let hooks =
    current.hooks || (current.hooks = { list: [], effect: [], layout: [] })
  if (cursor >= hooks.list.length) {
    hooks.list.push([] as IEffect)
  }
  return [(hooks.list[cursor] as unknown) as [S, Dependency], current]
}

export const isChanged = (a: DependencyList, b: DependencyList) => {
  return !a || b.some((arg, index) => arg !== a[index])
}
