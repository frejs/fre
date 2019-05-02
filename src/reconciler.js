import { createElement, updateElement } from './element'
import { resetCursor } from './hooks'
import { defer, hashfy, merge, isSame } from './util'

const [HOST, HOOK, ROOT, PLACE, DELETE, UPDATE] = [
  'host',
  'hook',
  'root',
  'place',
  'delete',
  'update'
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
    nextWork.patches = []
    nextWork = performWork(nextWork)
  }
  if (pendingCommit) {
    commitAllWork(pendingCommit)
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
  currentFiber = WIP
  resetCursor()
  const newChildren = WIP.type(WIP.props)
  reconcileChildren(WIP, newChildren)
}
function fiberize (children, WIP) {
  return (WIP.children = hashfy(children))
}

function reconcileChildren (WIP, newChildren) {
  const oldFibers = WIP.children
  const newFibers = fiberize(newChildren, WIP)
  let reused = {}

  for (let o in oldFibers) {
    let newFiber = newFibers[o]
    let oldFiber = oldFibers[o]
    if (newFiber && oldFiber.type === newFiber.type) {
      reused[o] = oldFiber
      if (newFiber.key) {
        oldFiber.key = newFiber.key
      }
      continue
    } else if (!newFiber) {
      oldFiber.patchTag = DELETE
      WIP.patches = WIP.patches || []
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
        newFiber = { ...alternate, ...newFiber }
        newFiber.patchTag = UPDATE
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
  merge(this, vnode)
}

function completeWork (fiber) {
  if (fiber.parent) {
    const childPatches = fiber.patches || []
    const selfPatches = fiber.patchTag ? [fiber] : []
    const parentPatches = fiber.parent.patches || []
    fiber.parent.patches = parentPatches.concat(childPatches, selfPatches)
  } else {
    pendingCommit = fiber
  }
}

function commitAllWork (WIP) {
  WIP.patches.forEach(p => commitWork(p))
  commitEffects(currentFiber.effects)
  WIP.patches = []
  nextWork = null
  pendingCommit = null
}

function commitWork (fiber) {
  if (fiber.tag == ROOT) return

  let parentFiber = fiber.parent
  while (parentFiber.tag == HOOK) {
    parentFiber = parentFiber.parent
  }
  const parent = parentFiber.base
  let dom = fiber.base
  let after = (fiber.sibling || {}).base
  if (fiber.patchTag == PLACE && fiber.tag == HOST) {
    if (fiber.key) {
      try {
        parent.insertBefore(dom, after)
      } catch {
        parent.appendChild(dom)
      }
    } else {
      parent.appendChild(dom)
    }
  } else if (fiber.patchTag == UPDATE && fiber.tag == HOST) {
    updateElement(fiber.base, fiber.alternate.props, fiber.props)
  } else if (fiber.patchTag == DELETE) {
    deleteElement(fiber, parent)
  }
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
