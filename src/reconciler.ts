import {
  IFiber,
  FreElement,
  FC,
  Attributes,
  HTMLElementEx,
  FreNode,
  IRef,
  IEffect,
} from "./type"
import { createElement, updateElement } from "./dom"
import { resetCursor } from "./hooks"
import { scheduleWork, shouldYield, schedule, getTime } from "./scheduler"
import { isArr, createText } from "./h"

let currentFiber: IFiber
let finish = null
let deletes = []

export const enum OP {
  UPDATE = 1 << 1,
  INSERT = 1 << 2,
  REMOVE = 1 << 3,
  SVG = 1 << 4,
  DIRTY = 1 << 5,
}
export const render = (
  vnode: FreElement,
  node: Node,
  done?: () => void
): void => {
  const rootFiber = {
    node,
    props: { children: vnode },
    done,
  } as IFiber
  dispatchUpdate(rootFiber)
}

export const dispatchUpdate = (fiber?: IFiber) => {
  if (fiber && !(fiber.tag & OP.DIRTY)) {
    fiber.tag = OP.UPDATE | OP.DIRTY
    fiber.sibling = null
    scheduleWork(reconcileWork.bind(null, fiber), fiber.time)
  }
}

const reconcileWork = (WIP?: IFiber): boolean => {
  while (WIP && !shouldYield()) WIP = reconcile(WIP)
  if (WIP) return reconcileWork.bind(null, WIP)
  if (finish) commitWork(finish)
  return null
}

const reconcile = (WIP: IFiber): IFiber | undefined => {
  isFn(WIP.type) ? updateHook(WIP) : updateHost(WIP)

  if (WIP.child) return WIP.child
  while (WIP) {
    if (!finish && WIP.tag & OP.DIRTY) {
      finish = WIP
      WIP.tag &= ~OP.DIRTY
      return null
    }
    if (WIP.sibling) return WIP.sibling
    WIP = WIP.parent
  }
}

const updateHook = <P = Attributes>(WIP: IFiber): void => {
  if (WIP.lastProps === WIP.props) return
  currentFiber = WIP
  resetCursor()
  let start = getTime()
  let children = (WIP.type as FC<P>)(WIP.props)
  WIP.time = getTime() - start
  if (isStr(children)) {
    children = createText(children as string)
  }
  reconcileChildren(WIP, children)
}

const getParentNode = (WIP: IFiber): HTMLElement | undefined => {
  while ((WIP = WIP.parent)) {
    if (!isFn(WIP.type)) return WIP.node
  }
}

const updateHost = (WIP: IFiber): void => {
  WIP.parentNode = getParentNode(WIP) as any
  if (!WIP.node) {
    if (WIP.type === "svg") WIP.tag |= OP.SVG
    WIP.node = createElement(WIP) as HTMLElementEx
  }
  reconcileChildren(WIP, WIP.props.children)
}

const reconcileChildren = (WIP: any, children: FreNode): void => {
  let aCh = WIP.kids || [],
    bCh = (WIP.kids = arrayfy(children) as any),
    aHead = 0,
    bHead = 0,
    aTail = aCh.length - 1,
    bTail = bCh.length - 1,
    map = null,
    ch = Array(bCh.length),
    next = WIP.sibling?.node ? WIP.sibling : null

  while (aHead <= aTail && bHead <= bTail) {
    let c = null
    if (aCh[aHead] == null) {
      aHead++
    } else if (aCh[aTail] == null) {
      aTail--
    } else if (same(aCh[aHead], bCh[bHead])) {
      c = bCh[bHead]
      clone(c, aCh[aHead])
      c.tag = OP.UPDATE
      ch[bHead] = c
      aHead++
      bHead++
    } else if (same(aCh[aTail], bCh[bTail])) {
      c = bCh[bTail]
      clone(c, aCh[aTail])
      c.tag = OP.UPDATE
      ch[bTail] = c
      aTail--
      bTail--
    } else {
      if (!map) {
        map = new Map()
        for (let i = aHead; i <= aTail; i++) {
          let k = getKey(aCh[i])
          k && map.set(k, i)
        }
      }
      const key = getKey(bCh[bHead])
      if (map.has(key)) {
        const oldKid = aCh[map.get(key)]
        c = bCh[bHead]
        clone(c, oldKid)
        c.tag = OP.INSERT
        c.after = aCh[aHead]
        ch[bHead] = c
        aCh[map.get(key)] = null
      } else {
        c = bCh[bHead]
        c.tag = OP.INSERT
        c.node = null
        c.after = aCh[aHead]
      }
      bHead++
    }
  }
  const after = bTail <= bCh.length - 1 ? ch[bTail + 1] : next
  while (bHead <= bTail) {
    let c = bCh[bHead]
    c.tag = OP.INSERT
    c.after = after
    c.node = null
    bHead++
  }
  while (aHead <= aTail) {
    let oldFiber = aCh[aHead]
    if (oldFiber) {
      oldFiber.tag = OP.REMOVE
      deletes.push(oldFiber)
    }
    aHead++
  }
  for (var i = 0, prev = null; i < bCh.length; i++) {
    const child = bCh[i]
    child.parent = WIP
    if (i > 0) {
      prev.sibling = child
    } else {
      if (WIP.tag & OP.SVG) child.tag |= OP.SVG
      WIP.child = child
    }
    prev = child
  }
}

function clone(a, b) {
  a.lastProps = b.props
  a.node = b.node
  a.kids = b.kids
  a.hooks = b.hooks
  a.ref = b.ref
}

const getKey = (vdom) => (vdom == null ? vdom : vdom.key)
const getType = (vdom) => (isFn(vdom.type) ? vdom.type.name : vdom.type)

const commitWork = (fiber: IFiber): void => {
  fiber.parent ? commit(fiber) : commit(fiber.child)
  deletes.forEach(commit)
  fiber.done?.()
  deletes = []
  finish = null
}

function invokeHooks({ hooks, tag }) {
  if (hooks) {
    if (tag & OP.REMOVE) {
      hooks.list.forEach(cleanup)
    } else {
      side(hooks.layout)
      schedule(() => side(hooks.effect))
    }
  }
}

function getKid(fiber) {
  let kid = fiber
  while (isFn(kid.type)) kid = kid.child
  kid.after = fiber.after
  kid.tag |= fiber.tag
  let s = kid.sibling
  while (s) {
    s.after = fiber.after
    s.tag |= fiber.tag
    s = s.sibling
  }

  return kid
}

const commit = (fiber: IFiber): void => {
  if (!fiber) return

  let { type, tag, parentNode, node, ref } = fiber
  if (isFn(type)) {
    invokeHooks(fiber)
    let kid = getKid(fiber)
    fiber.node = kid.node
    if (fiber.tag & OP.REMOVE) {
      commit(kid)
    } else {
      commit(fiber.child)
      commit(fiber.sibling)
    }
    fiber.tag = 0
    return
  }
  if (tag & OP.REMOVE) {
    kidsRefer(fiber.kids)
    parentNode.removeChild(fiber.node)
    refer(ref, null)
    fiber.tag = 0
    return
  }
  if (tag & OP.UPDATE) {
    updateElement(node, fiber.lastProps || {}, fiber.props)
  }
  if (tag & OP.INSERT) {
    parentNode.insertBefore(fiber.node, fiber.after?.node)
  }
  fiber.tag = 0
  refer(ref, node)
  commit(fiber.child)
  commit(fiber.sibling)
}

const same = (a, b) => {
  return getKey(a) === getKey(b) && getType(a) === getType(b)
}

const arrayfy = (arr) => (!arr ? [] : isArr(arr) ? arr : [arr])

const refer = (ref: IRef, dom?: HTMLElement): void => {
  if (ref)
    isFn(ref) ? ref(dom) : ((ref as { current?: HTMLElement })!.current = dom)
}

const kidsRefer = (kids: any): void => {
  kids.forEach((kid) => {
    kid.kids && kidsRefer(kid.kids)
    refer(kid.ref, null)
  })
}

const side = (effects: IEffect[]): void => {
  effects.forEach(cleanup)
  effects.forEach(effect)
  effects.length = 0
}

export const getCurrentFiber = () => currentFiber || null

const effect = (e: IEffect): void => (e[2] = e[0]())
const cleanup = (e: IEffect): void => e[2] && e[2]()
export const isFn = (x: any): x is Function => typeof x === "function"
export const isStr = (s: any): s is number | string =>
  typeof s === "number" || typeof s === "string"
export const some = (v: any) => v != null && v !== false && v !== true
