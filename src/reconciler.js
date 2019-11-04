import { createElement, updateElement } from './dom'
import { resetCursor } from './hooks'
import { scheduleCallback, shouldYeild } from './scheduler'
import { createText } from './h'

export const options = {}
export const [HOST, SVG, HOOK, PLACE, UPDATE, DELETE] = [0, 1, 2, 3, 4, 5]

let preCommit = null
export let currentHook = null
let WIP = null
let commitQueue = []

export function render (vnode, node, done) {
  let rootFiber = {
    tag: HOST,
    node,
    props: { children: vnode },
    done
  }
  scheduleWork(rootFiber)
}

export function scheduleWork (fiber, lock) {
  fiber.lock = lock
  WIP = fiber
  scheduleCallback(reconcileWork)
}

function reconcileWork (didout) {
  let suspend = null
  while (WIP && (!shouldYeild() || didout)) {
    try {
      WIP = reconcile(WIP)
    } catch (e) {
      if (!!e && typeof e.then === 'function') {
        suspend = WIP
        WIP = null
        e.then(() => {
          WIP = suspend
        })
      } else throw e
    }
  }
  if (preCommit) {
    commitWork(preCommit)
    return null
  }
  if (!didout) {
    return reconcileWork.bind(null)
  }
  return null
}

function reconcile (WIP) {
  WIP.parentNode = getParentNode(WIP)
  WIP.tag == HOOK ? updateHOOK(WIP) : updateHost(WIP)
  commitQueue.push(WIP)

  if (WIP.child) return WIP.child
  while (WIP) {
    if (WIP.lock == false || !WIP.parent) {
      preCommit = WIP
    }
    if (WIP.sibling && WIP.lock == null) {
      return WIP.sibling
    }
    WIP = WIP.parent
  }
}

function updateHOOK (WIP) {
  WIP.props = WIP.props || {}
  currentHook = WIP
  resetCursor()
  let children = WIP.type(WIP.props)
  if (!children.type) {
    children = createText(children)
  }
  reconcileChildren(WIP, children)
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
function getParentNode (fiber) {
  while ((fiber = fiber.parent)) {
    if (fiber.tag < HOOK) return fiber.node
  }
}

function reconcileChildren (WIP, children) {
  if (!children) return
  delete WIP.child
  const oldFibers = WIP.kids
  const newFibers = (WIP.kids = hashfy(children))

  let reused = {}

  for (const k in oldFibers) {
    let newFiber = newFibers[k]
    let oldFiber = oldFibers[k]

    if (newFiber && newFiber.type === oldFiber.type) {
      reused[k] = oldFiber
    } else {
      oldFiber.op = DELETE
      commitQueue.push(oldFiber)
    }
  }

  let prevFiber = null
  let copy = null

  for (const k in newFibers) {
    let newFiber = newFibers[k]
    let oldFiber = reused[k]

    if (oldFiber) {
      copy = createFiber(oldFiber, UPDATE)
      newFiber.op = UPDATE
      newFiber = { ...copy, ...newFiber }
      newFiber.copy = copy
      if (shouldPlace(newFiber)) {
        newFiber.op = PLACE
      }
    } else {
      newFiber = createFiber(newFiber, PLACE)
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
  WIP.lock = WIP.lock ? false : null
}

function shouldPlace (fiber) {
  let p = fiber.parent
  if (p.tag === HOOK) return p.key && !p.lock
  return fiber.key
}

function commitWork (fiber) {
  commitQueue.forEach(c => {
    if (c.parent) commit(c)
  })

  WIP = null
  commitQueue = []
  preCommit = null
  fiber.done && fiber.done()
}

function flushEffects (fiber) {
  if (fiber.hooks) {
    fiber.hooks.effects.forEach(hook => {
      if (hook[2]) hook[2]()
    })
    fiber.hooks.effects.forEach(hook => {
      const result = hook[0]()
      if (typeof result === 'function') hook[2] = result
    })
    fiber.hooks.effects = []
  }
}

function commit (fiber) {
  let op = fiber.op
  let parent = fiber.parentNode
  let dom = fiber.node
  if (op === DELETE) {
    while (fiber.tag === HOOK) fiber = fiber.child
    parent.removeChild(fiber.node)
  } else if (fiber.tag === HOOK) {
    setTimeout(() => flushEffects(fiber), 0)
  } else if (op === UPDATE) {
    updateElement(dom, fiber.copy.props, fiber.props)
  } else {
    let point = fiber.insertPoint ? fiber.insertPoint.node : null
    let after = point ? point.nextSibling : parent.firstChild
    if (after === dom) return
    if (after === null && dom === parent.lastChild) return
    parent.insertBefore(dom, after)
  }
  applyRef(fiber)
}

function applyRef(fiber){
  let ref = fiber.ref
  if (ref) {
    isFn(ref) ? ref(dom) : (ref.current = dom)
    ref.current = null
  }
}

function createFiber (vnode, op) {
  return { ...vnode, op, tag: isFn(vnode.type) ? HOOK : HOST }
}

const arrayfy = arr => (!arr ? [] : arr.pop ? arr : [arr])

function hashfy (arr) {
  let out = {}
  let i = 0
  let j = 0
  arrayfy(arr).forEach(item => {
    if (item.pop) {
      item.forEach(item => {
        item.key ? (out['.' + i + '.' + item.key] = item) : (out['.' + i + '.' + j] = item) && j++
      })
      i++
    } else {
      item.key ? (out['.' + item.key] = item) : (out['.' + i] = item) && i++
    }
  })
  return out
}

export const isFn = fn => typeof fn === 'function'

export function getHook (cursor) {
  let hooks = currentHook.hooks || (currentHook.hooks = { list: [], effects: [] })
  if (cursor >= hooks.list.length) {
    hooks.list.push([])
  }
  return hooks.list[cursor] || []
}
