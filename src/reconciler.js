import { createElement, updateElement } from './dom'
import { resetCursor } from './hooks'
import { defer, hashfy, merge, isSame } from './util'

const options = {}
const FPS = 1000 / 60
export const [HOST, HOOK, ROOT, SVG, PLACE, UPDATE, DELETE] = [
  0,
  1,
  2,
  3,
  4,
  5,
  6
]

let updateQueue = []
let nextWork = null
let pendingCommit = null
let currentFiber = null

function render (vnode, el) {
  let rootFiber = {
    tag: ROOT,
    node: el,
    props: { children: vnode }
  }
  scheduleWork(rootFiber)
}

function scheduleWork (fiber) {
  updateQueue.push(fiber)
  defer(workLoop)
}

function workLoop (startTime = 0) {
  if (startTime && performance.now() - startTime > FPS) {
    defer(workLoop)
  } else if (!nextWork && updateQueue.length > 0) {
    nextWork = updateQueue.shift()
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
  if (!options.end && !WIP.node) {
    WIP.parentNode = getParentNode(WIP)
    WIP.node = createElement(WIP)
  }
  let p = WIP.parentNode || {}
  WIP.insertPoint = p.oldPoint || null
  p.oldPoint = WIP
  const children = WIP.props.children
  reconcileChildren(WIP, children)
}

function getParentNode (fiber) {
  if (fiber.parent) {
    return fiber.parent.tag === HOOK
      ? fiber.parent.parent.node
      : fiber.parent.node
  } else {
    return fiber.node
  }
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
  return (WIP.kids = hashfy(children, WIP.kids))
}

function reconcileChildren (WIP, children) {
  const oldFibers = WIP.kids
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
      alternate = createFiber(oldFiber, { patchTag: UPDATE })
      if (!options.end) newFiber.patchTag = UPDATE
      newFiber = merge(alternate, newFiber)
      newFiber.alternate = alternate
      if (oldFiber.key) newFiber.patchTag = PLACE
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
  WIP.patches.forEach(p => {
    commit(p)
    const e = p.effects
    if (e) for (const k in e) e[k]()
  })
  nextWork = null
  pendingCommit = null
}
function commit (fiber) {
  fiber.parent.patches = fiber.patches = []
  let parent = fiber.parentNode || fiber.parent.node
  let dom = fiber.node || fiber.child.node
  switch (fiber.patchTag) {
    case UPDATE:
      updateElement(dom, fiber.alternate.props, fiber.props)
      break
    case DELETE:
      parent.removeChild(dom)
      break
    default:
      let point = fiber.insertPoint ? fiber.insertPoint.node : null
      let after = point ? point.nextSibling : parent.firstChild
      if (after === dom) return
      if (after === null && dom === parent.lastChild) return
      if (point === null && after !== null) return
      parent.insertBefore(dom, after)
      break
  }
}

function getWIP () {
  return currentFiber || null
}

export { render, scheduleWork, getWIP, options }
