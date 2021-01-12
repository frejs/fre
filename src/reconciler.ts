import { IFiber, FreElement, FC, Attributes, HTMLElementEx, FreNode, IRef, IEffect } from './type'
import { createElement, updateElement } from './dom'
import { resetCursor } from './hooks'
import { scheduleWork, shouldYield, schedule, getTime } from './scheduler'
import { isArr, createText } from './h'

let preCommit: IFiber | undefined
let currentFiber: IFiber
let deletes = []

export const enum OP {
  REMOVE = 1 << 4,
  UPDATE = 1 << 1,
  INSERT = 1 << 3,
  MOUNT = UPDATE | INSERT,
}
export const render = (vnode: FreElement, node: Node, done?: () => void): void => {
  const rootFiber = {
    node,
    props: { children: vnode },
    done,
  } as IFiber
  dispatchUpdate(rootFiber)
}

export const dispatchUpdate = (fiber?: IFiber) => {
  if (fiber && !fiber.dirty) {
    fiber.dirty = true
    fiber.tag = OP.UPDATE
    scheduleWork(reconcileWork.bind(null, fiber), fiber.time)
  }
}

const reconcileWork = (WIP?: IFiber): boolean => {
  while (WIP && !shouldYield()) WIP = reconcile(WIP)
  if (WIP) return reconcileWork.bind(null, WIP)
  if (preCommit) commitWork(preCommit)
  return null
}

const reconcile = (WIP: IFiber): IFiber | undefined => {
  isFn(WIP.type) ? updateHook(WIP) : updateHost(WIP)
  WIP.dirty = WIP.dirty ? false : 0

  if (WIP.child) return WIP.child
  while (WIP) {
    if (!preCommit && WIP.dirty === false) {
      preCommit = WIP
      WIP.sibling = null
      return null
    }
    if (WIP.sibling) return WIP.sibling
    WIP = WIP.parent
  }
}

const updateHook = <P = Attributes>(WIP: IFiber): void => {
  if (WIP.lastProps === WIP.props) return
  currentFiber = WIP
  let start = getTime()
  let children = (WIP.type as FC<P>)(WIP.props)
  WIP.time = getTime() - start
  resetCursor()
  if (isStr(children)) children = createText(children as string)
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
    WIP.node = createElement(WIP) as HTMLElementEx
  }
  reconcileChildren(WIP, WIP.props.children)
}

const reconcileChildren = (WIP: any, children: FreNode): void => {
  let oldKids = WIP.kids || [],
    newKids = (WIP.kids = arrayfy(children) as any),
    oldHead = 0,
    newHead = 0,
    oldTail = oldKids.length - 1,
    newTail = newKids.length - 1,
    map = null

  while (oldHead <= oldTail && newHead <= newTail) {
    let newFiber = null
    if (oldKids[oldHead] == null) {
      oldHead++
    } else if (oldKids[oldTail] == null) {
      oldTail--
    } else if (same(oldKids[oldHead], newKids[newHead])) {
      newFiber = newKids[newHead]
      clone(newFiber, oldKids[oldHead])
      newFiber.tag = OP.UPDATE
      oldHead++
      newHead++
    } else if (same(oldKids[oldTail], newKids[newTail])) {
      newFiber = newKids[newTail]
      clone(newFiber, oldKids[oldTail])
      newFiber.tag = OP.UPDATE
      oldTail--
      newTail--
    } else if (same(oldKids[oldHead], newKids[newTail])) {
      newFiber = newKids[newTail]
      clone(newFiber, oldKids[oldHead])
      newFiber.tag = OP.MOUNT
      newFiber.insertPoint = oldKids[oldTail].node.nextSibling
      oldHead++
      newTail--
    } else if (same(oldKids[oldTail], newKids[newHead])) {
      newFiber = newKids[newHead]
      clone(newFiber, oldKids[oldTail])
      newFiber.tag = OP.MOUNT
      newFiber.insertPoint = oldKids[oldHead].node
      oldTail--
      newHead++
    } else {
      if (!map) {
        map = new Map()
        let i = newHead
        while (i < newTail) map.set(getKey(newKids[i]), i++)
      }
      if (map.has(getKey(oldKids[oldHead]))) {
        const i = map.get(oldKids[oldHead])
        const oldKid = oldKids[i]
        newFiber = newKids[newHead]
        clone(newFiber, oldKid)
        newFiber.tag = OP.MOUNT
        oldKids[i] = null
        newFiber.insertPoint = oldKids[oldHead]?.node
      } else {
        newFiber = newKids[newHead]
        newFiber.tag = OP.INSERT
        newFiber.node = null
        newFiber.insertPoint = oldKids[oldHead]?.node
      }
      newHead++
    }
  }
  if (oldTail < oldHead) {
    for (let i = newHead; i <= newTail; i++) {
      let newFiber = newKids[i]
      newFiber.tag = OP.INSERT
      newFiber.node = null
      newFiber.insertPoint = oldKids[oldHead]?.node
    }
  } else if (newHead > newTail) {
    for (let i = oldHead; i <= oldTail; i++) {
      let oldFiber = oldKids[i]
      if (oldFiber) {
        oldFiber.tag = OP.REMOVE
        deletes.push(oldFiber)
      }
    }
  }

  for (var i = 0, prev = null; i < newKids.length; i++) {
    const child = newKids[i]
    child.parent = WIP
    if (i > 0) {
      prev.sibling = child
    } else {
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
  preCommit = null
}

const getChild = (WIP: IFiber): any => {
  let fiber = WIP
  while ((WIP = WIP.child)) {
    if (!isFn(WIP.type)) {
      WIP.tag |= fiber.tag
      WIP.insertPoint = fiber.insertPoint
      return WIP
    }
  }
}

const commit = (fiber: IFiber): void => {
  if (!fiber) return
  let { type, tag, parentNode, node, ref, hooks } = fiber
  if (isFn(type)) {
    const realChild = getChild(fiber)
    if (fiber.tag & OP.REMOVE) {
      commit(realChild)
      hooks && hooks.list.forEach(cleanup)
    } else {
      fiber.node = realChild.node
      if (hooks) {
        side(hooks.layout)
        schedule(() => side(hooks.effect))
      }
      commit(fiber.child)
      commit(fiber.sibling)
    }
    return
  }
  if (tag & OP.REMOVE) {
    kidsRefer(fiber.kids)
    parentNode.removeChild(fiber.node)
    refer(ref, null)
    return
  }
  if (tag & OP.UPDATE) {
    updateElement(node, fiber.lastProps || {}, fiber.props)
  }
  if (tag & OP.INSERT) {
    const after = fiber.insertPoint as any
    if (after === null && fiber.node === parentNode.lastChild) return
    parentNode.insertBefore(fiber.node, after)
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
  if (ref) isFn(ref) ? ref(dom) : ((ref as { current?: HTMLElement })!.current = dom)
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
export const isFn = (x: any): x is Function => typeof x === 'function'
export const isStr = (s: any): s is number | string => typeof s === 'number' || typeof s === 'string'
export const some = (v: any) => v != null && v !== false && v !== true
