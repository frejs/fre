import {
  Fiber,
  FC,
  HookEffect,
  FreText,
  TAG,
  FiberHost,
  FiberFinish,
} from './type'
import { createElement } from './dom'
import { resetCursor } from './hook'
import { schedule, shouldYield } from './schedule'
import { isArr, createText, createVnode } from './h'
import { commit, removeElement } from './commit'

let currentFiber: Fiber = null
let rootFiber = null

export const render = (vnode: Fiber, node: Node) => {
  rootFiber = {
    node,
    props: { children: vnode },
    kids: recycleNode(node).props.children // hydrate
  } as Fiber
  update(rootFiber)
}

export const update = (fiber?: Fiber) => {
  if (!fiber.dirty) {
    fiber.dirty = true
    schedule(() => reconcile(fiber))
  }
}

const recycleNode = (node: Node) => {
  let vnode: any = createVnode(
    node.nodeName.toLowerCase(),
    node.nodeType === 3 ? { nodeValue: node.nodeValue, } : {
      children: Array.from(node.childNodes)
        .filter((node: Node) => node.nodeType !== Node.TEXT_NODE || node.nodeValue.trim() !== '')
        .map(recycleNode)
    },
    null,
    null
  )
  vnode.node = node
  return vnode
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
    fiber.type === fiber.alternate?.type &&
    fiber.alternate?.props
  ) {
    let scu = (fiber.type as FC).shouldUpdate || shouldUpdate
    if (!scu(fiber.props, fiber.alternate.props)) {
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

const fragment = (fiber: Fiber) => {
  const f = document.createDocumentFragment() as any
  const c = document.createComment((fiber.type as FC).name)
  f.appendChild(c)
  return f
}

const updateHook = (fiber: Fiber) => {

  resetCursor()
  currentFiber = fiber
  fiber.node = fiber.node || fragment(fiber)

  let children = (fiber.type as FC)(fiber.props)
  reconcileChidren(fiber, simpleVnode(children))
}

const updateHost = (fiber: FiberHost) => {
  if (!fiber.node) {
    if (fiber.type === 'svg') fiber.lane |= TAG.SVG
    fiber.node = createElement(fiber)
  }
  reconcileChidren(fiber, fiber.props.children)
}

const simpleVnode = (type: Fiber | FreText) =>
  isStr(type) ? createText(type) : type

const reconcileChidren = (
  fiber: Fiber,
  children: Fiber | Fiber[] | null | undefined
) => {
  let aCh = fiber.kids || [],
    bCh = (fiber.kids = arrayfy(children))
  console.log(aCh, bCh)
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
  b.alternate = a
}

export const arrayfy = <T>(arr: T | T[] | null | undefined) =>
  !arr ? [] : isArr(arr) ? arr : [arr]

const side = (effects?: HookEffect[]) => {
  effects.forEach((e) => e[2] && e[2]())
  effects.forEach((e) => (e[2] = e[0]()))
  effects.length = 0
}

const diff = (aCh: Fiber[], bCh: Fiber[]) => {
  let aHead = 0,
    bHead = 0,
    aTail = aCh.length - 1,
    bTail = bCh.length - 1,
    aMap = {},
    bMap = {},
    same = (a: Fiber, b: Fiber) => {
      return a.type === b.type && a.key === b.key
    },
    temp = [],
    actions = []

  while (aHead <= aTail && bHead <= bTail) {
    if (!same(aCh[aTail], bCh[bTail])) break
    clone(aCh[aTail], bCh[bTail])
    temp.push({ op: TAG.UPDATE })
    aTail--
    bTail--
  }

  while (aHead <= aTail && bHead <= bTail) {
    if (!same(aCh[aHead], bCh[bHead])) break

    clone(aCh[aHead], bCh[bHead])
    actions.push({ op: TAG.UPDATE })
    aHead++
    bHead++
  }
  for (let i = aHead; i <= aTail; i++) {
    if (aCh[i].key) aMap[aCh[i].key] = i
  }
  for (let i = bHead; i <= bTail; i++) {
    if (bCh[i].key) bMap[bCh[i].key] = i
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
    } else if (same(aElm, bElm)) {
      clone(aElm, bElm)
      actions.push({ op: TAG.UPDATE })
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
  for (let i = temp.length - 1; i >= 0; i--) {
    actions.push(temp[i])
  }
  return actions
}
export const useFiber = () => currentFiber || null
export const isFn = (x: unknown): x is Function => typeof x === 'function'
export const isStr = (s: unknown): s is number | string =>
  typeof s === 'number' || typeof s === 'string'
