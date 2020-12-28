import { IFiber, FreElement, ITaskCallback, FC, Attributes, HTMLElementEx, FreNode, FiberMap, IRef, IEffect } from './type'
import { createElement, updateElement } from './dom'
import { resetCursor } from './hooks'
import { scheduleWork, shouldYield, schedule } from './scheduler'
import { isArr, createText } from './h'

let preCommit: IFiber | undefined
let currentFiber: IFiber
let WIP: IFiber | undefined
let commits: IFiber[] = []
let deletes = []

const microTask: IFiber[] = []
export const enum OP {
  REMOVE = 1 << 1,
  UPDATE = 1 << 2,
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
  console.log(WIP)
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
  resetCursor()
  let children = (WIP.type as FC<P>)(WIP.props)
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
    } else if (oldKids[oldHead].key === newKids[newHead].key) {
      newFiber = newKids[newHead]
      newFiber.tag = OP.UPDATE
      newFiber.lastProps = oldKids[oldHead].props
      newFiber.kids = oldKids[oldHead].kids
      newFiber.node = oldKids[oldHead].node
      oldHead++
      newHead++
    } else if (oldKids[oldTail].key === newKids[newTail].key) {
      newFiber = newKids[newTail]
      newFiber.tag = OP.UPDATE
      newFiber.kids = oldKids[oldTail].kids
      newFiber.node = oldKids[oldTail].node
      newFiber.lastProps = oldKids[oldTail].props
      oldTail--
      newTail--
    } else if (oldKids[oldHead].key === newKids[newTail].key) {
      newFiber = newKids[newTail]
      newFiber.tag = OP.MOUNT
      newFiber.lastProps = oldKids[oldHead].props
      newFiber.node = oldKids[oldHead].node
      newFiber.kids = oldKids[oldHead].kids
      newFiber.insertPoint = oldKids[oldTail].node.nextSibling
      oldHead++
      newTail--
    } else if (oldKids[oldTail].key === newKids[newHead].key) {
      newFiber = newKids[newHead]
      newFiber.tag = OP.MOUNT
      newFiber.lastProps = oldKids[oldTail].props
      newFiber.node = oldKids[oldTail].node
      newFiber.kids = oldKids[oldTail].kids
      newFiber.insertPoint = oldKids[oldHead].node
      oldTail--
      newHead++
    } else {
      const i = oldKids.findIndex((kid) => kid?.key === newKids[newHead].key)
      if (i >= 0) {
        const oldKid = oldKids[i]
        newFiber = newKids[newHead]
        newFiber.tag = OP.MOUNT
        newFiber.lastProps = oldKid.props
        newFiber.node = oldKid.node
        newFiber.kids = oldKid.kids
        oldKids[i] = null
        newFiber.insertPoint = oldKids[oldHead]?.node
      } else {
        newFiber = newKids[newHead]
        newFiber.tag = OP.INSERT
        newFiber.node = null
        newFiber.insertPoint = oldKids[oldHead]?.node // === append
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
    if (!fiber.node) {
      fiber.node = getChildNode(fiber) as any
    }
    fiber.child.insertPoint = fiber.insertPoint
    if ((fiber.tag & OP.INSERT) && fiber.insertPoint === undefined) return
    if (hooks) {
      if (fiber.tag & OP.REMOVE) {
        console.log(hooks.list)
        hooks.list.forEach(cleanup)
        cleanupRef(fiber.kids)
      } else {
        side(hooks.layout)
        schedule(() => side(hooks.effect))
      }
    }
  }
  if (tag & OP.UPDATE) {
    updateElement(node, fiber.lastProps, fiber.props)
  }
  if (tag & OP.REMOVE) {
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
  return Array.from(p.childNodes).some(i => c == i)
}

const hashfy = (arr) => {
  if (!arr) return []
  if (isArr(arr)) {
    let ar = arr
    while (ar.some((v) => isArr(v))) {
      ar = [].concat(...arr)
    }
    return ar.map((a, i) => {
      a.key = '.' + a.key || '.' + i
      return a
    })
  } else {
    arr.key = arr.key || '.0'
    return [arr]
  }
}

const refer = (ref: IRef, dom?: HTMLElement): void => {
  if (ref) isFn(ref) ? ref(dom) : ((ref as { current?: HTMLElement })!.current = dom)
}

const cleanupRef = (kids: any): void => {
  kids.forEach(kid => {
    refer(kid)
    kid.kids && cleanupRef(kid.kids)
  })

}

const side = (effects: IEffect[]): void => {
  effects.forEach(cleanup)
  effects.forEach(effect)
  effects.length = 0
}

export const getCurrentFiber = () => currentFiber || null

const effect = (e: IEffect): void => (e[2] = e[0](currentFiber))
const cleanup = (e: IEffect): void => e[2]?.(currentFiber)

export const isFn = (x: any): x is Function => typeof x === 'function'
export const isStr = (s: any): s is number | string => typeof s === 'number' || typeof s === 'string'
export const some = (v: any) => v != null && v !== false && v !== true
