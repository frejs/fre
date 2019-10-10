import { createElement, updateElement } from './dom'
import { resetCursor } from './hooks'
import { scheduleCallback, shouldYeild } from './scheduler'

const options = {}
export const [HOST, HOOK, ROOT, SVG, PLACE, UPDATE, DELETE] = [0, 1, 2, 3, 4, 5, 6]

let WIP = null
let pendingCommit = null
let currentFiber = null

function render (vnode, node, done) {
  let rootFiber = {
    tag: ROOT,
    node,
    props: { children: vnode },
    done
  }
  scheduleWork(rootFiber)
}

function scheduleWork (fiber, up) {
  fiber.updating = up
  WIP = fiber
  scheduleCallback(performWork)
}

function performWork () {
  while (WIP && !shouldYeild()) {
    WIP = performWIP(WIP)
  }

  if (pendingCommit) {
    commitWork(pendingCommit)
    return null
  }

  return performWork.bind(null)
}

function performWIP (WIP) {
  WIP.patches = []
  WIP.parentNode = getParentNode(WIP)
  WIP.tag == HOOK ? updateHOOK(WIP) : updateHost(WIP)
  if (WIP.child) return WIP.child
  while (WIP) {
    completeWork(WIP)
    if (WIP.sibling) return WIP.sibling
    WIP = WIP.parent
  }
}

function updateHOOK (WIP) {
  WIP.props = WIP.props || {}
  WIP.state = WIP.state || {}
  WIP.effect = {}
  currentFiber = WIP
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
  let p = fiber.parent
  if (!p) return null
  while (p.tag === HOOK) p = p.parent
  return p.node
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
      WIP.patches.push(oldFiber)
    }
  }

  let prevFiber = null
  let alternate = null

  for (const k in newFibers) {
    let newFiber = newFibers[k]
    let oldFiber = reused[k]

    if (oldFiber) {
      alternate = createFiber(oldFiber, { patchTag: UPDATE })
      newFiber.patchTag = UPDATE
      newFiber = merge(alternate, newFiber)
      newFiber.alternate = alternate
      if (shouldPlace(newFiber)) {
        newFiber.patchTag = PLACE
      }
    } else {
      newFiber = createFiber(newFiber, { patchTag: PLACE })
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
  if (WIP.updating) WIP.updating = false
}

function shouldPlace (fiber) {
  let p = fiber.parent
  if (p.tag === HOOK) return p.key && !p.updating
  return fiber.key
}

function completeWork (fiber) {
  let p = fiber.parent
  if (p) {
    p.patches = p.patches.concat(fiber.patches, [fiber])
  } else {
    pendingCommit = fiber
  }
}

function commitWork (WIP) {
  WIP.patches.forEach(p => {
    p.patches = p.parent.patches = []
    commit(p)
    applyRef(p)
    afterPaint(p)
  })
  WIP.done && WIP.done()
  WIP = pendingCommit = null
}

function applyRef (fiber) {
  let ref = fiber.ref || {}
  isFn(ref) ? ref(fiber.node) : (ref.current = fiber.node)
}

function afterPaint (fiber) {
  fiber.pending = fiber.pending || {}
  for (const k in fiber.effect) {
    const pending = fiber.pending[k]
    pending && pending()
    const after = fiber.effect[k]()
    after && (fiber.pending[k] = after)
  }
  fiber.effect = null
}

function commit (fiber) {
  let tag = fiber.patchTag
  let parent = fiber.parentNode
  let dom = fiber.node
  while (!dom) dom = fiber.child.node

  if (tag === DELETE) {
    parent.removeChild(dom)
    for (const k in fiber.pending) fiber.pending[k]()
    fiber.pending = null
  } else if (fiber.tag === HOOK) {
  } else if (tag === UPDATE) {
    updateElement(dom, fiber.alternate.props, fiber.props)
  } else {
    let point = fiber.insertPoint ? fiber.insertPoint.node : null
    let after = point ? point.nextSibling : parent.firstChild
    if (after === dom) return
    if (after === null && dom === parent.lastChild) return
    parent.insertBefore(dom, after)
  }
}

function createFiber (vnode, data) {
  data.tag = isFn(vnode.type) ? HOOK : HOST
  return merge(vnode, data)
}

function getWIP () {
  return currentFiber || {}
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

function merge (a, b) {
  let out = {}
  for (const i in a) out[i] = a[i]
  for (const i in b) out[i] = b[i]
  return out
}

const isFn = fn => typeof fn === 'function'

export { render, scheduleWork, getWIP, options }
