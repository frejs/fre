import { createElement, updateElement } from './dom'
import { resetCursor } from './hooks'
import { scheduleCallback, shouldYeild } from './scheduler'

const options = {}
export const [HOST, HOOK, ROOT, SVG, PLACE, UPDATE, DELETE] = [0, 1, 2, 3, 4, 5, 6]

let nextWork = null
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
  fiber.up = up
  nextWork = fiber
  scheduleCallback(performWork)
}

function performWork () {
  while (nextWork && !shouldYeild()) {
    nextWork = performNext(nextWork)
  }

  if (pendingCommit) {
    commitWork(pendingCommit)
    return null
  }

  return performWork.bind(null)
}

function performNext (WIP) {
  WIP.parentNode = getParentNode(WIP)
  WIP.patches = []
  WIP.tag == HOOK ? updateHOOK(WIP) : updateHost(WIP)
  if (WIP.child) return WIP.child
  while (WIP) {
    completeWork(WIP)
    if (WIP.sibling) return WIP.sibling
    WIP = WIP.parent
  }
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

function updateHOOK (WIP) {
  WIP.props = WIP.props || {}
  WIP.state = WIP.state || {}
  currentFiber = WIP
  resetCursor()
  reconcileChildren(WIP, WIP.type(WIP.props))
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
      if (shouldPlace(newFiber)) newFiber.patchTag = PLACE
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
}

function createFiber (vnode, data) {
  data.tag = typeof vnode.type === 'function' ? HOOK : HOST
  return merge(vnode, data)
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
    traverse(p.effect)
  })
  WIP.done && WIP.done()
  nextWork = pendingCommit = null
}

function applyRef (fiber) {
  let ref = fiber.ref || null
  if (ref) ref.current = fiber.node
}

function traverse (fns) {
  for (const k in fns) {
    const fn = fns[k]
    fn()
  }
}

function shouldPlace (fiber) {
  let p = fiber.parent
  if (p.tag === HOOK) {
    return p.key && !p.up
  }
  return fiber.key
}
function commit (fiber) {
  let tag = fiber.patchTag
  let parent = fiber.parentNode
  let dom = fiber.node
  while (!dom) dom = fiber.child.node

  if (tag === DELETE) {
    parent.removeChild(dom)
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

function getWIP () {
  return currentFiber || {}
}

const arrayfy = arr => (!arr ? [] : arr.pop ? arr : [arr])

function hashfy (arr) {
  let out = {}
  let i = 0
  let j = 0
  arrayfy(arr).forEach(item => {
    let key = item.key
    if (item.pop) {
      item.forEach(item => {
        let key = item.key
        key ? (out['.' + i + '.' + key] = item) : (out['.' + i + '.' + j] = item) && j++
      })
      i++
    } else {
      key ? (out['.' + key] = item) : (out['.' + i] = item) && i++
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

export { render, scheduleWork, getWIP, options }
