import { createElement, updateElement } from './element'
import { resetCursor } from './hooks'
import { defer, hashfy, isSame, extend, megre } from './util'

const [HOST, HOOK, ROOT, PLACE, DELETE, UPDATE, NOWORK] = [
  'host',
  'hook',
  'root',
  'place',
  'delete',
  'update',
  'nowork'
]

let microtasks = []
let nextWork = null
let pendingCommit = null
let currentFiber = null

export function render (vdom, container) {
  let rootFiber = {
    tag: ROOT,
    base: container,
    props: { children: vdom }
  }
  microtasks.push(rootFiber)
  defer(workLoop)
}

export function scheduleWork (fiber) {
  microtasks.push(fiber)
  defer(workLoop)
}

function workLoop () {
  if (!nextWork && microtasks.length) {
    const update = microtasks.shift()
    if (!update) return
    nextWork = update
  }
  while (nextWork) {
    nextWork = performWork(nextWork)
  }
  if (pendingCommit) {
    commitWork(pendingCommit)
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
  if (!WIP.base) WIP.base = createElement(WIP)

  const newChildren = WIP.props.children
  reconcileChildren(WIP, newChildren)
}

function updateHOOK (WIP) {
  let instance = WIP.base
  if (instance == null) {
    instance = WIP.base = createInstance(WIP)
  }
  WIP.props = WIP.props || {}
  WIP.state = WIP.state || {}
  WIP.effects = WIP.effects || {}
  const newChildren = WIP.type(WIP.props)
  reconcileChildren(WIP, newChildren)
  currentFiber = WIP
  resetCursor()
}
function fiberize (children, WIP) {
  return (WIP.children = hashfy(children))
}

function reconcileChildren (WIP, newChildren) {
  const oldFibers = WIP.children
  const newFibers = fiberize(newChildren, WIP)
  let reused = new Object()

  for (let o in oldFibers) {
    let newFiber = newFibers[o]
    let oldFiber = oldFibers[o]
    if (newFiber && oldFiber.type === newFiber.type) {
      reused[o] = oldFiber
      if (newFiber.key) {
        oldFiber.key = newFiber.key
      }
      continue
    } else {
      oldFiber.patchTag = DELETE
      WIP.patches.push(oldFiber)
    }
  }
  let prevFiber = null
  let alternate = null

  for (let n in newFibers) {
    let newFiber = newFibers[n]
    let oldFiber = reused[n]

    if (oldFiber) {
      if (isSame(oldFiber, newFiber)) {
        alternate = new Fiber(oldFiber, {
          patchTag: UPDATE
        })
        newFiber.patchTag = UPDATE
        newFiber = megre(alternate, newFiber)
        newFiber.alternate = alternate
      }
    } else {
      newFiber = new Fiber(newFiber, {
        patchTag: PLACE
      })
    }
    newFibers[n] = newFiber
    newFiber.parent = WIP

    if (prevFiber) {
      prevFiber.sibling = newFiber
    } else {
      WIP.child = newFiber
    }

    prevFiber = newFiber
  }
  if (prevFiber) prevFiber.sibling = null
}

function createInstance (fiber) {
  const instance = new fiber.type(fiber.props)
  instance.fiber = fiber
  return instance
}

function Fiber (vnode, data) {
  this.patchTag = data.patchTag
  this.tag = data.tag || typeof vnode.type === 'function' ? HOOK : HOST
  vnode.props = vnode.props || { nodeValue: vnode.nodeValue }
  extend(this, vnode)
}

function completeWork (fiber) {
  if (fiber.parent) {
    let childPatches = fiber.patches || []
    const selfPatches = fiber.patchTag ? [fiber] : []
    const parentPatches = fiber.parent.patches || []
    fiber.parent.patches = parentPatches.concat(childPatches, selfPatches)
  } else {
    pendingCommit = fiber
  }
}

function commitWork (WIP) {
  WIP.patches.forEach(p => commit(p))
  commitEffects(currentFiber.effects)
  nextWork = null
  pendingCommit = null
}

let once = true

function commit (fiber) {
  if (fiber.tag == ROOT) return

  let parentFiber = fiber.parent
  while (parentFiber.tag == HOOK) {
    parentFiber = parentFiber.parent
  }
  const parent = parentFiber.base
  let dom = fiber.base

  let after = once ? null : fiber.sibling ? fiber.sibling.base : null
  if (fiber.tag == HOOK) {
  } else if (fiber.patchTag == PLACE) {
    parent.insertBefore(dom, after)
  } else if (fiber.patchTag == UPDATE) {
    updateElement(fiber.base, fiber.alternate.props, fiber.props)
  } else if (fiber.patchTag == DELETE) {
    deleteElement(fiber, parent)
  }
  if (dom != parent.lastChild) once = false
  parentFiber.patches = fiber.patches = []
}

function deleteElement (fiber, parent) {
  let node = fiber
  while (true) {
    if (node.tag == HOOK) {
      node = node.child
      continue
    }
    parent.removeChild(node.base)
    node.patches = []
    while (node != fiber && !node.sibling) node = node.parent
    if (node == fiber) return
    node = node.sibling
  }
}

export function getCurrentFiber () {
  return currentFiber || null
}

function commitEffects (effects) {
  Object.keys(effects).forEach(key => {
    let effect = effects[key]
    effect()
  })
}
