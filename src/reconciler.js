import { createElement, updateElement } from './dom'
import { resetCursor } from './hooks'
import { defer, hashfy, merge, isSame, isFn } from './util'

const options = {}
const FPS = 1000 / 60
const [HOST, HOOK, ROOT, PLACE, REPLACE, UPDATE, DELETE] = [0, 1, 2, 3, 4, 5, 6]

let updateQueue = []
let nextWork = null
let pendingCommit = null
let currentFiber = null

function render (vnode, el) {
  let rootFiber = {
    tag: ROOT,
    base: el,
    props: { children: vnode }
  }
  scheduleWork(rootFiber)
}

function scheduleWork (fiber) {
  updateQueue.push(fiber)
  if (!nextWork) {
    nextWork = updateQueue.shift()
    defer(workLoop)
  }
}

function workLoop (startTime = 0) {
  if (startTime && performance.now() - startTime > FPS) {
    defer(workLoop)
  } else {
    const nextTime = performance.now()
    nextWork = performWork(nextWork)
    if (nextWork) {
      workLoop(nextTime)
    } else {
      options.commitWork
        ? options.commitWork(pendingCommit)
        : commitWork(pendingCommit)
    }
  }
}

function performWork (WIP) {
  WIP.tag == HOOK ? updateHOOK(WIP) : updateHost(WIP)
  if (WIP.child) return WIP.child
  while (WIP) {
    completeWork(WIP)
    if (WIP.sibling) return WIP.sibling
    WIP = WIP.parent
  }
}

function updateHost (WIP) {
  if (!options.end && !WIP.base) {
    WIP.base = createElement(WIP)
  }

  let parent = WIP.parent || {}
  WIP.insertPoint = parent.oldPoint
  parent.oldPoint = WIP

  const children = WIP.props.children
  reconcileChildren(WIP, children)
}

function updateHOOK (WIP) {
  WIP.props = WIP.props || {}
  WIP.state = WIP.state || {}
  currentFiber = WIP
  resetCursor()
  const children = WIP.type(WIP.props)
  reconcileChildren(WIP, children)
  currentFiber.patches = WIP.patches
}
function fiberize (children, WIP) {
  return (WIP.children = hashfy(children, WIP.children))
}

function reconcileChildren (WIP, children) {
  const oldFibers = WIP.children
  const newFibers = fiberize(children, WIP)
  let reused = {}

  for (let k in oldFibers) {
    let newFiber = newFibers[k]
    let oldFiber = oldFibers[k]

    if (newFiber && isSame(newFiber, oldFiber)) {
      reused[k] = oldFiber
    } else {
      oldFiber.patchTag = DELETE
      WIP.patches.push(oldFiber)
    }
  }

  let prevFiber = null
  let alternate = null

  for (let k in newFibers) {
    let newFiber = newFibers[k]
    let oldFiber = reused[k]

    if (oldFiber) {
      alternate = createFiber(oldFiber, {
        patchTag: UPDATE
      })
      if (!options.end) newFiber.patchTag = UPDATE
      newFiber = merge(alternate, newFiber)
      newFiber.alternate = alternate
      if (oldFiber.key) {
        newFiber.patchTag = REPLACE
      }
    } else {
      newFiber = createFiber(newFiber, {
        patchTag: PLACE
      })
    }
    newFibers[k] = newFiber
    newFiber.parent = WIP

    if (prevFiber) {
      prevFiber.sibling = newFiber
    } else {
      WIP.child = newFiber
    }
    prevFiber = newFiber
  }
}

function createFiber (vnode, data) {
  data.tag = isFn(vnode.type) ? HOOK : HOST
  vnode.props = vnode.props
  return merge(vnode, data)
}

function completeWork (fiber) {
  if (!options.end && fiber.parent) {
    fiber.parent.patches = (fiber.parent.patches || []).concat(
      fiber.patches || [],
      fiber.patchTag ? [fiber] : []
    )
  } else {
    pendingCommit = fiber
  }
}

function commitWork (WIP) {
  WIP.patches.forEach(p => commit(p))
  nextWork = null
  pendingCommit = null
}
function commit (fiber) {
  let p = fiber.parent
  while (p.tag == HOOK) p = p.parent
  const parent = p.base
  let dom = fiber.base || fiber.child.base

  const { patchTag } = fiber
  if (fiber.parent.tag === ROOT) {
  } else if (patchTag == UPDATE) {
    updateElement(dom, fiber.alternate.props, fiber.props)
  } else if (patchTag == DELETE) {
    parent.removeChild(dom)
  } else {
    const insertPoint = getInsertPoint(fiber)
    let after = insertPoint
      ? patchTag == PLACE
        ? insertPoint.base.nextSibling
        : insertPoint.base.nextSibling || parent.firstChild
      : null
    if (after == dom) return
    parent.insertBefore(dom, after)
  }
  p.patches = []
  fiber.patches = []
}

function getInsertPoint (fiber) {
  if (fiber.insertPoint) {
    return fiber.insertPoint
  }
}

function getWIP () {
  return currentFiber || null
}

export { render, scheduleWork, getWIP, options }
