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

const reconcile = (wip?: IFiber): boolean => {
  while (wip && !shouldYield()) wip = capture(wip)
  if (wip) return reconcile.bind(null, wip)
  return null
}

const memo = (wip) => {
  if ((wip.type as FC).memo && wip.oldProps) {
    let scu = (wip.type as FC).shouldUpdate || shouldUpdate
    if (!scu(wip.props, wip.oldProps)) { // fast-fix
      return getSibling(wip)
    }
  }
  return null
}

const capture = (wip: IFiber): IFiber | undefined => {
  wip.isComp = isFn(wip.type)
  if (wip.isComp) {
    const memoFiber = memo(wip)
    if (memoFiber) {
      return memoFiber
    }
    updateHook(wip)
  } else {
    updateHost(wip)
  }
  if (wip.child) return wip.child
  const sibling = getSibling(wip)
  return sibling
}

const getSibling = (wip) => {
  while (wip) {
    bubble(wip)
    if (wip.lane & TAG.DIRTY) {
      wip.lane &= ~TAG.DIRTY
      commit(wip)
      return null
    }
    if (wip.sibling) return wip.sibling
    wip = wip.parent
  }
  return null
}

const bubble = wip => {
  if (wip.isComp) {
    if (wip.hooks) {
      side(wip.hooks.layout)
      schedule(() => side(wip.hooks.effect))
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

const updateHook = <P = Attributes>(wip: IFiber): any => {
  resetCursor()
  currentFiber = wip
  let children = (wip.type as FC<P>)(wip.props)
  diffKids(wip, simpleVnode(children))
}

const updateHost = (wip: IFiber): void => {
  wip.parentNode = (getParentNode(wip) as any) || {}
  if (!wip.node) {
    if (wip.type === 'svg') wip.lane |= TAG.SVG
    wip.node = createElement(wip) as HTMLElementEx
  }
  wip.childNodes = Array.from(wip.node.childNodes || [])
  diffKids(wip, wip.props.children)
}

const simpleVnode = (type: any) =>
  isStr(type) ? createText(type as string) : type

const getParentNode = (wip: IFiber): HTMLElement | undefined => {
  while ((wip = wip.parent)) {
    if (!wip.isComp) return wip.node
  }
}

const diffKids = (wip: any, children: FreNode): void => {
  let isMount = !wip.kids,
    aCh = wip.kids || [],
    bCh = (wip.kids = arrayfy(children) as any),
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
    const after = wip.node?.childNodes[aIndex]
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
    if (wip.lane & TAG.SVG) {
      child.lane |= TAG.SVG
    }
    child.parent = wip
    if (i > 0) {
      prev.sibling = child
    } else {
      wip.child = child
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