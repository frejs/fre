import { createElement, updateElement } from './dom'
import { resetCursor } from './hooks'
import { scheduleCallback, shouldYeild } from './scheduler'
import { createText } from './h'

export const options = {}
export const [HOST, SVG, HOOK, PLACE, UPDATE, DELETE, NOWOEK] = [
  0,
  1,
  2,
  3,
  4,
  5,
  6
]
export const isFn = fn => typeof fn === 'function'
const defer =
  typeof requestAnimationFrame === 'undefined'
    ? setTimeout
    : requestAnimationFrame

let preCommit = null
let currentFiber = null
let WIP = null
let updateQueue = []
let commitQueue = []

export function render(vnode, node, done) {
  let rootFiber = {
    tag: HOST,
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
    try {
      WIP = reconcile(WIP)
    } catch (e) {
      throw e
    }
  }
  if (!didout && WIP) {
    return reconcileWork.bind(null)
  }
  if (preCommit) commitWork(preCommit)
  return null
}

function reconcile(WIP) {
  WIP.parentNode = getParentNode(WIP)
  WIP.tag == HOOK ? updateHOOK(WIP) : updateHost(WIP)
  WIP.pendingProps = WIP.props
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
  const oldProps = WIP.pendingProps
  const newProps = WIP.props
  if (
    (WIP.dirty === false || WIP.dirty === null) &&
    !shouldUpdate(oldProps, newProps)
  ) {
    cloneChildren(WIP)
    return
  }
  currentFiber = WIP
  resetCursor()
  let children = WIP.type(newProps)
  if (!children.type) {
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
    if (fiber.tag < HOOK) return fiber.node
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
  WIP.dirty = WIP.dirty ? false : null
}

function cloneChildren(fiber) {
  if (!fiber.child) return

  let child = fiber.child
  let newChild = child
  newChild.op = NOWOEK
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
  if (p.tag === HOOK) return p.key && !p.dirty
  return fiber.key
}

function commitWork(fiber) {
  commitQueue.forEach(c => {
    if (c.parent) commit(c)
  })
  fiber.done && fiber.done()
  commitQueue = []
  preCommit = null
  WIP = null
}

function commit(fiber) {
  let op = fiber.op
  let parent = fiber.parentNode
  let dom = fiber.node
  let ref = fiber.ref
  if (op === NOWOEK) {
  } else if (op === DELETE) {
    fiber.hooks && fiber.hooks.list.forEach(e => e[2] && e[2]())
    cleanupRef(fiber.kids)
    while (fiber.tag === HOOK) fiber = fiber.child
    parent.removeChild(fiber.node)
  } else if (fiber.tag === HOOK) {
    if (fiber.hooks) {
      fiber.hooks.layout.forEach(cleanup)
      fiber.hooks.layout.forEach(effect)
      fiber.hooks.layout = []
      defer(() => {
        fiber.hooks.effect.forEach(cleanup)
        fiber.hooks.effect.forEach(effect)
        fiber.hooks.effect = []
      })
    }
  } else if (op === UPDATE) {
    updateElement(dom, fiber.lastProps, fiber.props)
  } else {
    let point = fiber.insertPoint ? fiber.insertPoint.node : null
    let after = point ? point.nextSibling : parent.firstChild
    if (after === dom) return
    if (after === null && dom === parent.lastChild) return
    parent.insertBefore(dom, after)
  }
  refer(ref, dom)
}

function createFiber(vnode, op) {
  return { ...vnode, op, tag: isFn(vnode.type) ? HOOK : HOST }
}

const arrayfy = arr => (!arr ? [] : arr.pop ? arr : [arr])

function hashfy(arr) {
  let out = {}
  let i = 0
  let j = 0
  arrayfy(arr).forEach(item => {
    if (item.pop) {
      item.forEach(item => {
        item.key
          ? (out['.' + i + '.' + item.key] = item)
          : (out['.' + i + '.' + j] = item) && j++
      })
      i++
    } else {
      item.key ? (out['.' + item.key] = item) : (out['.' + i] = item) && i++
    }
  })
  return out
}

const cleanup = e => e[2] && e[2]()
const effect = e => {
  const res = e[0]()
  if (isFn(res)) e[2] = res
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

export function getCurrentFiber() {
  return currentFiber || null
}
