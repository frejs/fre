import { createElement, updateProperties } from './dom'
import { resetCursor } from './hooks'
import { Scheduler } from './scheduler'

const HOST = 'host'
const HOOK = 'hook'
const ROOT = 'root'

const PLACE = 1
const DELETE = 2
const UPDATE = 3

const sm = new Scheduler

let updateQueue = []
let nextUnitOfWork = null
let pendingCommit = null
export let currentInstance = null

export function render (vdom, el) {
  updateQueue.push({
    from: ROOT,
    dom: el,
    newProps: { children: vdom }
  })
  requestIdleCallback(performWork)
}

export function scheduleUpdate (instance, k, v) {
  instance.state[k] = v
  updateQueue.push({
    from: HOOK,
    instance,
    state: instance.state
  })
  requestIdleCallback(performWork)
}

function performWork (deadline) {
  if (!nextUnitOfWork && updateQueue.length) {
    resetNextUnitOfWork()
  }
  while (nextUnitOfWork && deadline.timeRemaining() > 1) {
    nextUnitOfWork = performUnitOfWork(nextUnitOfWork)
  }
  if (pendingCommit) {
    commitAllWork(pendingCommit)
    commitEffects(currentInstance.effects)
  }

  if (nextUnitOfWork || updateQueue.length > 0) {
    requestIdleCallback(performWork)
  }
}

function resetNextUnitOfWork () {
  const update = updateQueue.shift()
  if (!update) {
    return
  }

  if (update.state) {
    update.instance.__fiber.state = update.state
  }
  const root =
    update.from == ROOT
      ? update.dom._rootContainerFiber
      : getRoot(update.instance.__fiber)

  nextUnitOfWork = {
    type: ROOT,
    base: update.dom || root.base,
    props: update.newProps || root.props,
    alternate: root
  }
}

function performUnitOfWork (wipFiber) {
  beginWork(wipFiber)
  if (wipFiber.child) {
    return wipFiber.child
  }
  let uow = wipFiber
  while (uow) {
    completeWork(uow)
    if (uow.sibling) {
      return uow.sibling
    }
    uow = uow.parent
  }
}

function beginWork (wipFiber) {
  if (wipFiber.type == HOOK) {
    updateHOOKComponent(wipFiber)
  } else {
    updateHostComponent(wipFiber)
  }
}

function updateHostComponent (wipFiber) {
  if (!wipFiber.base) {
    wipFiber.base = createElement(wipFiber)
  }

  const newChildren = wipFiber.props.children
  reconcileChildren(wipFiber, newChildren)
}

function updateHOOKComponent (wipFiber) {
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
  const newChildren = wipFiber.tag(wipFiber.props)
  reconcileChildren(wipFiber, newChildren)
}

function reconcileChildren (wipFiber, newChildren) {
  const elements = !newChildren
    ? []
    : Array.isArray(newChildren)
      ? newChildren
      : [newChildren]

  let index = 0
  let oldFiber = wipFiber.alternate ? wipFiber.alternate.child : null
  let newFiber = null
  while (index < elements.length || oldFiber != null) {
    const prevFiber = newFiber
    const element = index < elements.length && elements[index]
    const sameTag = oldFiber && element && element.tag == oldFiber.tag

    if (sameTag) {
      newFiber = {
        tag: oldFiber.tag,
        type: oldFiber.type,
        base: oldFiber.base,
        props: element.props,
        parent: wipFiber,
        alternate: oldFiber,
        state: oldFiber.state,
        effectTag: UPDATE
      }
    }

    if (element && !sameTag) {
      newFiber = {
        tag: element.tag,
        type: typeof element.tag === 'string' ? HOST : HOOK,
        props: element.props,
        parent: wipFiber,
        effectTag: PLACE
      }
    }

    if (oldFiber && !sameTag) {
      oldFiber.effectTag = DELETE
      wipFiber.effects = wipFiber.effects || []
      wipFiber.effects.push(oldFiber)
    }

    if (oldFiber) {
      oldFiber = oldFiber.sibling
    }

    if (index == 0) {
      wipFiber.child = newFiber
    } else if (prevFiber && element) {
      prevFiber.sibling = newFiber
    }

    index++
  }
}

function createInstance (fiber) {
  const instance = new fiber.tag(fiber.props)
  instance.__fiber = fiber
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
      tag: oldChild.tag,
      type: oldChild.type,
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
  if (fiber.type == HOOK) {
    fiber.base.__fiber = fiber
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

function commitAllWork (fiber) {
  fiber.effects.forEach(f => {
    commitWork(f)
  })
  fiber.base._rootContainerFiber = fiber
  nextUnitOfWork = null
  pendingCommit = null
}

function commitWork (fiber) {
  if (fiber.type == ROOT) {
    return
  }

  let domParentFiber = fiber.parent
  while (domParentFiber.type == HOOK) {
    domParentFiber = domParentFiber.parent
  }
  const domParent = domParentFiber.base

  if (fiber.effectTag == PLACE && fiber.type == HOST) {
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
    if (node.type == HOOK) {
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

function commitEffects (effects) {
  Object.keys(effects).forEach(key => {
    let effect = effects[key]
    effect()
  })
}
