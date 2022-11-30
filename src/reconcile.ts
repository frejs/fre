import {
  IFiber,
  FreElement,
  FC,
  Attributes,
  HTMLElementEx,
  FreNode,
  IEffect,
} from './type'
import { createElement } from './dom'
import { resetCursor } from './hook'
import { schedule, shouldYield } from './schedule'
import { isArr, createText } from './h'
import { commit } from './commit'

let currentFiber: IFiber
let effectlist: any = {}

export const enum TAG {
  UPDATE = 1 << 1,
  INSERT = 1 << 2,
  REMOVE = 1 << 3,
  SVG = 1 << 4,
  DIRTY = 1 << 5,
  NOWORK = 1 << 6,
}

export const render = (vnode: FreElement, node: Node): void => {
  const rootFiber = {
    node,
    props: { children: vnode },
  } as IFiber
  update(rootFiber)
}

export const update = (fiber?: IFiber) => {
  if (fiber && !(fiber.lane & TAG.DIRTY)) {
    fiber.lane = TAG.UPDATE | TAG.DIRTY
    schedule(() => {
      effectlist = fiber
      return reconcile(fiber)
    })
  }
}

const reconcile = (fiber?: IFiber): boolean => {
  while (fiber && !shouldYield()) fiber = capture(fiber)
  if (fiber) return reconcile.bind(null, fiber)
  return null
}

const memo = (fiber) => {
  if ((fiber.type as FC).memo && fiber.oldProps) {
    let scu = (fiber.type as FC).shouldUpdate || shouldUpdate
    if (!scu(fiber.props, fiber.oldProps)) { // fast-fix
      return getSibling(fiber)
    }
  }
  return null
}

const capture = (fiber: IFiber): IFiber | undefined => {
  fiber.isComp = isFn(fiber.type)
  if (fiber.isComp) {
    const memoFiber = memo(fiber)
    if (memoFiber) {
      return memoFiber
    }
    updateHook(fiber)
  } else {
    updateHost(fiber)
  }
  if (fiber.child) return fiber.child
  const sibling = getSibling(fiber)
  return sibling
}

const getSibling = (fiber) => {
  while (fiber) {
    bubble(fiber)
    if (fiber.lane & TAG.DIRTY) {
      fiber.lane &= ~TAG.DIRTY
      commit(fiber)
      return null
    }
    if (fiber.sibling) return fiber.sibling
    fiber = fiber.parent
  }
  return null
}

const bubble = fiber => {
  if (fiber.isComp) {
    if (fiber.hooks) {
      side(fiber.hooks.layout)
      schedule(() => side(fiber.hooks.effect))
    }
  }
}

const append = function (fiber) {
  effectlist.next = fiber
  effectlist = fiber
}

const shouldUpdate = (a, b) => {
  for (let i in a) if (!(i in b)) return true
  for (let i in b) if (a[i] !== b[i]) return true
}

const updateHook = <P = Attributes>(fiber: IFiber): any => {
  resetCursor()
  currentFiber = fiber
  let children = (fiber.type as FC<P>)(fiber.props)
  diffKids(fiber, simpleVnode(children))
}

const updateHost = (fiber: IFiber): void => {
  fiber.parentNode = (getParentNode(fiber) as any) || {}
  if (!fiber.node) {
    if (fiber.type === 'svg') fiber.lane |= TAG.SVG
    fiber.node = createElement(fiber) as HTMLElementEx
  }
  fiber.childNodes = Array.from(fiber.node.childNodes || [])
  diffKids(fiber, fiber.props.children)
}

const simpleVnode = (type: any) =>
  isStr(type) ? createText(type as string) : type

const getParentNode = (fiber: IFiber): HTMLElement | undefined => {
  while ((fiber = fiber.parent)) {
    if (!fiber.isComp) return fiber.node
  }
}

const diffKids = (fiber: any, children: FreNode): void => {
  let isMount = !fiber.kids,
    aCh = fiber.kids || [],
    bCh = (fiber.kids = arrayfy(children) as any),
    aHead = 0,
    bHead = 0,
    aTail = aCh.length - 1,
    bTail = bCh.length - 1

  while (aHead <= aTail && bHead <= bTail) {
    if (!same(aCh[aHead], bCh[bHead])) break
    clone(aCh[aHead++], bCh[bHead++], TAG.UPDATE)
  }

  while (aHead <= aTail && bHead <= bTail) {
    if (!same(aCh[aTail], bCh[bTail])) break
    clone(aCh[aTail--], bCh[bTail--], TAG.UPDATE)
  }

  const { diff, keymap } = LCSdiff(bCh, aCh, bHead, bTail, aHead, aTail)


  for (let i = 0, aIndex = aHead, bIndex = bHead, mIndex; i < diff.length; i++) {
    const op = diff[i]
    const after = fiber.node?.childNodes[aIndex]
    if (op === TAG.UPDATE) {
      if (!same(aCh[aIndex], bCh[bIndex])) {
        bCh[bIndex].lane = TAG.INSERT
        bCh[bIndex].after = after
        aCh[aIndex].lane = TAG.REMOVE
        append(aCh[aIndex])
        append(bCh[bIndex])
      } else {
        clone(aCh[aIndex], bCh[bIndex], TAG.UPDATE)
      }
      aIndex++
      bIndex++
    } else if (op === TAG.INSERT) {
      let c = bCh[bIndex]
      mIndex = c.key != null ? keymap[c.key] : null
      if (mIndex != null) {
        c.after = after
        clone(aCh[mIndex], c, TAG.INSERT)
        aCh[mIndex] = undefined
      } else {
        c.after = isMount ? null : after
        c.lane = TAG.INSERT
        append(c)
      }
      bIndex++
    } else if (op === TAG.REMOVE) {
      aIndex++
    }
  }

  for (let i = 0, aIndex = aHead; i < diff.length; i++) {
    let op = diff[i]
    if (op === TAG.UPDATE) {
      aIndex++
    } else if (op === TAG.REMOVE) {
      let c = aCh[aIndex]
      if (c !== undefined) {
        c.lane = TAG.REMOVE
        append(c)
      }
      aIndex++
    }
  }

  for (let i = 0, prev = null, len = bCh.length; i < len; i++) {
    const child = bCh[i]
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

function clone(a, b, lane) {
  b.hooks = a.hooks
  b.ref = a.ref
  b.node = a.node
  b.oldProps = a.props
  b.lane = lane
  b.kids = a.kids
  append(b)
}

const same = (a, b) => {
  return a && b && a.key === b.key && a.type === b.type
}

export const arrayfy = arr => (!arr ? [] : isArr(arr) ? arr : [arr])

const side = (effects: IEffect[]): void => {
  effects.forEach(e => e[2] && e[2]())
  effects.forEach(e => (e[2] = e[0]()))
  effects.length = 0
}

function LCSdiff(
  bArr,
  aArr,
  bHead = 0,
  bTail = bArr.length - 1,
  aHead = 0,
  aTail = aArr.length - 1
) {
  let keymap = {},
    unkeyed = [],
    idxUnkeyed = 0,
    ch,
    item,
    k,
    idxInOld,
    key

  let newLen = bArr.length
  let oldLen = aArr.length
  let minLen = Math.min(newLen, oldLen)
  let tresh = Array(minLen + 1)
  tresh[0] = -1

  for (var i = 1; i < tresh.length; i++) {
    tresh[i] = aTail + 1
  }
  let link = Array(minLen)

  for (i = aHead; i <= aTail; i++) {
    item = aArr[i]
    key = item.key
    if (key != null) {
      keymap[key] = i
    } else {
      unkeyed.push(i)
    }
  }

  for (i = bHead; i <= bTail; i++) {
    ch = bArr[i]
    idxInOld = ch.key == null ? unkeyed[idxUnkeyed++] : keymap[ch.key]
    if (idxInOld != null) {
      k = bs(tresh, idxInOld)
      if (k >= 0) {
        tresh[k] = idxInOld
        link[k] = { newi: i, oldi: idxInOld, prev: link[k - 1] }
      }
    }
  }

  k = tresh.length - 1
  while (tresh[k] > aTail) k--

  let ptr = link[k]
  let diff = Array(oldLen + newLen - k)
  let curNewi = bTail,
    curOldi = aTail
  let d = diff.length - 1
  while (ptr) {
    const { newi, oldi } = ptr
    while (curNewi > newi) {
      diff[d--] = TAG.INSERT
      curNewi--
    }
    while (curOldi > oldi) {
      diff[d--] = TAG.REMOVE
      curOldi--
    }
    diff[d--] = TAG.UPDATE
    curNewi--
    curOldi--
    ptr = ptr.prev
  }
  while (curNewi >= bHead) {
    diff[d--] = TAG.INSERT
    curNewi--
  }
  while (curOldi >= aHead) {
    diff[d--] = TAG.REMOVE
    curOldi--
  }
  return {
    diff,
    keymap,
  }
}

function bs(ktr, j) {
  let lo = 1
  let hi = ktr.length - 1
  while (lo <= hi) {
    let mid = (lo + hi) >>> 1
    if (j < ktr[mid]) hi = mid - 1
    else lo = mid + 1
  }
  return lo
}

export const getCurrentFiber = () => currentFiber || null
export const isFn = (x: any): x is Function => typeof x === 'function'
export const isStr = (s: any): s is number | string =>
  typeof s === 'number' || typeof s === 'string'