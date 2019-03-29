import { Scheduler } from './index'
let updateQueue = []
let nextUnitOfWork,currentInstance,pendingCommit
const [ROOT, HOST, HOOK, ADD, UPDATE, DELETE] = [
  'root',
  'host',
  'hook',
  'add',
  'update',
  'delete'
]
const sm = new Scheduler(6)

export function render (vdom, dom) {
  updateQueue.push({
    from: ROOT,
    dom,
    vdom
  })
  performWork()
}

export function scheduleUpdate (fiber, key, val) {
  updateQueue.push({
    form: HOOK,
    fiber
  })
  performWork()
}

function performWork () {
  if (!nextUnitOfWork && updateQueue.length) {
    initNextUnitOfWork()
  }
  // 整个遍历过程为低任务，需要等待空闲时间
  while (nextUnitOfWork && sm.isIdle()) {
    sm.requestIdlePromise().then(() => {
      nextUnitOfWork = performUnitOfWork(nextUnitOfWork)
    })
  }

  if (pendingCommit) {
    commitAllWork(pendingCommit)
  }

  if (updateQueue.length > 0) {
    performWork()
  }
}

function initNextUnitOfWork () {
  const update = updateQueue.shift()
  if (!update) return

  if (!update.state) {
    update.instance.fiber.state = update.state
  }

  const root = update.from === ROOT ? update.dom : getRoot(upda.instance.fiber)

  nextUnitOfWork = {
    tag: ROOT,
    base: update.dom || root.base,
    props: update.vdom.props || root.props,
    copy: root
  }
}

function performUnitOfWork (WIP) {
  beginWork(WIP)

  if (WIP.child) return WIP.child
  let uow = WIP
  while (uow) {
    completeWork(uow)
    if (uow.brother) return uow.brother
  }

  uow = uow.parent
}

function beginWork (WIP) {
  WIP.tag === HOOK ? updateHookComponent(WIP) : updateHostComponent(WIP)
}

function updateHookComponent (WIP) {
  let instance = WIP.base
  if (instance === null) {
    instance = createInstance(WIP)
  } else if (WIP.props === instance.props && !WIP.state) {
    cloneChildFibers(WIP)
  }
  instance.props = WIP.props
  instance.state = WIP.state

  currentInstance = instance

  const newChilds = WIP.type(WIP.props)

  reconcileChilds(WIP, newChilds)
}

function reconcileChilds (WIP, newChilds) {
  // 这个方法含 diff 算法，diff 实现准备放到 core 包
}

function createInstance (fiber) {
  const instance = new fbier.type(fnode.props)
  instance.fiber = fiber
  return instance
}

function cloneChildFibers (parent) {
  const oldFiber = parent.copy
  if (!oldFiber) return

  let oldChild = oldFiber.child
  let prevChild = null

  while (oldChild) {
    const newChild = ({
      tag,
      base,
      type,
      props,
      state,
      copy,
      parent
    } = oldChild)

    if (prevChild) {
      prevChild.brother = newChild
    } else {
      parent.child = newChild
    }

    prevChild = newChild
    oldChild = oldChild.brother
  }
}

// 至此，work 阶段就结束了，整个遍历过程都是低任务，接下来就是 commit 阶段，高任务阶段
function completeWork (fiber) {
  if (fiber.tag === HOOK) {
    fiber.base.fiber = fiber
  }

  if (fiber.parent) {
    const childEffects = fiber.effects || []
    const selfEffects = fiber.effectTag !== null ? [fiber] : []
    const parentEffects = fiber.parent.effects || []
    fiber.parent.effects = parentEffects.concat(childEffects, selfEffects)
  } else {
    pendingCommit = fiber
  }
}
function commitAllWork (fiber) {
  fiber.effects.forEach(f => commitWork(f))
  fiber.base.rootFiber = fiber
  nextUnitOfWork = null
  pendingCommit = null
}

function commitWork (fiber) {
  if (fiber.tag === ROOT) return

  let domParentFiber = fiber.parent
  while (domParentFiber.tag === HOOK) {
    domParentFiber = domParentFiber.parent
  }

  const domParent = domParentFiber.base
  if (fiber.effectTag === ADD && fiber.tag === HOST) {
    domParent.appendChild(fiber.base)
  } else if (fiber.effectTag === UPDATE) {
    updateProperties(fiber.base, fiber.copy.props, fiber.props)
  } else if (fiber.effectTag === DELETE) {
    commitDELETE(fiber, domParent)
  }
}

function commitDELETE (fiber, domParent) {
  let node = fiber
  while (true) {
    if (node.tag === HOOK) {
      node = node.child
      continue
    }
    domParent.removeChild(node.base)
    while (node !== fiber && !node.brother) {
      node = node.parent
    }
    if (node === fiber) return

    node = node.brother
  }
}

function getRoot (fiber) {
  let node = fiber
  while (node.parent) {
    node = node.parent
  }
  return node
}
