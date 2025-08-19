import { update, isFn, useFiber, getBoundary } from './reconcile'
import {
  DependencyList,
  Reducer,
  Fiber,
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
  const [hook, current] = getSlot<HookReducer>(cursor++)
  if (hook.length === 0) {
    hook[0] = isFn(initState) ? initState() : initState
  }
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
  const [hook, current] = getSlot<HookEffect>(cursor++)
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
  const hook = getSlot<HookMemo>(cursor++)[0]
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

export const getSlot = <T extends HookList = HookList>(cursor: number) => {
  const current: Fiber = useFiber()
  const hooks =
    current.hooks || (current.hooks = { list: [], effect: [], layout: [] })
  if (cursor >= hooks.list.length) {
    hooks.list.push([] as any)
  }
  return [hooks.list[cursor], current] as unknown as [Partial<T>, Fiber]
}

export type ContextType<T> = {
  ({ value, children }: { value: T; children: FreNode }): FreNode
  initialValue: T
}

type SubscriberCb = () => void

export const createContext = <T>(value: T): ContextType<T> => {
  const C = ({ value, children }: { value: T; children: any }) => {
    const ref = useRef(value)
    const subs = useMemo(() => new Set<() => void>(), EMPTY_ARR)
    if (ref.current !== value) {
      ref.current = value
      subs.forEach(cb => cb())
    }
    return children
  }
  C.initialValue = value
  return C as ContextType<T>
}


export const useContext = <T>(ctx: ContextType<T>) => {
  const update = useReducer(null,null)[1] as SubscriberCb
  let subs: Set<SubscriberCb>

  useEffect(() => () => subs?.delete(update), EMPTY_ARR)

  const fiber = getBoundary(useFiber(), ctx)
  return fiber
    ? (subs = (fiber.hooks.list[1][0]).add(update),
      (fiber.hooks.list[0][0] as { current: T }).current)
    : ctx.initialValue
}

export const isChanged = (a: DependencyList | undefined, b: DependencyList) => {
  return (
    !a ||
    a.length !== b.length ||
    b.some((arg, index) => !Object.is(arg, a[index]))
  )
}
