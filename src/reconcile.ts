import {
  Fiber,
  FC,
  HookEffect,
  FreText,
  TAG,
  MODE,
  FiberHost,
  FiberFinish,
  SUSPENSE_FALLBACK_KEY
} from './type'
import { resetCursor } from './hook'
import { schedule, shouldYield } from './schedule'
import { isArr, createText, Suspense, ErrorBoundary } from './h'
import { commit, createNodes, flushEffects, removeElement } from './commit'

let currentFiber: Fiber | null = null
const suspendPromiseMap = new WeakMap<Promise<any>, Set<Fiber>>()
let pendingRemovals: Fiber[] = []
let pendingLayoutEffects: HookEffect[] = []
let pendingEffects: HookEffect[] = []

export const render = (vnode: Fiber, node: Node) => {
  let rootFiber = {
    node,
    props: { children: vnode },
  } as Fiber

  update(rootFiber)
}

export const update = (fiber: Fiber) => {
  if (!fiber.dirty) {
    fiber.dirty = true
    schedule(() => reconcile(fiber))
  }
}

const reconcile = (fiber: Fiber) => {
  while (fiber && !shouldYield()) {
    fiber = capture(fiber) as any
  }
  return fiber ? reconcile.bind(null, fiber) : null
}

export const getBoundary = (fiber: Fiber, name: string) => {
  let current = fiber.parent
  while (current) {
    if (current.type === name) return current
    current = current.parent
  }
  return null
}
const errorBoundaryRender = (fiber: Fiber, error: any) => {
  const boundary = getBoundary(fiber, ErrorBoundary as any)
  if (!boundary) throw error
  const formatError = error instanceof Error ? error : new Error(error)
  reconcileChildren(boundary, isFn(boundary.props.fallback) ? boundary.props.fallback({ error: formatError }) : simpleVnode(boundary.props.fallback))
  return boundary
}
const suspenseRender = (fiber: Fiber, promise: Promise<any>) => {
  const boundary = getBoundary(fiber, Suspense as any)
  if (!boundary) throw promise
  const primaryChildren = boundary.props.children
  const primaryChildFragment = {
    type: null,
    props: { children: primaryChildren },
    mode: MODE.OFFSCREEN,
    kids: [],
  }
  const fallbackFragment = simpleVnode(boundary.props.fallback)
  fallbackFragment.key = SUSPENSE_FALLBACK_KEY
  reconcileChildren(boundary, [primaryChildFragment as any, fallbackFragment])
  let pSet = suspendPromiseMap.get(promise)
  if (!pSet) {
    suspendPromiseMap.set(promise, new Set([boundary]))
    promise.then(() => {
      const s = suspendPromiseMap.get(promise);
      ([...s]).filter(b => !(b.flag && (b.flag & TAG.REPLACE || b.flag & TAG.REMOVE))).forEach(b => update(b))
    }).finally(() => suspendPromiseMap.delete(promise))
  } else pSet.add(boundary)
  return boundary.child
}

const capture = (fiber: Fiber) => {
  fiber.isComp = isFn(fiber.type)

  if (fiber.isComp) {
    if (isMemo(fiber)) {
      fiber.memo = false
      return sibling(fiber)
    }
    const isMatchSuspenseOrErrorBoundary = updateHook(fiber)
    if (isMatchSuspenseOrErrorBoundary) {
      return isMatchSuspenseOrErrorBoundary
    }
  } else {
    updateHost(fiber as FiberHost)
  }
  return fiber.child || sibling(fiber)
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

const sibling = (fiber?: Fiber) => {
  while (fiber) {
    bubble(fiber)
    if (fiber.dirty) {
      fiber.dirty = false
      createNodes(fiber as FiberFinish)
      commit(fiber as FiberFinish)
      // Process deferred removals (DOM removal via hostConfig)
      pendingRemovals.forEach(f => removeElement(f))
      pendingRemovals = []
      flushEffects(pendingLayoutEffects)
      if (pendingEffects.length) {
        const effects = pendingEffects.slice()
        pendingEffects = []
        schedule(() => { flushEffects(effects); return null })
      }
      pendingLayoutEffects = []
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
      if (fiber.hooks.layout.length) {
        pendingLayoutEffects.push(...fiber.hooks.layout)
        fiber.hooks.layout.length = 0
      }
      if (fiber.hooks.effect.length) {
        pendingEffects.push(...fiber.hooks.effect)
        fiber.hooks.effect.length = 0
      }
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
  resetFiber(fiber)
  try {
    let children = (fiber.type as FC)(fiber.props)
    reconcileChildren(fiber, simpleVnode(children))
  } catch (e) {
    if (e instanceof Promise) {
      return suspenseRender(fiber, e)?.sibling
    } else {
      return errorBoundaryRender(fiber, e).child
    }
  }
}

const updateHost = (fiber: FiberHost) => {
  if (fiber.type === 'svg') {
    fiber.lane |= TAG.SVG
  }
  if (!fiber.action) {
    fiber.action = fiber.node ? { op: 0 as TAG } : { op: TAG.INSERT }
  }

  reconcileChildren(fiber, fiber.props.children)
}

const simpleVnode = (type: Fiber | FreText) =>
  isStr(type) ? createText(type) : type

const reconcileChildren = (
  fiber: Fiber,
  children: Fiber | Fiber[] | null | undefined
) => {
  let aCh = fiber.kids || [],
    bCh = arrayfy(children).filter((ch) => ch != null) as Fiber[]
  fiber.kids = bCh
  const actions = diff(aCh, bCh)

  for (let i = 0, prev = null, len = bCh.length; i < len; i++) {
    const child = bCh[i]
    if (!child) continue
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
  if (!a || !b) return
  b.hooks = a.hooks
  b.ref = a.ref
  b.node = a.node
  if (a.type !== b.type) {
    b.kids = null
  } else {
    b.kids = a.kids
  }
  a.flag = TAG.REPLACE
  b.alternate = a
}

const arrayfy = <T>(arr: T | T[] | null | undefined) =>
  !arr ? [] : isArr(arr) ? arr : [arr]

const diff = (aCh: Fiber[], bCh: Fiber[]) => {
  let aHead = 0,
    bHead = 0,
    aTail = aCh.length - 1,
    bTail = bCh.length - 1,
    bMap: Record<any, number> | null = null,
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

  while (aHead <= aTail || bHead <= bTail) {
    const aElm = aCh[aHead]
    const bElm = bCh[bHead]

    if (aElm === null) {
      aHead++
    } else if (bTail < bHead) {
      pendingRemovals.push(aElm)
      aHead++
    } else if (aTail < aHead) {
      actions.push({ op: TAG.INSERT, cur: bElm, ref: aElm })
      bHead++
    } else if (same(aElm, bElm)) {
      clone(aElm, bElm)
      actions.push({ op: TAG.UPDATE })
      aHead++
      bHead++
    } else {
      let foundB: number | null = null
      if (aElm.key) {
        if (!bMap) {
          bMap = {}
          for (let i = bHead; i <= bTail; i++) {
            if (bCh[i].key) bMap[bCh[i].key] = i
          }
        }
        foundB = bMap[aElm.key] ?? null
      }

      if (foundB != null && aElm.type !== bCh[foundB].type) {
        foundB = null
      }

      if (foundB == null) {
        pendingRemovals.push(aElm)
        aHead++
      } else if (bHead <= foundB) {
        actions.push({ op: TAG.INSERT, cur: bElm, ref: aElm })
        bHead++
      } else {
        clone(aElm, bCh[foundB])
        actions.push({ op: TAG.MOVE, cur: aElm, ref: aCh[aHead] })
        aCh[aHead] = null
        aHead++
      }
    }
  }

  for (let i = temp.length - 1; i >= 0; i--) {
    actions.push(temp[i])
  }
  return actions
}

const same = (a: Fiber, b: Fiber) => a && b && (a.type === b.type && a.key === b.key)

export const useFiber = () => currentFiber || null
export const resetFiber = (fiber: Fiber) => currentFiber = fiber
export const isFn = (x: unknown): x is Function => typeof x === 'function'
export const isStr = (s: unknown): s is number | string =>
  typeof s === 'number' || typeof s === 'string'
