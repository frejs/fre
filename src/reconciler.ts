import { Fiber, Vnode, Ref, Dom, Options } from './type'
import { createElement, updateElement } from './dom'
import { resetCursor } from './hooks'
import { scheduleCallback, shouldYeild, planWork } from './scheduler'
import { isArr } from './jsx'

let preCommit: Fiber
let currentFiber: Fiber
let WIP: Fiber
let updateQueue: Array<Fiber> = []
let commitQueue: Array<Fiber> = []

export function render(vnode: Vnode, node: Dom, done: Function) {
  let rootFiber: Fiber = {
    node,
    props: { children: vnode },
    done
  }
  scheduleWork(rootFiber)
}

export function scheduleWork(fiber: Fiber) {
  if (!fiber.dirty && (fiber.dirty = true)) {
    updateQueue.push(fiber)
  }
  scheduleCallback(reconcileWork)
}

function reconcileWork(timeout: boolean) {
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

function reconcile(WIP: Fiber) {
  WIP.pnode = getParentNode(WIP)
  if (isFn(WIP.type)) {
    try {
      updateHook(WIP)
    } catch (e) {
      options.catchError && options.catchError(e, WIP)
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

function updateHook(WIP: Fiber) {
  if (
    WIP.type.tag === Flag.MEMO &&
    WIP.dirty == 0 &&
    !shouldUpdate(WIP.oldProps, WIP.props)
  ) {
    cloneChildren(WIP)
    return
  }
  currentFiber = WIP
  resetCursor()
  let children = WIP.type(WIP.props)
  reconcileChildren(WIP, children)
}

function updateHost(WIP: Fiber) {
  if (!WIP.node) {
    if (WIP.type === 'svg') {
      WIP.tag = Flag.SVG
    }
    WIP.node = createElement(WIP)
  }
  let p = WIP.pnode || ({} as Fiber)
  WIP.insertPoint = p.lastFiber || null
  p.lastFiber = WIP
  WIP.node.lastFiber = null
  reconcileChildren(WIP, WIP.props.children)
}

function getParentNode(WIP: Fiber) {
  while ((WIP = WIP.parent)) {
    if (!isFn(WIP.type)) return WIP.node
  }
}

function reconcileChildren(WIP: Fiber, children: Vnode['children']) {
  if (!children) return
  delete WIP.child
  const oldFibers = WIP.kids
  const newFibers = (WIP.kids = hashfy(children))

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

  let prevFiber: Fiber | null = null
  let alternate = null

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

function cloneChildren(WIP: Fiber) {
  if (!WIP.child) return
  let child = WIP.child
  let newChild = child
  newChild.op = Flag.NOWORK
  WIP.child = newChild
  newChild.parent = WIP
  newChild.sibling = null
}

function shouldUpdate<T extends Object>(a: T, b: T) {
  for (let i in a) if (!(i in b)) return true
  for (let i in b) if (a[i] !== b[i]) return true
  return false
}

function shouldPlace(fiber: Fiber) {
  let p = fiber.parent
  if (isFn(p.type)) return p.key && !p.dirty
  return fiber.key
}

function commitWork(fiber: Fiber) {
  commitQueue.forEach(c => c.parent && commit(c))
  fiber.done && fiber.done()
  commitQueue = []
  preCommit = null
  WIP = null
}

function commit(fiber: Fiber) {
  const { op, pnode, node, ref, hooks } = fiber
  if (op === Flag.NOWORK) {
  } else if (op === Flag.DELETE) {
    hooks && hooks.list.forEach(cleanup)
    cleanupRef(fiber.kids)
    while (isFn(fiber.type)) fiber = fiber.child
    pnode.removeChild(fiber.node)
  } else if (isFn(fiber.type)) {
    if (hooks) {
      hooks.layout.forEach(cleanup)
      hooks.layout.forEach(effect)
      hooks.layout = []
      planWork(() => {
        hooks.effect.forEach(cleanup)
        hooks.effect.forEach(effect)
        hooks.effect = []
      })
    }
  } else if (op === Flag.UPDATE) {
    updateElement(node as Dom, fiber.lastProps, fiber.props)
  } else {
    let point = fiber.insertPoint ? fiber.insertPoint.node : null
    let after = point ? point.nextSibling : pnode.firstChild
    if (after === node) return
    if (after === null && node === pnode.lastChild) return
    pnode.insertBefore(node, after)
  }
  refer(ref, node)
}

function createFiber(vnode: unknown, op: number) {
  if (isStr(vnode)) vnode = createText(vnode as string)
  return { ...(vnode as Vnode), op }
}

function createText(s: string) {
  return { type: 'text', props: { s } }
}

const hashfy = (c: Vnode['children']) => {
  const out = {}
  isArr(c)
    ? c.forEach((v, i) =>
        isArr(v)
          ? v.forEach((vi, j) => (out[hs(i, j, vi.key)] = vi))
          : some(v) && (out[hs(i, null, v.key)] = v)
      )
    : some(c) && (out[hs(0, null, (c as any).key)] = c)
  return out
}

function refer(ref: Ref, dom: Node) {
  if (ref) isFn(ref) ? ref(dom) : (ref!.current = dom)
}

function cleanupRef(kids: Record<string, Fiber>) {
  for (const k in kids) {
    const kid = kids[k]
    refer(kid.ref, null)
    if (kid.kids) cleanupRef(kid.kids)
  }
}

const cleanup = (e: Function) => e[2] && e[2]()

const effect = (e: Function) => {
  const res = e[0]()
  if (isFn(res)) e[2] = res
}

export const getCurrentFiber = () => currentFiber || null

export const isFn = (x: any): x is Function => typeof x === 'function'
export const isStr = (s: any): s is number | string =>
  typeof s === 'number' || typeof s === 'string'
export const some = (v: any) => v != null && v !== false && v !== true

const hs = (i: number, j: number, k: unknown) =>
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

export const options: Options = {}
