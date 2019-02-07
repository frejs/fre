import { getRoot, arrify } from './util'
import { createElement } from './dom'

const ROOT = 'root'
const HOOK = 'hook'
const HOST = 'host'
const PLACE = 'place'
const UPDATE = 'update'
const DELETE = 'delete'
const ENOUGH_TIME = 1

let updateQueue = []

let nextUnitOfWork = null
let pendingCommit = null

export function render(vdom, el) {
  updateQueue.push({
    from: ROOT,
    dom: el,
    newProps: { children: vdom }
  })
  requestIdleCallback(performWork)
}

function performWork(deadline) {
  workLoop(deadline)
  if (nextUnitOfWork || updateQueue.length > 0) {
    requestIdleCallback(performWork)
  }
}

function workLoop(deadline) {
  if (!nextUnitOfWork) {
    resetNextUnitOfWork()
  }
  while (nextUnitOfWork && deadline.timeRemaining() > ENOUGH_TIME) {
    nextUnitOfWork = performUnitOfWork(nextUnitOfWork)
  }
  if (pendingCommit) {
    commitAllWork(pendingCommit)
  }
}

function commitAllWork(fiber) {
  fiber.effects.forEach(f => {
    commitWork(f)
  })
  fiber.dom._rootContainerFiber = fiber
  nextUnitOfWork = null
  pendingCommit = null
}

function commitWork(fiber) {
  if (fiber.type == ROOT) {
    return
  }

  let domParentFiber = fiber.parent
  while (domParentFiber.type == HOOK) {
    domParentFiber = domParentFiber.parent
  }
  const domParent = domParentFiber.dom
  if (fiber.effectTag == PLACE && fiber.type == HOST) {
    domParent.appendChild(fiber.dom)
  } else if (fiber.effectTag == UPDATE) {
    updateProperties(fiber.dom, fiber.alternate.props, fiber.props)
  } else if (fiber.effectTag == DELETE) {
    commitDeletion(fiber, domParent)
  }
}

function resetNextUnitOfWork() {
  const update = updateQueue.shift()
  if (!update) {
    return
  }
  if (update.hooks) {
    update.instance.__fiber.hooks = update.hooks
  }
  const root =
    update.from == ROOT
      ? update.dom._rootContainerFiber
      : getRoot(update.instance.__fiber)

  nextUnitOfWork = {
    type: ROOT,
    dom: update.dom || root.dom,
    props: update.newProps || root.props,
    alternate: root
  }
}

function performUnitOfWork(wipFiber) {
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

function beginWork(wipFiber) {
  if (wipFiber.type == HOOK) {
    updateHook(wipFiber)
  } else {
    updateHost(wipFiber)
  }
}

function completeWork(fiber) {
  if (fiber.type == HOOK) {
    fiber.dom.__fiber = fiber
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

function updateHook(wipFiber) {
  let instance = wipFiber.dom
  if (instance == null) {
    instance = wipFiber.dom = createInstance(wipFiber)
  } else if (wipFiber.props == instance.props && !wipFiber.hooks) {
    cloneChildFibers(wipFiber)
    return
  }

  instance.props = wipFiber.props
  instance.state = { ...instance.state, ...wipFiber.hooks }
  wipFiber.hooks = null

  const newChildElements = wipFiber.tag()
  reconcileChildren(wipFiber, newChildElements)
}

function createInstance(fiber) {
  const instance = fiber.tag(fiber.props)
  instance.__fiber = fiber
  return instance
}

function updateHost(wipFiber) {
  if (!wipFiber.dom) {
    wipFiber.dom = createElement(wipFiber)
  }

  const newChildElements = wipFiber.props.children
  reconcileChildren(wipFiber, newChildElements)
}

function reconcileChildren(wipFiber, newChildElements) {
  const elements = arrify(newChildElements)

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
        dom: oldFiber.dom,
        props: element.props,
        parent: wipFiber,
        alternate: oldFiber,
        hooks: oldFiber.hooks,
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

function commitDeletion(fiber, domParent) {
  let node = fiber
  while (true) {
    if (node.type == HOOK) {
      node = node.child
      continue
    }
    domParent.removeChild(node.dom)
    while (node != fiber && !node.sibling) {
      node = node.parent
    }
    if (node == fiber) {
      return
    }
    node = node.sibling
  }
}
