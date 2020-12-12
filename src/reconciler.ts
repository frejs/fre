import { IFiber, FreElement, ITaskCallback, FC, Attributes, HTMLElementEx, FreNode, IRef, IEffect } from './type'
import { createElement, updateElement, insert, create, remove } from './dom'
import { resetCursor } from './hooks'
import { scheduleWork, shouldYield, schedule } from './scheduler'
import { diff, Flag } from './diff'

let preCommit: IFiber | undefined
let currentFiber: IFiber
let alternate = null
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

function commit(op) {
  commits.push(op)
}

const reconcile = (fiber: IFiber): IFiber | undefined => {
  let oldFiber = fiber.alternate
  const parent = oldFiber?.parent?.node
  const node = oldFiber?.node

  if (!oldFiber) {
    // if there is no oldFiber, just mount subtree.
    commit(() => create(fiber))
  } else if (oldFiber && oldFiber.type !== fiber.type) {
    // if the type is different, remove old and create new.
    commit(() => parent.insertBefore(create(fiber), node))
    commit(() => parent.removeChild(node))
  } else if (oldFiber && oldFiber.type === Flag.Text) {
    commit(() => (oldFiber.node.nodeValue = fiber.props.nodeValue))
  } else {
    let oldKids = oldFiber.children,
      newKids = kid(fiber),
      oldHead = 0,
      newHead = 0,
      oldTail = oldKids.length - 1,
      newTail = newKids.length - 1
    while (oldHead <= oldTail && newHead <= newTail) {
      if (oldKids[oldHead] == null) {
        oldHead++
      } else if (oldKids[oldTail] == null) {
        oldTail--
      } else if (oldKids[oldHead].key === newKids[newHead].key) {
        // commit(() => update(parent, oldKids[oldHead], newKids[newHead]))
        oldHead++
        newHead++
      } else if (oldKids[oldTail].key === newKids[newTail].key) {
        // commit(() => update(parent, oldKids[oldTail], newKids[newTail]))
        oldTail--
        newTail--
      } else if (oldKids[oldHead].key === newKids[newTail].key) {
        // commit(() => update(parent, oldKids[oldHead], newKids[newTail]))
        commit(() => insert(parent, oldKids[oldHead].node, oldKids[oldTail + 1].node))
        oldHead++
        newTail--
      } else if (oldKids[oldTail].key === newKids[newHead].key) {
        // commit(() => update(parent, oldKids[oldTail], newKids[newHead]))
        commit(() => insert(parent, oldKids[oldTail].node, oldKids[oldHead].node))
        oldTail--
        newHead++
      } else {
        const i = oldKids.findIndex((kid) => kid.key === newKids[newHead].key)
        if (i >= 0) {
          const kid = oldKids[i]
          // commit(() => update(parent, kid, newKids[newHead]))
          commit(() => insert(parent, kid.node, oldKids[oldHead].node))
          oldKids[i] = null
        } else {
          commit(() => insert(parent, create(newKids[newHead]), oldKids[oldHead].node))
        }
        newHead++
      }
    }
    if (oldHead > oldTail) {
      commit(() => {
        for (let i = newHead; i <= newTail; i++) insert(parent, create(newKids[i]), oldKids[oldHead])
      })
    } else if (newHead > newTail) {
      commit(() => {
        for (let i = oldHead; i <= oldTail; i++) remove(parent, oldKids[i].node)
      })
    }
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

const updateHook = (fiber: IFiber): any => {
  fiber.flag |= Flag.Hook
  resetCursor()
  currentFiber = fiber
  const child = (fiber.type as any)(fiber.props, fiber.children)
  currentFiber.alternate = fiber
  currentFiber.children = child
  return child
}

const updateHost = (fiber: IFiber): any => {
  fiber.flag |= Flag.Host
  if (!fiber.node) {
    fiber.node = createElement(fiber) as any
  }
  return fiber
}

export const kid = (fiber) => (isFn(fiber.type) ? updateHook(fiber) : updateHost(fiber))

const commitWork = (fiber: IFiber): void => {
  commits.splice(0, commits.length).forEach((c) => c())
  fiber.done?.()
  preCommit = null
}

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
