import {
  Fiber,
  FC,
  HookEffect,
  FreText,
  TAG,
  Action,
  FiberHost,
  FiberFinish,
} from './type'
import { createElement } from './dom'
import { resetCursor } from './hook'
import { schedule, shouldYield } from './schedule'
import { isArr, createText } from './h'
import { commit, removeElement } from './commit'

let currentFiber: Fiber = null
let rootFiber = null

export const render = (vnode: Fiber, node: Node) => {
  rootFiber = {
    node,
    props: { children: vnode },
  } as Fiber
  update(rootFiber)
}

export const update = (fiber?: Fiber) => {
  if (!fiber.dirty) {
    fiber.dirty = true
    schedule(() => reconcile(fiber))
  }
}

const reconcile = (fiber?: Fiber) => {
  while (fiber && !shouldYield()) fiber = capture(fiber)
  if (fiber) return reconcile.bind(null, fiber) as typeof reconcile
  return null
}

const capture = (fiber: Fiber) => {
  fiber.isComp = isFn(fiber.type)
  if (fiber.isComp) {
    if (isMemo(fiber)) {
      fiber.memo = true
      // fast-fix
      return getSibling(fiber)
    } else if (fiber.memo) {
      fiber.memo = false
    }

    updateHook(fiber)
  } else {
    updateHost(fiber as FiberHost)
  }
  if (fiber.child) return fiber.child
  const sibling = getSibling(fiber)
  return sibling
}

export const isMemo = (fiber: Fiber) => {
  if (
    (fiber.type as FC).memo &&
    fiber.type === fiber.old?.type &&
    fiber.old?.props
  ) {
    let scu = (fiber.type as FC).shouldUpdate || shouldUpdate
    if (!scu(fiber.props, fiber.old.props)) {
      return true
    }
  }
  return false
}

const getSibling = (fiber?: Fiber) => {
  while (fiber) {
    bubble(fiber)
    if (fiber.dirty) {
      fiber.dirty = false
      commit(fiber as FiberFinish)
      return null
    }
    if (fiber.sibling) return fiber.sibling
    fiber = fiber.parent
  }
  return null
}

const bubble = (fiber: Fiber) => {
  if (fiber.isComp) {
    if (fiber.hooks) {
      side(fiber.hooks.layout)
      schedule(() => side(fiber.hooks.effect) as undefined)
    }
  }
}

const shouldUpdate = (
  a: Record<string, unknown>,
  b: Record<string, unknown>
) => {
  for (let i in a) if (!(i in b)) return true
  for (let i in b) if (a[i] !== b[i]) return true
}

const updateHook = (fiber: Fiber) => {
  resetCursor()
  currentFiber = fiber
  fiber.parentNode = getParentNode(fiber) || {}
  let children = (fiber.type as FC)(fiber.props)
  reconcileChidren(fiber, simpleVnode(children))
}

const updateHost = (fiber: FiberHost) => {
  fiber.parentNode = getParentNode(fiber) || {}
  if (!fiber.node) {
    if (fiber.type === 'svg') fiber.lane |= TAG.SVG
    fiber.node = createElement(fiber)
  }
  reconcileChidren(fiber, fiber.props.children)
}

const simpleVnode = (type: Fiber | FreText) =>
  isStr(type) ? createText(type) : type

export const getParentNode = (fiber: Fiber) => {
  while ((fiber = fiber.parent)) {
    if (!fiber.isComp) return fiber.node
  }
}

const reconcileChidren = (
  fiber: Fiber,
  children: Fiber | Fiber[] | null | undefined
) => {
  let aCh = fiber.kids || [],
    bCh = (fiber.kids = arrayfy(children))

  const actions = diff(aCh, bCh)

  for (let i = 0, prev = null, len = bCh.length; i < len; i++) {
    const child = bCh[i]
    child.action = actions[i]

    if (fiber.lane & TAG.SVG) {
      child.lane |= TAG.SVG
    }
    child.parent = fiber
    if (i > 0) {
      prev.sibling = child
    } else {
      fiber.child = child
    }
    prev = child
  }
}

function clone(a: Fiber, b: Fiber) {
  b.hooks = a.hooks
  b.ref = a.ref
  b.node = a.node // 临时修复
  b.kids = a.kids
  b.old = a
}

export const arrayfy = <T>(arr: T | T[] | null | undefined) =>
  !arr ? [] : isArr(arr) ? arr : [arr]

const side = (effects?: HookEffect[]) => {
  effects.forEach((e) => e[2] && e[2]())
  effects.forEach((e) => (e[2] = e[0]()))
  effects.length = 0
}

const diff = (aCh, bCh) => {
  let aHead = 0,
    bHead = 0,
    aTail = aCh.length - 1,
    bTail = bCh.length - 1,
    aMap = null,
    bMap = null,
    same = (a, b) => a.key != null && b.key != null && a.key === b.key,
    temp = [],
    actions = []

  while (aHead <= aTail && bHead <= bTail) {
    if (!same(aCh[aTail], bCh[bTail])) break
    if (aCh[aTail].type === bCh[bTail].type) {
      clone(aCh[aTail], bCh[bTail])
      temp.push({ op: TAG.UPDATE })
    } else {
      actions.push({ op: TAG.REPLACE, cur: bCh[bTail], ref: aCh[aTail] })
    }
    aTail--
    bTail--
  }

  while (aHead <= aTail && bHead <= bTail) {
    if (!same(aCh[aHead], bCh[bHead])) break
    if (aCh[aHead].type === bCh[bHead].type) {
      clone(aCh[aHead], bCh[bHead])
      actions.push({ op: TAG.UPDATE })
    } else {
      actions.push({ op: TAG.REPLACE, cur: bCh[bHead], ref: aCh[aHead] })
    }
    aHead++
    bHead++
  }
  if (!aMap) {
    aMap = {}
    for (let i = aHead; i <= aTail; i++) {
      aMap[aCh[i].key] = i
    }
  }
  if (!bMap) {
    bMap = {}
    for (let i = bHead; i <= bTail; i++) {
      bMap[bCh[i].key] = i
    }
  }
  while (aHead <= aTail || bHead <= bTail) {
    var aElm = aCh[aHead],
      bElm = bCh[bHead]
    if (aElm === null) {
      aHead++
    } else if (bTail + 1 <= bHead) {
      removeElement(aElm)
      aHead++
    } else if (aTail + 1 <= aHead) {
      actions.push({ op: TAG.INSERT, cur: bElm, ref: aElm })
      bHead++
    } else if (aElm.key === bElm.key) {
      if (aElm.type === bElm.type) {
        clone(aElm, bElm)
        actions.push({ op: TAG.UPDATE })
      } else { // replace
        actions.push({ op: TAG.REPLACE, cur: bElm, ref: aElm })
      }
      aHead++
      bHead++
    } else {
      var foundB = bMap[aElm.key]
      var foundA = aMap[bElm.key]
      if (foundB == null) {
        removeElement(aElm)
        aHead++
      } else if (foundA == null) {
        actions.push({ op: TAG.INSERT, cur: bElm, ref: aElm })
        bHead++
      } else {
        clone(aCh[foundA], bElm)
        actions.push({ op: TAG.MOVE, cur: aCh[foundA], ref: aElm })
        aCh[foundA] = null
        bHead++
      }
    }
  }
  actions.concat(temp)
  return actions
}
export const getCurrentFiber = () => currentFiber || null
export const isFn = (x: unknown): x is Function => typeof x === 'function'
export const isStr = (s: unknown): s is number | string =>
  typeof s === 'number' || typeof s === 'string'
