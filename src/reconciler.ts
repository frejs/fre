import {
  IFiber,
  FreElement,
  ITaskCallback,
  FC,
  Attributes,
  HTMLElementEx,
  FreNode,
  FiberMap,
  IRef,
  IEffect,
  Option
} from './type'
import { createElement, updateElement } from './dom'
import { resetCursor } from './hooks'
import { scheduleCallback, shouldYeild, planWork } from './scheduler'
import { isArr } from './jsx'
export const options: Option = {}

let preCommit: IFiber | undefined
let currentFiber: IFiber
let WIP: IFiber | undefined
let updateQueue: IFiber[] = []
let commitQueue: IFiber[] = []

export function render(
  vnode: FreElement,
  node: Element | Document | DocumentFragment | Comment,
  done?: () => void
): void {
  let rootFiber = {
    node,
    props: { children: vnode },
    done
  } as IFiber
  scheduleWork(rootFiber)
}

export function scheduleWork(fiber: IFiber) {
  if (!fiber.dirty) {
    fiber.dirty = true
    updateQueue.push(fiber)
  }
  scheduleCallback(reconcileWork as ITaskCallback)
}

function reconcileWork(timeout: boolean): boolean | null | ITaskCallback {
  if (!WIP) WIP = updateQueue.shift()
  while (WIP && (!shouldYeild() || timeout)) {
    WIP = reconcile(WIP)
  }
  if (!timeout && WIP) {
    return reconcileWork.bind(null)
  }
  if (preCommit) commitWork(preCommit)
  return null
}

function reconcile(WIP: IFiber): IFiber | undefined {
  WIP.parentNode = getParentNode(WIP) as HTMLElementEx
  if (isFn(WIP.type)) {
    try {
      updateHook(WIP)
    } catch (e) {
      options.catchError && options.catchError(WIP, e)
    }
  } else {
    updateHost(WIP)
  }
  WIP.dirty = WIP.dirty ? false : 0
  commitQueue.push(WIP)
  WIP.oldProps = WIP.props

  if (WIP.child) return WIP.child
  while (WIP) {
    if (!preCommit && WIP.dirty === false) {
      preCommit = WIP
      return null
    }
    if (WIP.sibling) {
      return WIP.sibling
    }
    WIP = WIP.parent
  }
}

function updateHook<P = Attributes>(WIP: IFiber): void {
  currentFiber = WIP
  resetCursor()
  let children = (WIP.type as FC<P>)(WIP.props)
  reconcileChildren(WIP, children)
}

function updateHost(WIP: IFiber): void {
  if (!WIP.node) {
    if (WIP.type === 'svg') {
      WIP.tag = Flag.SVG
    }
    WIP.node = createElement(WIP) as HTMLElementEx
  }
  let p = WIP.parentNode || {}
  WIP.insertPoint = (p as HTMLElementEx).last || null
  ;(p as HTMLElementEx).last = WIP
  ;(WIP.node as HTMLElementEx).last = null
  reconcileChildren(WIP, WIP.props.children)
}

function getParentNode(fiber: IFiber): HTMLElement | undefined {
  while ((WIP = WIP.parent)) {
    if (!isFn(WIP.type)) return WIP.node
  }
}

function reconcileChildren(WIP: IFiber, children: FreNode): void {
  delete WIP.child
  const oldFibers = WIP.kids
  const newFibers = (WIP.kids = hashfy(children as IFiber))

  let reused = {}

  for (const k in oldFibers) {
    let newFiber = newFibers[k]
    let oldFiber = oldFibers[k]

    if (newFiber && newFiber.type === oldFiber.type) {
      reused[k] = oldFiber
    } else {
      oldFiber.op = Flag.DELETE
      commitQueue.push(oldFiber)
    }
  }

  let prevFiber: IFiber | null
  let alternate: IFiber | null

  for (const k in newFibers) {
    let newFiber = newFibers[k]
    let oldFiber = reused[k]

    if (oldFiber) {
      alternate = createFiber(oldFiber, Flag.UPDATE)
      newFiber = { ...alternate, ...newFiber }
      newFiber.lastProps = alternate.props
      if (shouldPlace(newFiber)) newFiber.op = Flag.PLACE
    } else {
      newFiber = createFiber(newFiber, Flag.PLACE)
    }

    newFibers[k] = newFiber
    newFiber.parent = WIP

    if (prevFiber) {
      prevFiber.sibling = newFiber
    } else {
      if (WIP.tag === Flag.SVG) {
        newFiber.tag = Flag.SVG
      }
      WIP.child = newFiber
    }
    prevFiber = newFiber
  }

  if (prevFiber) prevFiber.sibling = null
}

function shouldPlace(fiber: IFiber): string | boolean | undefined {
  let p = fiber.parent
  if (isFn(p.type)) return p.key && !p.dirty
  return fiber.key
}

function commitWork(fiber: IFiber): void {
  commitQueue.forEach(c => c.parent && commit(c))
  fiber.done && fiber.done()
  commitQueue.length = 0
  preCommit = null
  WIP = null
}

function commit(fiber: IFiber): void {
  const { op, parentNode, node, ref, hooks } = fiber
  if (op === Flag.NOWORK) return
  if (op === Flag.DELETE) {
    hooks && hooks.list.forEach(cleanup)
    cleanupRef(fiber.kids)
    while (isFn(fiber.type)) fiber = fiber.child
    parentNode.removeChild(fiber.node)
  } else if (isFn(fiber.type)) {
    if (hooks) {
      side(hooks.layout)
      planWork(() => side(hooks.effect))
    }
  } else if (op === Flag.UPDATE) {
    updateElement(node, fiber.lastProps, fiber.props)
  } else {
    let point = fiber.insertPoint ? fiber.insertPoint.node : null
    let after = point ? point.nextSibling : parentNode.firstChild
    if (after === node) return
    if (after === null && node === parentNode.lastChild) return
    parentNode.insertBefore(node, after)
  }
  refer(ref, node)
}

function createFiber(vnode: Partial<IFiber>, op: number): IFiber {
  if (isStr(vnode)) vnode = createText(vnode as string)
  return { ...vnode, op } as IFiber
}

function createText(s: string) {
  return { type: 'text', props: { s } }
}

const hashfy = <P>(c: IFiber<P>): FiberMap<P> => {
  const out: FiberMap<P> = {}
  isArr(c)
    ? c.forEach((v, i) =>
        isArr(v)
          ? v.forEach((vi, j) => (out[hs(i, j, vi.key)] = vi))
          : some(v) && (out[hs(i, null, v.key)] = v)
      )
    : some(c) && (out[hs(0, null, (c as any).key)] = c)
  return out
}

function refer(ref: IRef, dom?: HTMLElement): void {
  if (ref)
    isFn(ref) ? ref(dom) : ((ref as { current?: HTMLElement })!.current = dom)
}

function cleanupRef<P = Attributes>(kids: FiberMap<P>): void {
  for (const k in kids) {
    const kid = kids[k]
    refer(kid.ref, null)
    if (kid.kids) cleanupRef(kid.kids)
  }
}

function side(effects: IEffect[]) {
  effects.forEach(cleanup)
  effects.forEach(effect)
  effects.length = 0
}

export const getCurrentFiber = () => currentFiber || null

const effect = (e: IEffect): void => {
  const res = e[0](currentFiber)
  if (isFn(res)) e[2] = res
}

const cleanup = (e: IEffect): void => e[2] && e[2]()

export const isFn = (x: any): x is Function => typeof x === 'function'
export const isStr = (s: any): s is number | string =>
  typeof s === 'number' || typeof s === 'string'
export const some = (v: any) => v != null && v !== false && v !== true

const hs = (i: number, j: string | number | null, k?: string): string =>
  k != null && j != null
    ? '.' + i + '.' + k
    : j != null
    ? '.' + i + '.' + j
    : k != null
    ? '.' + k
    : '.' + i

export const enum Flag {
  NOWORK = 0,
  PLACE = 1,
  UPDATE = 2,
  DELETE = 3,
  SVG = 4,
  MEMO = 5,
  LAZY = 6,
  SUSPENSE = 7
}
