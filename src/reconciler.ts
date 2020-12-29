import {
  IFiber,
  FreElement,
  ITaskCallback,
  FC,
  Attributes,
  HTMLElementEx,
  FreNode,
  FiberMap,
  IRef,
  IEffect,
} from "./type"
import { createElement, updateElement } from "./dom"
import { resetCursor } from "./hooks"
import { scheduleWork, shouldYield, schedule } from "./scheduler"
import { isArr, createText } from "./h"

let preCommit: IFiber | undefined
let currentFiber: IFiber
let WIP: IFiber | undefined
let commits: IFiber[] = []
let deletes = []

const microTask: IFiber[] = []
export const enum OP {
  REMOVE = 1 << 4,
  UPDATE = 1 << 1,
  INSERT = 1 << 3,
  MOUNT = UPDATE | INSERT,
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
  if (fiber && !fiber.dirty) {
    fiber.dirty = true
    fiber.tag = OP.UPDATE
    microTask.push(fiber)
  }
  scheduleWork(reconcileWork as ITaskCallback)
}

const reconcileWork = (timeout: boolean): boolean => {
  if (!WIP) WIP = microTask.shift()
  while (WIP && (!shouldYield() || timeout)) WIP = reconcile(WIP)
  if (WIP && !timeout) return reconcileWork.bind(null)
  if (preCommit) commitWork(preCommit)
  return null
}

const reconcile = (WIP: IFiber): IFiber | undefined => {
  WIP.parentNode = getParentNode(WIP) as HTMLElementEx
  isFn(WIP.type) ? updateHook(WIP) : updateHost(WIP)
  WIP.dirty = WIP.dirty ? false : 0
  WIP.parent && commits.push(WIP)

  if (WIP.child) return WIP.child
  while (WIP) {
    if (!preCommit && WIP.dirty === false) {
      preCommit = WIP
      return null
    }
    if (WIP.sibling) return WIP.sibling
    WIP = WIP.parent
  }
}

const updateHook = <P = Attributes>(WIP: IFiber): void => {
  if (WIP.lastProps === WIP.props) return
  currentFiber = WIP
  let children = (WIP.type as FC<P>)(WIP.props)
  resetCursor()
  if (isStr(children)) children = createText(children as string)
  reconcileChildren(WIP, children)
}

const updateHost = (WIP: IFiber): void => {
  if (!WIP.node) {
    WIP.node = createElement(WIP) as HTMLElementEx
  }
  reconcileChildren(WIP, WIP.props.children)
}

const getParentNode = (WIP: IFiber): HTMLElement | undefined => {
  while ((WIP = WIP.parent)) {
    if (!isFn(WIP.type)) return WIP.node
  }
}

const getChildNode = (WIP: IFiber): HTMLElement | undefined => {
  while ((WIP = WIP.child)) {
    if (!isFn(WIP.type)) return WIP.node
  }
}

const reconcileChildren = (WIP: any, children: FreNode): void => {
  let oldKids = WIP.kids || [],
    newKids = (WIP.kids = hashfy(children) as any),
    oldHead = 0,
    newHead = 0,
    oldTail = oldKids.length - 1,
    newTail = newKids.length - 1

  while (oldHead <= oldTail && newHead <= newTail) {
    let newFiber = null
    if (oldKids[oldHead] == null) {
      oldHead++
    } else if (oldKids[oldTail] == null) {
      oldTail--
    } else if (same(oldKids[oldHead], newKids[newHead])) {
      newFiber = newKids[newHead]
      ref(newFiber, oldKids[oldHead])
      newFiber.tag = OP.UPDATE
      oldHead++
      newHead++
    } else if (same(oldKids[oldTail], newKids[newTail])) {
      newFiber = newKids[newTail]
      ref(newFiber, oldKids[oldTail])
      newFiber.tag = OP.UPDATE
      oldTail--
      newTail--
    } else if (same(oldKids[oldHead], newKids[newTail])) {
      newFiber = newKids[newTail]
      ref(newFiber, oldKids[oldHead])
      newFiber.tag = OP.MOUNT
      newFiber.insertPoint = oldKids[oldTail].node.nextSibling
      oldHead++
      newTail--
    } else if (same(oldKids[oldTail], newKids[newHead])) {
      newFiber = newKids[newHead]
      ref(newFiber, oldKids[oldTail])
      newFiber.tag = OP.MOUNT
      newFiber.insertPoint = oldKids[oldHead].node
      oldTail--
      newHead++
    } else {
      const i = oldKids.findIndex((kid) => same(kid, newKids[newHead]))
      if (i >= 0) {
        const oldKid = oldKids[i]
        newFiber = newKids[newHead]
        ref(newFiber, oldKid)
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

function ref(a, b) {
  a.lastProps = b.props
  a.node = b.node
  a.kids = b.kids
  a.hooks = b.hooks
}

const commitWork = (fiber: IFiber): void => {
  commits.forEach(commit)
  deletes.forEach(commit)
  fiber.done?.()
  commits = []
  deletes = []
  preCommit = null
  WIP = null
}

const commit = (fiber: IFiber): void => {
  let { tag, parentNode, node, ref, hooks } = fiber
  if (isFn(fiber.type)) {
    if (!fiber.node) fiber.node = getChildNode(fiber) as any
    delete fiber.child.insertPoint
    if (hooks) {
      if (fiber.tag & OP.REMOVE) {
        hooks.list.forEach(cleanup)
      } else {
        side(fiber.hooks.layout)
        schedule(() => side(fiber.hooks.effect))
      }
    }
    if (fiber.tag & OP.INSERT && fiber.insertPoint === undefined) return
  }
  if (tag & OP.UPDATE) {
    updateElement(node, fiber.lastProps, fiber.props)
  }
  if (tag & OP.REMOVE) {
    node = null
    cleanupRef(fiber.kids)
    if (isChild(parentNode, fiber.node)) {
      parentNode.removeChild(fiber.node)
    }
  }
  if (tag & OP.INSERT) {
    const after = fiber.insertPoint as any
    if (after === fiber.node) return
    if (after === null && fiber.node === parentNode.lastChild) return
    parentNode.insertBefore(fiber.node, after)
  }
  refer(ref, node)
}

function isChild(p, c) {
  return Array.from(p.childNodes).some((i) => c == i)
}

const same = (a, b) => a.type === b.type && a.key === b.key

const hashfy = (arr) => {
  if (!arr) return []
  if (isArr(arr)) {
    let ar = arr
    while (ar.some((v) => isArr(v))) {
      ar = [].concat(...arr)
    }
    return ar.map((a, i) => {
      a.key = "." + (a.key || i)
      return a
    })
  } else {
    arr.key = arr.key || ".0"
    return [arr]
  }
}

const refer = (ref: IRef, dom?: HTMLElement): void => {
  if (ref)
    isFn(ref) ? ref(dom) : ((ref as { current?: HTMLElement })!.current = dom)
}

const cleanupRef = (kids: any): void => {
  kids.forEach((kid) => {
    refer(kid.ref, null)
    kid.kids && cleanupRef(kid.kids)
  })
}

const side = (effects: IEffect[]): void => {
  effects.forEach(cleanup)
  effects.forEach(effect)
  effects.length = 0
}

export const getCurrentFiber = () => currentFiber || null

const effect = (e: IEffect): void => {
  e[2] = e[0]()
}
const cleanup = (e: IEffect): void => {
  e[2] && e[2]()
}

export const isFn = (x: any): x is Function => typeof x === "function"
export const isStr = (s: any): s is number | string =>
  typeof s === "number" || typeof s === "string"
export const some = (v: any) => v != null && v !== false && v !== true
