import { IFiber, FreElement, ITaskCallback, FC, Attributes, HTMLElementEx, FreNode, IRef, IEffect } from './type'
import { createElement, updateElement } from './dom'
import { resetCursor } from './hooks'
import { scheduleWork, shouldYield, schedule } from './scheduler'
import { isArr, createText } from './h'
import { diff, Flag } from './diff'

let preCommit: IFiber | undefined
let currentFiber: IFiber
let current: IFiber = null
let fiber: IFiber | undefined
let commits = []
const microTask: IFiber[] = []

export const render = (vnode: FreElement, node: Node, done?: () => void): void => {
  const rootFiber = {
    node,
    props: {},
    children: [vnode],
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
  if (!fiber) fiber = microTask.shift()
  while (fiber && (!shouldYield() || timeout)) fiber = reconcile(fiber)
  if (fiber && !timeout) return reconcileWork.bind(null)
  if (preCommit) commitWork(preCommit)
  return null
}

const reconcile = (fiber: IFiber): IFiber | undefined => {
  const oldFiber = fiber.alternate
  const parent = oldFiber.parent.node
  const node = oldFiber.node
  if (!oldFiber) {
    // if there is no oldFiber, just mount subtree.
    commits.push(() => createNode(fiber))
  } else if (oldFiber && oldFiber.type !== fiber.type) {
    // if the type is different, remove old and create new.
    commits.push(
      () => parent.insertBefore(createNode(fiber = maybeFiber(fiber)), node),
      () => parent.removeChild(node)
    )
  } else if (oldFiber && oldFiber.type === Flag.Text) {
    commits.push(() => (oldFiber.node.nodeValue = fiber.props.nodeValue))
  } else {
    // berfore we use the lcs algorithm, prepare deal with children
    let oldKids = oldFiber.children
    let newKids = fiber.children
    console.log(oldKids, newKids)
    // step 1 common prefix/suffix 


    
  }

  if (fiber.child) return fiber.child
  while (fiber) {
    if (!preCommit && !fiber.parent) {
      preCommit = fiber
      return null
    }
    if (fiber.sibling) return fiber.sibling
    fiber = fiber.parent
  }
}

const updateHook = (fiber: IFiber, skip: boolean): any => {
  // this function do two things: run hook, and cache the double buffering.
  fiber.flag |= Flag.Hook
  resetCursor()
  currentFiber = fiber
  currentFiber.alternate = fiber
  return (fiber.type as any)(fiber.props, fiber.children)
}

const getParentNode = (fiber: IFiber): HTMLElement | undefined => {
  while ((fiber = fiber.parent)) {
    if (!isFn(fiber.type)) return fiber.node
  }
}

const reconcileChildren = (fiber: IFiber, children: any): void => {
  children = arrayfy(children)
  const oldFiber = fiber.alternate
  if (!oldFiber) {
    commits.push(() => createNode(fiber)) //mount
  } else {
    // generate the linked list
    for (var i = 0, prev, old = oldFiber?.child; i < children.length; i++) {
      const child = children[i]

      child.parent = fiber
      child.alternate = old

      if (i > 0) {
        prev.sibling = child
      } else {
        fiber.child = child
      }

      prev = child

      if (old) {
        old = old.sibling
      }
    }
  }
}

function createNode(fiber) {
  let node = fiber.flag & Flag.Root ? fiber.node : createElement(fiber)
  if (fiber.children) {
    for (var i = 0; i < fiber.children.length; i++) {
      let child = createNode(maybeFiber(fiber.children[i]))
      node.appendChild(child)
    }
  }
  return node
}

var maybeFiber = (fiber) =>
  isFn(fiber.type) ?
    updateHook(fiber, true)
    : fiber

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
