import { createElement, updateElement } from './dom'
import { resetCursor } from './hooks'
import { scheduleCallback, shouldYeild } from './scheduler'

export const options = {}
export const [HOST, SVG, HOOK, PLACE, UPDATE, DELETE] = [0, 1, 2, 3, 4, 5]

let preCommit = null
let currentHook = null
export let WIP = null

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
  let suspendWork = null
  while (WIP && (!shouldYeild() || didout)) {
    try {
      WIP = reconcile(WIP)
    } catch (err) {
      if (!!err && typeof err.then === 'function') {
        suspendWork = WIP
        WIP = null
        err.then(() => (WIP = suspendWork))
      } else throw err
    }
  }
  if (preCommit) {
    commitWork(preCommit)
    return null
  }
  if (!didout) return reconcileWork.bind(null)
  return null
}

function reconcile (WIP) {
  WIP.parentNode = getParentNode(WIP)
  WIP.tag == HOOK ? updateHOOK(WIP) : updateHost(WIP)
  if (WIP.child) return WIP.child
  let node = WIP
  while (node) {
    if (node.lock == false || !node.parent) {
      preCommit = node
    }
    if (node.sibling && node.lock == null) {
      return node.sibling
    }
    node = node.parent
  }
}

function updateHOOK (WIP) {
  WIP.props = WIP.props || {}
  WIP.state = WIP.state || {}
  WIP.effect = {}
  WIP.memo = WIP.memo || {}
  WIP.__deps = WIP.__deps || { m: {}, e: {} }

  currentHook = WIP
  resetCursor()
  let children = WIP.type(WIP.props)
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
  const children = WIP.props.children

  reconcileChildren(WIP, children)
}
function getParentNode (fiber) {
  while ((fiber = fiber.parent)) {
    if (fiber.tag < HOOK) return fiber.node
  }
}

function reconcileChildren (WIP, children) {
  children = wrieText(children)
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
      WIP.dels = WIP.dels || []
      WIP.dels.push(oldFiber)
    }
  }

  let prevFiber = null
  let alternate = null

  for (const k in newFibers) {
    let newFiber = newFibers[k]
    let oldFiber = reused[k]

    if (oldFiber) {
      alternate = createFiber(oldFiber, UPDATE)
      newFiber.op = UPDATE
      newFiber = { ...alternate, ...newFiber }
      newFiber.alternate = alternate
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
  let root = fiber.child
  let node = fiber.child

  O: while (true) {
    commit(node)
    if (node.dels) {
      node.dels.forEach(f => commit(f))
      node.dels = []
    }
    if (node.child) {
      node = node.child
      continue
    }
    if (node === root) break O
    while (!node.sibling) {
      if (!node.parent || node.parent === root) break O
      node = node.parent
    }
    node = node.sibling
  }

  fiber.done && fiber.done()
  WIP = null
  preCommit = null
}

function applyEffect (fiber) {
  fiber.pending = fiber.pending || {}
  for (const k in fiber.effect) {
    const pend = fiber.pending[k]
    pend && pend()
    let after = null
    after = fiber.effect[k]()
    after && (fiber.pending[k] = after)
  }
  fiber.effect = null
}

function commit (fiber) {
  let op = fiber.op
  let parent = fiber.parentNode
  let dom = fiber.node
  let ref = fiber.ref
  if (op === DELETE) {
    cleanup(fiber)
    while (fiber.tag === HOOK) fiber = fiber.child
    parent.removeChild(fiber.node)
    fiber.node = null
  } else if (fiber.tag === HOOK) {
    applyEffect(fiber)
  } else if (op === UPDATE) {
    updateElement(dom, fiber.alternate.props, fiber.props)
  } else {
    let point = fiber.insertPoint ? fiber.insertPoint.node : null
    let after = point ? point.nextSibling : parent.firstChild
    if (after === dom) return
    if (after === null && dom === parent.lastChild) return
    parent.insertBefore(dom, after)
  }

  if (ref) isFn(ref) ? ref(dom) : (ref.current = dom)
}

function cleanup (fiber) {
  let pend = fiber.pending
  for (const k in pend) pend[k]()
  fiber.pending = null
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

function wrieText (str) {
  return typeof str === 'string' || typeof str === 'number' ? { type: 'text', props: { nodeValue: str } } : str
}


export const isFn = fn => typeof fn === 'function'

export function getHook () {
  return currentHook || {}
}
