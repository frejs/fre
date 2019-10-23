import { createElement, updateElement } from './dom'
import { resetCursor } from './hooks'
import { scheduleCallback, shouldYeild } from './scheduler'

export const options = {}
export const [ROOT, HOST, HOOK, SVG, PLACE, UPDATE, DELETE, NOWORK] = [0, 1, 2, 3, 4, 5, 6, 7]

let preCommit = null
let currentHook = null
export let WIP = null

export function render (vnode, node, done) {
  let rootFiber = {
    tag: ROOT,
    node,
    props: { children: vnode },
    done
  }
  scheduleWork(rootFiber)
}

export function scheduleWork (fiber, lock) {
  fiber.lock = lock
  WIP = fiber
  scheduleCallback(performWork)
}

function performWork (didout) {
  while (WIP && (!shouldYeild() || didout)) {
    WIP = performWIP(WIP)
  }
  if (preCommit) {
    commitWork(preCommit)
    return null
  }
  if (!didout) return performWork.bind(null)
  return null
}

function performWIP (WIP) {
  WIP.parentNode = getParentNode(WIP)
  WIP.tag == HOOK ? updateHOOK(WIP) : updateHost(WIP)
  if (WIP.child) return WIP.child
  while (WIP) {
    if (!WIP.parent) preCommit = WIP
    if (WIP.sibling && WIP.lock == null) return WIP.sibling
    WIP = WIP.parent
  }
}

function updateHOOK (WIP) {
  WIP.props = WIP.props || {}
  WIP.state = WIP.state || {}
  WIP.effect = {}
  WIP.memo = WIP.memo || {}
  WIP.__deps = WIP.__deps || { m: {}, e: {} }

  currentHook = WIP
  resetCursor()
  reconcileChildren(WIP, WIP.type(WIP.props))
}

function updateHost (WIP) {
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
function getParentNode (fiber) {
  while ((fiber = fiber.parent)) {
    if (fiber.tag < HOOK) return fiber.node
  }
}

function reconcileChildren (WIP, children) {
  const oldFibers = WIP.kids
  const newFibers = (WIP.kids = hashfy(children, WIP.kids))
  let reused = {}

  for (const k in oldFibers) {
    let newFiber = newFibers[k]
    let oldFiber = oldFibers[k]

    if (newFiber && newFiber.type === oldFiber.type) {
      reused[k] = oldFiber
    } else {
      oldFiber.patchTag = DELETE
      WIP.bastard = oldFiber
    }
  }

  let prevFiber = null
  let alternate = null

  for (const k in newFibers) {
    let newFiber = newFibers[k]
    let oldFiber = reused[k]

    if (oldFiber) {
      alternate = createFiber(oldFiber, UPDATE)
      newFiber.patchTag = UPDATE
      newFiber = { ...alternate, ...newFiber }
      newFiber.alternate = alternate
      if (shouldPlace(newFiber)) {
        newFiber.patchTag = PLACE
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
  WIP.lock = WIP.lock ? false : null
}

function shouldPlace (fiber) {
  let p = fiber.parent
  if (p.tag === HOOK) return p.key && !p.lock
  return fiber.key
}

function commitWork (fiber) {
  walk(fiber.child)
  fiber.done && fiber.done()
  WIP = null
  preCommit = null
}

function walk (fiber) {
  commit(fiber)
  if (fiber.bastard) {
    commit(fiber.bastard)
    fiber.bastard = null
  }

  if (fiber.child) walk(fiber.child)
  let node = fiber
  while (node) {
    if (node != fiber) break
    if (node.sibling) walk(node.sibling)
    node = node.parent
  }
}

function applyEffect (fiber) {
  fiber.pending = fiber.pending || {}
  for (const k in fiber.effect) {
    const pend = fiber.pending[k]
    pend && pend()
    const after = fiber.effect[k]()
    after && (fiber.pending[k] = after)
  }
  fiber.effect = null
}

function commit (fiber) {
  let tag = fiber.patchTag
  let parent = fiber.parentNode
  let dom = fiber.node
  let ref = fiber.ref

  if (tag === DELETE) {
    cleanup(fiber)
    while (fiber.tag === HOOK) fiber = fiber.child
    parent.removeChild(fiber.node)
  } else if (fiber.tag === HOOK || tag === NOWORK) {
    applyEffect(fiber)
  } else if (tag === UPDATE) {
    updateElement(dom, fiber.alternate.props, fiber.props)
  } else {
    let point = fiber.insertPoint ? fiber.insertPoint.node : null
    let after = point ? point.nextSibling : parent.firstChild
    if (after === dom) return
    if (after === null && dom === parent.lastChild) return
    parent.insertBefore(dom, after)
  }

  if (ref) isFn(ref) ? ref(dom) : (ref.current = dom)
}

function cleanup (fiber) {
  let pend = fiber.pending
  for (const k in pend) pend[k]()
  fiber.pending = null
}

function createFiber (vnode, tag) {
  vnode.tag = isFn(vnode.type) ? HOOK : HOST
  vnode.patchTag = tag
  return vnode
}

const arrayfy = arr => (!arr ? [] : arr.pop ? arr : [arr])

function hashfy (arr) {
  let out = {}
  let i = 0
  let j = 0
  arrayfy(arr).forEach(item => {
    if (item.pop) {
      item.forEach(item => {
        item.key ? (out['.' + i + '.' + item.key] = item) : (out['.' + i + '.' + j] = item) && j++
      })
      i++
    } else {
      item.key ? (out['.' + item.key] = item) : (out['.' + i] = item) && i++
    }
  })
  return out
}

const isFn = fn => typeof fn === 'function'

export function getHook () {
  return currentHook || {}
}
