export type Key = FreText
export interface RefObject<T> {
  current: T
}

export type RefCallback<T> = {
  bivarianceHack(instance: T | null): void
}['bivarianceHack']
export type Ref<T = any> = RefCallback<T> | RefObject<T> | null

export interface Attributes extends Record<string, any> {
  key?: Key
  children?: FreNode
  ref?: Ref
}

export interface FC<P extends Attributes = {}> {
  (props: P): FreElement<P> | null
  fiber?: IFiber
  type?: string
  memo?: boolean
  shouldUpdate?: (newProps: P, oldProps: P) => boolean
}

export interface FreElement<P extends Attributes = any, T = string> {
  type: T
  props: P
  key: string
}

export type HookTypes = 'list' | 'effect' | 'layout'

export interface IHook {
  list: IEffect[]
  layout: IEffect[]
  effect: IEffect[]
}

export type IRef = (
  e: HTMLElement | undefined
) => void | { current?: HTMLElement }

export interface IFiber<P extends Attributes = any> {
  key?: string
  type: string | FC<P>
  parentNode: HTMLElementEx
  node: HTMLElementEx
  kids?: any
  dirty: boolean
  parent?: IFiber<P>
  sibling?: IFiber<P>
  child?: IFiber<P>
  ref?: Ref<HTMLElement | undefined>
  hooks: IHook
  action: any
  props: P
  lane: number
  isComp: boolean
}

export type HTMLElementEx = HTMLElement & { last: IFiber | null }
export type IEffect = [Function?, number?, cleanup?: Function]

export type FreText = string | number
export type FreNode =
  | FreText
  | FreElement
  | FreNode[]
  | boolean
  | null
  | undefined
export type SetStateAction<S> = S | ((prevState: S) => S)
export type Dispatch<A> = (value: A) => void
export type Reducer<S, A> = (prevState: S, action: A) => S
export type EffectCallback = () => void | (() => void | undefined)
export type DependencyList = ReadonlyArray<unknown>

export interface PropsWithChildren {
  children?: FreNode
}

export type ITaskCallback = (() => ITaskCallback) | null

export interface ITask {
  callback?: ITaskCallback
}

export type DOM = HTMLElement | SVGElement
