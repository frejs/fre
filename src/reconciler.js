import { createElement, updateProperties } from './dom'
import { resetCursor } from './hooks'
import { defer, arrayfy } from './util'

const [HOST, HOOK, ROOT, PLACE, DELETE, UPDATE] = [
  'host',
  'hook',
  'root',
  'place',
  'delete',
  'update'
]

let updateQueue = []
let nextWork = null
let pendingCommit = null
export let currentInstance = null

export function render (vdom, container) {
  updateQueue.push({
    from: ROOT,
    base: container,
    props: {},
    children: vdom
  })
  defer(workLoop)
}

export function scheduleWork (instance, k, v) {
  instance.state[k] = v
  updateQueue.push({
    from: HOOK,
    instance,
    state: instance.state
  })
  defer(workLoop)
}

function workLoop () {
  if (!nextWork && updateQueue.length) {
    resetWork()
  }
  while (nextWork) {
    nextWork = performWork(nextWork)
  }
  if (pendingCommit) {
    commitAllWork(pendingCommit)
  }
}

function resetWork () {
  const update = updateQueue.shift()
  if (!update) return

  if (update.state) {
    update.instance.fiber.state = update.state
  }
  const root =
    update.from == ROOT ? update.base.rootFiber : getRoot(update.instance.fiber)

  nextWork = {
    tag: ROOT,
    base: update.base || root.base,
    props: update.props || root.props,
    children: update.children
  }
}

function performWork (WIP) {
  if (WIP.tag == HOOK) {
    updateHOOK(WIP)
  } else {
    updateHost(WIP)
  }
  if (WIP.child) {
    return WIP.child
  }
  let wip = WIP
  while (wip) {
    completeWork(wip)
    if (wip.sibling) return wip.sibling
    wip = wip.parent
  }
}

function updateHost (WIP) {
  if (!WIP.base) WIP.base = createElement(WIP)

  const newChildren = WIP.children
  reconcileChildren(WIP, newChildren)
}

function updateHOOK (wipFiber) {
  let instance = wipFiber.base
  if (instance == null) {
    instance = wipFiber.base = createInstance(wipFiber)
  } else if (wipFiber.props == instance.props && !wipFiber.state) {
    cloneChildFibers(wipFiber)
  }
  instance.props = wipFiber.props || {}
  instance.state = wipFiber.state || {}
  instance.effects = wipFiber.effects || {}
  currentInstance = instance
  resetCursor()
  const newChildren = wipFiber.type(wipFiber.props)
  reconcileChildren(wipFiber, newChildren)
}

function reconcileChildren (WIP, newChildren) {
  const elements = arrayfy(newChildren)

  let index = 0
  let oldFiber = WIP.alternate ? WIP.alternate.child : null
  let newFiber = null
  while (index < elements.length || oldFiber != null) {
    const prevFiber = newFiber
    const element = index < elements.length && elements[index]
    const sameType = oldFiber && element && element.type == oldFiber.type

    if (sameType) {
      newFiber = {
        type: oldFiber.type,
        tag: oldFiber.tag,
        base: oldFiber.base,
        props: element.props,
        parent: WIP,
        alternate: oldFiber,
        state: oldFiber.state,
        effectTag: UPDATE
      }
    }

    if (element && !sameType) {
      newFiber = {
        type: element.type,
        tag: typeof element.type === 'string' ? HOST : HOOK,
        props: element.props,
        parent: WIP,
        effectTag: PLACE
      }
    }

    if (oldFiber && !sameType) {
      oldFiber.effectTag = DELETE
      WIP.effects = WIP.effects || []
      WIP.effects.push(oldFiber)
    }

    if (oldFiber) {
      oldFiber = oldFiber.sibling
    }

    if (index == 0) {
      WIP.child = newFiber
    } else if (prevFiber && element) {
      prevFiber.sibling = newFiber
    }

    index++
  }
}

function createInstance (fiber) {
  const instance = new fiber.type(fiber.props)
  instance.fiber = fiber
  return instance
}

function cloneChildFibers (parentFiber) {
  const oldFiber = parentFiber.alternate
  if (!oldFiber.child) {
    return
  }

  let oldChild = oldFiber.child
  let prevChild = null
  while (oldChild) {
    const newChild = {
      type: oldChild.type,
      tag: oldChild.tag,
      base: oldChild.base,
      props: oldChild.props,
      state: oldChild.state,
      alternate: oldChild,
      parent: parentFiber
    }
    if (prevChild) {
      prevChild.sibling = newChild
    } else {
      parentFiber.child = newChild
    }
    prevChild = newChild
    oldChild = oldChild.sibling
  }
}

function completeWork (fiber) {
  if (fiber.tag == HOOK) {
    fiber.base.fiber = fiber
  }

  if (fiber.parent) {
    const childEffects = fiber.effects || []
    const thisEffect = fiber.effectTag != null ? [fiber] : []
    const parentEffects = fiber.parent.effects || []
    fiber.parent.effects = parentEffects.concat(childEffects, thisEffect)
  } else {
    pendingCommit = fiber
  }
}

function commitAllWork (WIP) {
  WIP.effects.forEach(f => commitWork(f))
  WIP.base.rootFiber = WIP

  nextWork = null
  pendingCommit = null
}

function commitWork (fiber) {
  if (fiber.tag == ROOT) return

  let domParentFiber = fiber.parent
  while (domParentFiber.tag == HOOK) {
    domParentFiber = domParentFiber.parent
  }
  const domParent = domParentFiber.base

  if (fiber.effectTag == PLACE && fiber.tag == HOST) {
    domParent.appendChild(fiber.base)
  } else if (fiber.effectTag == UPDATE) {
    updateProperties(fiber.base, fiber.alternate.props, fiber.props)
  } else if (fiber.effectTag == DELETE) {
    commitDELETE(fiber, domParent)
  }
}

function commitDELETE (fiber, domParent) {
  let node = fiber
  while (true) {
    if (node.tag == HOOK) {
      node = node.child
      continue
    }
    domParent.removeChild(node.base)
    while (node != fiber && !node.sibling) {
      node = node.parent
    }
    if (node == fiber) {
      return
    }
    node = node.sibling
  }
}

function getRoot (fiber) {
  let node = fiber
  while (node.parent) {
    node = node.parent
  }
  return node
}

// function commitEffects (effects) {
//   Object.keys(effects).forEach(key => {
//     let effect = effects[key]
//     effect()
//   })
// }
