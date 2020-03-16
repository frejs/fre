declare module 'fre' {
  type Key = FreText

  interface RefObject<T> {
    current: T
  }

  type RefCallback<T> = {
    bivarianceHack(instance: T | null): void
  }['bivarianceHack']

  type Ref<T = any> = RefCallback<T> | RefObject<T> | null

  interface Attributes {
    key?: Key
    ref?: Ref
  }

  interface FunctionComponent<P extends Attributes = {}> {
    (props: P): FreElement<P> | null
  }

  interface FreElement<P extends Attributes = {}, T = string> {
    type: T
    props: P
  }

  type FreText = string | number

  type FreNode = FreText | FreElement | FreNode[] | boolean | null | undefined

  type SetStateAction<S> = S | ((prevState: S) => S)

  type Dispatch<A> = (value: A) => void

  type Reducer<S, A> = (prevState: S, action: A) => S

  type EffectCallback = () => void | (() => void | undefined)

  type DependencyList = ReadonlyArray<any>

  interface PropsWithChildren {
    children: FreNode
  }

  function createElement<P extends Attributes = {}>(
    type: string,
    props?: P,
    ...children: FreNode[]
  ): FreElement<P, string>

  function createElement<P extends Attributes = {}>(
    type: FunctionComponent<P>,
    props?: P,
    ...children: FreNode[]
  ): FreElement<P, FunctionComponent<P>>

  function h<P extends Attributes = {}>(
    type: string,
    props?: P,
    ...children: FreNode[]
  ): FreElement<P, string>

  function h<P extends Attributes = {}>(
    type: FunctionComponent<P>,
    props?: P,
    ...children: FreNode[]
  ): FreElement<P, FunctionComponent<P>>

  function Fragment(props: PropsWithChildren): FreElement

  function render(
    vnode: FreElement,
    node: Element | Document | DocumentFragment | Comment,
    done?: () => void
  ): void

  function useState<T>(initState: T): [T, Dispatch<SetStateAction<T>>]

  function useState<T = undefined>(): [
    T | undefined,
    Dispatch<SetStateAction<T>>
  ]

  function useReducer<S, A>(
    reducer: Reducer<S, A>,
    initState: S
  ): [S, Dispatch<A>]

  function useEffect(cb: EffectCallback, deps?: DependencyList): void

  function useLayoutEffect(effect: EffectCallback, deps?: DependencyList): void

  function useLayout(effect: EffectCallback, deps?: DependencyList): void

  function useMemo<T>(factory: () => T, deps?: DependencyList): T

  function useCallback<T extends (...args: any[]) => any>(
    callback: T,
    deps?: DependencyList
  ): T

  function useRef<T>(initialValue: T): RefObject<T>

  function useRef<T = undefined>(): RefObject<T | undefined>

  function memo<P extends Attributes = {}>(
    fn: FunctionComponent<P>
  ): FunctionComponent<P>
}
