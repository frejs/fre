import { update, isFn, getCurrentFiber } from './reconcile'
import {
  DependencyList,
  Reducer,
  IFiber,
  Dispatch,
  SetStateAction,
  EffectCallback,
  RefObject,
  FreNode,
  HookList,
  HookEffect,
  HookReducer,
  HookMemo,
} from './type'

const EMPTY_ARR = []

let cursor = 0

export const resetCursor = () => {
  cursor = 0
}

export const useState = <T>(initState: T) => {
  return useReducer<T, SetStateAction<T>>(null, initState)
}

export const useReducer = <S, A>(
  reducer?: Reducer<S, A>,
  initState?: S
): [S, Dispatch<A>] => {
  const [hook, current] = getHook<HookReducer>(cursor++)
  if (hook.length === 0) {
    hook[0] = initState
    hook[1] = (value: A | Dispatch<A>) => {
      let v = reducer
        ? reducer(hook[0], value as any)
        : isFn(value)
        ? value(hook[0])
        : value
      if (hook[0] !== v) {
        hook[0] = v
        update(current)
      }
    }
  }
  return hook as Required<HookReducer>
}

export const useEffect = (cb: EffectCallback, deps?: DependencyList) => {
  return effectImpl(cb, deps!, 'effect')
}

export const useLayout = (cb: EffectCallback, deps?: DependencyList) => {
  return effectImpl(cb, deps!, 'layout')
}

const effectImpl = (
  cb: EffectCallback,
  deps: DependencyList,
  key: 'effect' | 'layout'
) => {
  const [hook, current] = getHook<HookEffect>(cursor++)
  if (isChanged(hook[1], deps)) {
    hook[0] = cb
    hook[1] = deps
    current.hooks[key].push(hook as Required<HookEffect>)
  }
}

export const useMemo = <S = Function>(
  cb: () => S,
  deps?: DependencyList
): S => {
  const hook = getHook<HookMemo>(cursor++)[0]
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

export const getHook = <T extends HookList = HookList>(cursor: number) => {
  const current: IFiber = getCurrentFiber()
  const hooks =
    current.hooks || (current.hooks = { list: [], effect: [], layout: [] })
  if (cursor >= hooks.list.length) {
    hooks.list.push([] as any)
  }
  return [hooks.list[cursor], current] as unknown as [Partial<T>, IFiber]
}

export type ContextType<T> = {
  ({ value, children }: { value: T; children: FreNode }): FreNode
  initialValue: T
}

type SubscriberCb = () => void

export const createContext = <T>(initialValue: T): ContextType<T> => {
  const contextComponent: ContextType<T> = ({ value, children }) => {
    const valueRef = useRef(value)
    const subscribers = useMemo(() => new Set<SubscriberCb>(), EMPTY_ARR)

    if (valueRef.current !== value) {
      valueRef.current = value
      subscribers.forEach((subscriber) => subscriber())
    }

    return children
  }
  contextComponent.initialValue = initialValue
  return contextComponent
}

export const useContext = <T>(contextType: ContextType<T>): T => {
  let subscribersSet: Set<Function>

  const triggerUpdate = useReducer(null, null)[1] as SubscriberCb

  useEffect(() => {
    return () => subscribersSet && subscribersSet.delete(triggerUpdate)
  }, EMPTY_ARR)

  let contextFiber = getCurrentFiber().parent
  while (contextFiber && contextFiber.type !== contextType) {
    contextFiber = contextFiber.parent
  }

  if (contextFiber) {
    const hooks = contextFiber.hooks.list as unknown as [
      [RefObject<T>],
      [Set<SubscriberCb>]
    ]
    const [[value], [subscribers]] = hooks

    subscribersSet = subscribers.add(triggerUpdate)

    return value.current
  } else {
    return contextType.initialValue
  }
}

export const isChanged = (a: DependencyList | undefined, b: DependencyList) => {
  return (
    !a ||
    a.length !== b.length ||
    b.some((arg, index) => !Object.is(arg, a[index]))
  )
}
