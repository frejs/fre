import { createElement, updateElement } from './dom'
import { resetCursor } from './hooks'
import { scheduleCallback, shouldYeild, planWork } from './scheduler'
import { createText, isArr, isStr, MEMO } from './h'

const NOWORK = 0
const PLACE = 1
const UPDATE = 2
const DELETE = 3

export const SVG = 4

let preCommit = null
let currentFiber = null
let WIP = null
let updateQueue = []
let commitQueue = []

export function render(vnode, node, done) {
  let rootFiber = {
    node,
    props: { children: vnode },
    done
  }
  scheduleWork(rootFiber)
}

export function scheduleWork(fiber) {
  if (!fiber.dirty && (fiber.dirty = true)) {
    updateQueue.push(fiber)
  }
  scheduleCallback(reconcileWork)
}

function reconcileWork(didout) {
  if (!WIP) WIP = updateQueue.shift()
  while (WIP && (!shouldYeild() || didout)) {
    WIP = reconcile(WIP)
  }
  if (!didout && WIP) {
    return reconcileWork.bind(null)
  }
  if (preCommit) commitWork(preCommit)
  return null
}

function reconcile(WIP) {
  WIP.parentNode = getParentNode(WIP)
  isFn(WIP.type) ? updateHOOK(WIP) : updateHost(WIP)
  WIP.dirty && (WIP.dirty = false)
  WIP.oldProps = WIP.props
  commitQueue.push(WIP)

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

function updateHOOK(WIP) {
  if (
    WIP.type.tag === MEMO &&
    WIP.dirty === false &&
    !shouldUpdate(WIP.oldProps, WIP.props)
  ) {
    cloneChildren(WIP)
    return
  }
  if (WIP.parent && WIP.parent.context) {
    WIP.context = WIP.parent.context
  }
  currentFiber = WIP
  resetCursor()
  let children = WIP.type(WIP.props)
  if (isStr(children)) {
    children = createText(children)
  }
  reconcileChildren(WIP, children)
}

function updateHost(WIP) {
  if (!WIP.node) {
    if (WIP.type === 'svg') WIP.tag = SVG
    WIP.node = createElement(WIP)
  }
  let p = WIP.parentNode || {}
  WIP.insertPoint = p.last || null
  p.last = WIP
  WIP.node.last = null
  reconcileChildren(WIP, WIP.props.children)
}

function getParentNode(fiber) {
  while ((fiber = fiber.parent)) {
    if (!isFn(fiber.type)) return fiber.node
  }
}

function reconcileChildren(WIP, children) {
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
      oldFiber.op = DELETE
      commitQueue.push(oldFiber)
    }
  }

  let prevFiber = null
  let alternate = null

  for (const k in newFibers) {
    let newFiber = newFibers[k]
    let oldFiber = reused[k]

    if (oldFiber) {
      alternate = createFiber(oldFiber, UPDATE)
      newFiber.op = UPDATE
      newFiber = { ...alternate, ...newFiber }
      newFiber.lastProps = alternate.props
      if (shouldPlace(newFiber)) {
        newFiber.op = PLACE
      }
    } else {
      newFiber = createFiber(newFiber, PLACE)
    }

    newFibers[k] = newFiber
    newFiber.parent = WIP

    if (prevFiber) {
      prevFiber.sibling = newFiber
    } else {
      if (WIP.tag === SVG) newFiber.tag = SVG
      WIP.child = newFiber
    }
    prevFiber = newFiber
  }

  if (prevFiber) prevFiber.sibling = null
}

function cloneChildren(fiber) {
  if (!fiber.child) return
  let child = fiber.child
  let newChild = child
  newChild.op = NOWORK
  fiber.child = newChild
  newChild.parent = fiber
  newChild.sibling = null
}

function shouldUpdate(a, b) {
  for (let i in a) if (!(i in b)) return true
  for (let i in b) if (a[i] !== b[i]) return true
  return false
}

function shouldPlace(fiber) {
  let p = fiber.parent
  if (isFn(p.type)) return p.key && !p.dirty
  return fiber.key
}

function commitWork(fiber) {
  commitQueue.forEach(c => c.parent && commit(c))
  fiber.done && fiber.done()
  commitQueue = []
  preCommit = null
  WIP = null
}

function commit(fiber) {
  const { op, parentNode, node, ref, hooks } = fiber
  if (op === NOWORK) {
  } else if (op === DELETE) {
    hooks && hooks.list.forEach(cleanup)
    cleanupRef(fiber.kids)
    while (isFn(fiber.type)) fiber = fiber.child
    parentNode.removeChild(fiber.node)
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
  } else if (op === UPDATE) {
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

function createFiber(vnode, op) {
  return { ...vnode, op }
}

const hashfy = c => {
  const out = {}
  isArr(c)
    ? c.forEach((v, i) =>
        isArr(v)
          ? v.forEach((vi, j) => (out[hs(i, j, vi.key)] = vi))
          : (out[hs(i, null, v.key)] = v)
      )
    : (out[hs(0, null, c.key)] = c)
  return out
}

function refer(ref, dom) {
  if (ref) isFn(ref) ? ref(dom) : (ref.current = dom)
}

function cleanupRef(kids) {
  for (const k in kids) {
    const kid = kids[k]
    refer(kid.ref, null)
    if (kid.kids) cleanupRef(kid.kids)
  }
}

const cleanup = e => e[2] && e[2]()

const effect = e => {
  const res = e[0]()
  if (isFn(res)) e[2] = res
}

export const getCurrentFiber = () => currentFiber || null

export const isFn = fn => typeof fn === 'function'

const hs = (i, j, k) =>
  k != null && j != null
    ? '.' + i + '.' + k
    : j != null
    ? '.' + i + '.' + j
    : k != null
    ? '.' + k
    : '.' + i
