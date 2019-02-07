const ROOT = 'root'
const HOOK = 'hook'
const HOST = 'host'
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
}

function resetNextUnitOfWork() {
  const update = updateQueue.shift()
  if (!update) {
    return
  }
  if (update.partialState) {
    update.instance.__fiber.partialState = update.partialState
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
    // updateHook
  } else {
    // updateHost
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

function getRoot(fiber) {
  let node = fiber
  while (node.parent) {
    node = node.parent
  }
  return node
}