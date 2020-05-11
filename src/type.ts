export type Ref = Function | { current: HTMLElement }

export type Vnode =
  | {
      type?: Function | string
      props: Props
    }
  | string

export type Component = Function & {
  tag: number
}

export type Props = Record<string, unknown> & {
  key?: string
  ref?: Ref
}

export type Fiber = {
  node: HTMLElement
  pnode?: HTMLElement
  done: Function
  dirty?: boolean | number
  props?: Props
  oldProps?: Props
  parent?: Fiber
  child?: Fiber
  sibling?: Fiber
} & Vnode

export type Task = {
  callback?: Function
  startTime?: number
  dueTime: number
}

export type Heap = Array<Task>
