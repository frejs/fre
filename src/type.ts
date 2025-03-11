export type Key = FreText
export interface RefObject<T> {
  current: T
}
export interface RefCallback<T> {
  (instance: T | null): void
}
export type Ref<T = any> = RefCallback<T> | RefObject<T> | null

export interface IntrinsicAttributes extends Record<string, any> {
  key?: Key
  ref?: Ref
  children?: FreNode
}

export interface Attributes extends Record<string, any> {
  key?: Key
  ref?: Ref
  children?: IFiber[]
}

export interface FC<P extends IntrinsicAttributes = IntrinsicAttributes> {
  (props: P): IFiber | FreText | null | undefined
  fiber?: IFiber
  type?: string
  memo?: boolean
  shouldUpdate?: (newProps: P, oldProps: P) => boolean
}

export interface Hooks {
  list: HookList[]
  layout: HookEffect[]
  effect: HookEffect[]
}
export type HookList = HookMemo | HookEffect | HookReducer
export type HookMemo<V = any> = [value: V, deps: DependencyList]
export type HookEffect = [
  cb: EffectCallback,
  deps: DependencyList,
  cleanup?: () => any
]
export type HookReducer<V = any, A = any> = [value: V, dispatch: Dispatch<A>]

export type FiberFinish = FiberHostFinish | FiberCompFinish
type FiberHostFinish = FiberBaseFinish &
  FiberHost & {
    node: HTMLElementEx
    parentNode: HTMLElementEx
  }
type FiberCompFinish = FiberBaseFinish &
  FiberComp & {
    node: undefined
    parentNode: undefined
  }

interface FiberBaseFinish extends FiberBase {
  kids?: FiberFinish[]
  parent?: FiberFinish
  sibling?: FiberFinish
  child?: FiberFinish
  old?: FiberFinish
}

export type IFiber = FiberHost | FiberComp | FiberBase

export interface FiberHost extends FiberBase {
  type?: string
  props: PropsOf<string>
  isComp: false
}

export interface FiberComp extends FiberBase {
  type: FC
  props: PropsOf<FC>
  isComp: true
}

export type PropsOf<T extends FC | string> = T extends FC<infer P>
  ? P
  : T extends string
  ? Attributes
  : never

interface FiberBase {
  key?: string
  type?: string | FC
  props?: PropsOf<FC | string>
  isComp?: boolean
  parentNode?: HTMLElementEx | {}
  node?: HTMLElementEx
  kids?: IFiber[]
  dirty?: boolean
  parent?: IFiber
  sibling?: IFiber
  child?: IFiber
  ref?: Ref<HTMLElement | undefined>
  old?: IFiber
  hooks?: Hooks
  action?: Action | null
  lane?: number
}

export interface Action {
  op: TAG
  elm?: IFiber
  before?: IFiber
}

export const enum TAG {
  UPDATE = 1 << 1,
  INSERT = 1 << 2,
  REMOVE = 1 << 3,
  SVG = 1 << 4,
  DIRTY = 1 << 5,
  MOVE = 1 << 6,
  REPLACE = 1 << 7,
}

export type HTMLElementEx = HTMLElement | Text | SVGElement

export type FreText = string | number
export type FreNode = Child[] | Child
export type Child = IFiber | FreText | null | undefined | boolean
export type SetStateAction<S> = S | ((prevState: S) => S)
export type Dispatch<A> = (value: A) => void
export type Reducer<S, A> = (prevState: S, action: A) => S
export type EffectCallback = () => any | (() => () => any)
export type DependencyList = ReadonlyArray<unknown>

export type ITaskCallback = (() => ITaskCallback) | null | undefined

export interface ITask {
  callback?: ITaskCallback
}
