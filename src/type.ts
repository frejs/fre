export type Ref = Function & { current: Node }

export type Vnode = {
  type?: Component & string
  props: Props
} & Props

export type Component = Function & {
  tag?: number
}

export type Props = Record<string, any> & {
  key?: string
  ref?: Ref
}

export type Fiber = {
  node: Dom & Point
  pnode?: Dom & Point
  done: Function
  dirty?: boolean | number
  props?: Props
  oldProps?: Props
  lastProps?: Props
  parent?: Fiber
  child?: Fiber
  sibling?: Fiber
  kids?: Record<string, Fiber>
  op?: number
  hooks?: Hooks
} & Vnode &
  Point

export type Point = {
  insertPoint?: Fiber
  lastFiber?: Fiber
}

export type Hooks = {
  list: Hook
  layout: Array<Function>
  effect: Array<Function>
}

export type Hook = Array<any>
export type Task = {
  callback?: Function
  startTime?: number
  dueTime: number
}

export type Heap = Array<Task>

export type Dom = HTMLElement | SVGAElement

export type Deps = (number | string | boolean)[] | null

export type Loader = {
  default: Function
} & Function
