import { IFiber, FreElement, ITaskCallback, FC, Attributes, HTMLElementEx, FreNode, IRef, IEffect } from './type'
import { createElement, updateElement } from './dom'
import { resetCursor } from './hooks'
import { scheduleWork, shouldYield, schedule } from './scheduler'
import { isArr, createText } from './h'
import { diff, Flag } from './diff'

let preCommit: IFiber | undefined
let currentFiber: IFiber
let current: IFiber = null
let WIP: IFiber | undefined
let commits = []
const microTask: IFiber[] = []

export const render = (vnode: FreElement, node: Node, done?: () => void): void => {
  const rootFiber = {
    node,
    props: { children: vnode },
    flag: Flag.Root,
    done,
  } as IFiber
  dispatchUpdate(rootFiber)
}

export const dispatchUpdate = (fiber?: IFiber) => {
  if (fiber && !fiber.lane) {
    fiber.lane = true
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
  WIP.lane = WIP.lane ? false : 0
  // WIP.alternate = WIP

  if (WIP.child) return WIP.child
  while (WIP) {
    if (!preCommit && !WIP.parent) {
      preCommit = WIP
      return null
    }
    if (WIP.sibling) return WIP.sibling
    WIP = WIP.parent
  }
}

const updateHook = <P = Attributes>(WIP: IFiber): void => {
  WIP.flag |= Flag.Hook
  if (!WIP.node) WIP.node = WIP.parent.node
  currentFiber = WIP
  resetCursor()
  let children = (WIP.type as FC<P>)(WIP.props)
  if (isStr(children)) children = createText(children as string)
  reconcileChildren(WIP, children)
  currentFiber.alternate = WIP
}

const updateHost = (WIP: IFiber): void => {
  if (!WIP.node) {
    if (WIP.type === 'svg') WIP.flag |= Flag.Svg
    WIP.node = createElement(WIP) as HTMLElementEx
  }
  if (!WIP.flag) WIP.flag |= Flag.Host
  reconcileChildren(WIP, WIP.props.children)
}

const getParentNode = (WIP: IFiber): HTMLElement | undefined => {
  while ((WIP = WIP.parent)) {
    if (!isFn(WIP.type)) return WIP.node
  }
}

const reconcileChildren = (WIP: IFiber, children: any): void => {
  children = arrayfy(children)
  const oldFiber = WIP.alternate
  console.log(oldFiber,WIP)
  if (WIP.flag & Flag.Host) {
    if (!oldFiber) {
      // mount
      WIP.flag |= Flag.Place
      commits.push(() => commit(WIP))
    }
  }

  // generate the linked list
  for (var i = 0, prev, old = oldFiber?.child; i < children.length; i++) {
    const child = children[i]

    child.parent = WIP
    child.alternate = old

    if (i > 0) {
      prev.sibling = child
    } else {
      WIP.child = child
    }

    prev = child

    if (old) {
      if (old.type !== child.type) {
        continue
      } else {
        old = old.sibling
      }
    }
  }
}

const commit = (fiber) => {
  const { flag, parentNode, node, type } = fiber
  if (isFn(type)) {
  } else if (flag & Flag.Place) {
    parentNode.insertBefore(node, null)
  }
}

const commitWork = (fiber: IFiber): void => {
  commits.splice(0, commits.length).forEach((c) => c())
  fiber.done?.()
  preCommit = null
}
const onError = (e: any) => {
  if (isFn(e.error?.then)) {
    e.preventDefault()
    currentFiber.lane = 0
    currentFiber.hooks.list.forEach(reset)
    dispatchUpdate(currentFiber)
  }
}

const reset = (h: any) => (h[2] & (1 << 2) ? (h[2] = 0b1101) : h[2] & (1 << 3) ? (h[2] = 0b1010) : null)

const arrayfy = (arr) => (!arr ? [] : arr.pop ? arr : [arr])

const refer = (ref: IRef, dom?: HTMLElement): void => {
  if (ref) isFn(ref) ? ref(dom) : ((ref as { current?: HTMLElement })!.current = dom)
}

const cleanupRef = (children: any): void => {
  children.forEach((c) => {
    refer(c)
    c.children && cleanupRef(c.chidlren)
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

window.addEventListener('error', onError)
