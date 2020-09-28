import { IFiber, FreElement, ITaskCallback, FC, Attributes, HTMLElementEx, FreNode, FiberMap, IRef, IEffect } from './type'
import { createElement, updateElement } from './dom'
import { resetCursor } from './hooks'
import { scheduleWork, shouldYield, schedule } from './scheduler'
import { isArr, createText } from './h'
import { invokeGuardedCallback, getCaughtError, clearCaughtError, registerErrorListener } from './errorUtil'

let preCommit: IFiber | undefined
let currentFiber: IFiber
let WIP: IFiber | undefined
let commits: IFiber[] = []

const microTask: IFiber[] = []

export const render = (vnode: FreElement, node: Node, done?: () => void): void => {
  const rootFiber = {
    node,
    props: { children: vnode },
    done,
  } as IFiber
  update(rootFiber)
  registerErrorListener();
}

export const update = (fiber?: IFiber) => {
  if (fiber && !fiber.lane) {
    fiber.lane = true
    microTask.push(fiber)
  }
  scheduleWork(reconcileWork as ITaskCallback)
}

const reconcileWork = (timeout: boolean): boolean | null | ITaskCallback => {
  if (!WIP) WIP = microTask.shift()
  while (WIP && (!shouldYield() || timeout)) {
    WIP = reconcile(WIP)
  }
  if (WIP && !timeout) {
    return reconcileWork.bind(null)
  }
  if (preCommit) commitWork(preCommit)
  return null
}

const reconcile = (WIP: IFiber): IFiber | undefined => {
  WIP.parentNode = getParentNode(WIP) as HTMLElementEx
  invokeGuardedCallback(() => {
    isFn(WIP.type) ? updateHook(WIP) : updateHost(WIP)
  });

  const error = getCaughtError();

  if (error) {
    // suspend 支持
    if (typeof error.error?.then === 'function') {
      WIP.lane = false
      WIP.hooks.list.forEach((h: any) => (h[3] ? (h[2] = 1) : h.length > 3 ? (h[2] = 2) : null))
      update(WIP)
    }
    // 后续如果有 ErrorBoundary 类似的接口支持，则可以将错误传进去处理
    clearCaughtError();
  }

  WIP.lane = WIP.lane ? false : 0
  WIP.parent && commits.push(WIP)

  if (WIP.child) return WIP.child
  while (WIP) {
    if (!preCommit && WIP.lane === false) {
      preCommit = WIP
      return null
    }
    if (WIP.sibling) return WIP.sibling
    WIP = WIP.parent
  }
}

const updateHook = <P = Attributes>(WIP: IFiber): void => {
  currentFiber = WIP
  resetCursor()
  let children = (WIP.type as FC<P>)(WIP.props)
  if (isStr(children)) children = createText(children as string)
  reconcileChildren(WIP, children)
}

const updateHost = (WIP: IFiber): void => {
  if (!WIP.node) {
    if (WIP.type === 'svg') {
      WIP.tag = Flag.SVG
    }
    WIP.node = createElement(WIP) as HTMLElementEx
  }
  const p = WIP.parentNode || {}
  WIP.insertPoint = (p as HTMLElementEx).last || null
  ;(p as HTMLElementEx).last = WIP
  ;(WIP.node as HTMLElementEx).last = null
  reconcileChildren(WIP, WIP.props.children)
}

const getParentNode = (WIP: IFiber): HTMLElement | undefined => {
  while ((WIP = WIP.parent)) {
    if (!isFn(WIP.type)) return WIP.node
  }
}

const reconcileChildren = (WIP: IFiber, children: FreNode): void => {
  delete WIP.child
  const oldFibers = WIP.kids
  const newFibers = (WIP.kids = hashfy(children as IFiber))

  const reused = {}

  for (const k in oldFibers) {
    const newFiber = newFibers[k]
    const oldFiber = oldFibers[k]

    if (newFiber && newFiber.type === oldFiber.type) {
      reused[k] = oldFiber
    } else {
      oldFiber.op = Flag.DELETE
      commits.push(oldFiber)
    }
  }

  let prevFiber: IFiber | null

  for (const k in newFibers) {
    let newFiber = newFibers[k]
    const oldFiber = reused[k]

    if (oldFiber) {
      oldFiber.op = Flag.UPDATE
      newFiber = { ...oldFiber, ...newFiber }
      newFiber.lastProps = oldFiber.props
      if (shouldPlace(newFiber)) newFiber.op = Flag.PLACE
    } else {
      newFiber.op = Flag.PLACE
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

const shouldPlace = (fiber: IFiber): string | boolean | undefined => {
  const p = fiber.parent
  if (isFn(p.type)) return p.key && !p.lane
  return fiber.key
}

const commitWork = (fiber: IFiber): void => {
  commits.forEach(commit)
  fiber.done?.()
  commits = []
  preCommit = null
  WIP = null
}

const commit = (fiber: IFiber): void => {
  const { op, parentNode, node, ref, hooks } = fiber
  if (op === Flag.DELETE) {
    hooks?.list.forEach(cleanup)
    cleanupRef(fiber.kids)
    while (isFn(fiber.type)) fiber = fiber.child
    parentNode.removeChild(fiber.node)
  } else if (isFn(fiber.type)) {
    if (hooks) {
      side(hooks.layout)
      schedule(() => side(hooks.effect))
    }
  } else if (op === Flag.UPDATE) {
    updateElement(node, fiber.lastProps, fiber.props)
  } else {
    const point = fiber.insertPoint ? fiber.insertPoint.node : null
    const after = point ? point.nextSibling : parentNode.firstChild
    if (after === node) return
    if (after === null && node === parentNode.lastChild) return
    parentNode.insertBefore(node, after)
  }
  refer(ref, node)
}

const hashfy = <P>(c: IFiber<P>): FiberMap<P> => {
  const out: FiberMap<P> = {}
  isArr(c)
    ? c.forEach((v, i) => (isArr(v) ? v.forEach((vi, j) => (out[hs(i, j, vi.key)] = vi)) : some(v) && (out[hs(i, null, v.key)] = v)))
    : some(c) && (out[hs(0, null, (c as any).key)] = c)
  return out
}

const refer = (ref: IRef, dom?: HTMLElement): void => {
  if (ref) isFn(ref) ? ref(dom) : ((ref as { current?: HTMLElement })!.current = dom)
}

const cleanupRef = <P = Attributes>(kids: FiberMap<P>): void => {
  for (const k in kids) {
    const kid = kids[k]
    refer(kid.ref, null)
    if (kid.kids) cleanupRef(kid.kids)
  }
}

const side = (effects: IEffect[]): void => {
  effects.forEach(cleanup)
  effects.forEach(effect)
  effects.length = 0
}

export const getCurrentFiber = () => currentFiber || null

const effect = (e: IEffect): void => (e[2] = e[0](currentFiber))
const cleanup = (e: IEffect): void => e[2]?.(currentFiber)

export const isFn = (x: any): x is Function => typeof x === 'function'
export const isStr = (s: any): s is number | string => typeof s === 'number' || typeof s === 'string'
export const some = (v: any) => v != null && v !== false && v !== true

const hs = (i: number, j: string | number | null, k?: string): string =>
  k != null && j != null ? '.' + i + '.' + k : j != null ? '.' + i + '.' + j : k != null ? '.' + k : '.' + i

export const enum Flag {
  NOWORK = 0,
  PLACE = 1,
  UPDATE = 2,
  DELETE = 3,
  SVG = 4,
}
