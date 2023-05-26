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

let currentFiber: IFiber = null
let deletions: any = []
let rootFiber = null

export const enum TAG {
  UPDATE = 1 << 1,
  INSERT = 1 << 2,
  REMOVE = 1 << 3,
  SVG = 1 << 4,
  DIRTY = 1 << 5,
  MOVE = 1 << 6,
  REPLACE = 1 << 7
}

export const render = (vnode: FreElement, node: Node): void => {
  rootFiber = {
    node,
    props: { children: vnode },
  } as IFiber
  update(rootFiber)
}

export const update = (fiber?: IFiber) => {
  schedule(() => reconcile(fiber))
}

const reconcile = (fiber?: IFiber): boolean => {
  while (fiber && !shouldYield()) fiber = capture(fiber)
  if (fiber) return reconcile.bind(null, fiber)
  commit(rootFiber, deletions)
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
  let aCh = fiber.kids || [],
    bCh = (fiber.kids = arrayfy(children) as any)
  const actions = diff1(aCh, bCh)

  for (let i = 0, prev = null, len = bCh.length; i < len; i++) {
    const child = bCh[i]
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

function clone(a, b) {
  b.hooks = a.hooks
  b.ref = a.ref
  b.node = a.node
  b.oldProps = a.props
  b.kids = a.kids
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

const diff = function (opts) {
  var actions = [],
    aIdx = {},
    bIdx = {},
    a = opts.old,
    b = opts.cur,
    key = opts.key,
    i, j;
  for (i = 0; i < a.length; i++) {
    aIdx[key(a[i])] = i;
  }
  for (i = 0; i < b.length; i++) {
    bIdx[key(b[i])] = i;
  }
  for (i = j = 0; i !== a.length || j !== b.length;) {
    var aElm = a[i], bElm = b[j];
    if (aElm === null) {
      i++;
    } else if (b.length <= j) {
      opts.remove(i)
      i++;
    } else if (a.length <= i) {
      opts.add(bElm, i)
      j++;
    } else if (key(aElm) === key(bElm)) {
      opts.update(aElm, bElm)
      i++; j++;
    } else {
      var curElmInNew = bIdx[key(aElm)]
      var wantedElmInOld = aIdx[key(bElm)]
      if (curElmInNew === undefined) {
        opts.remove(i);
        i++;
      } else if (wantedElmInOld === undefined) {
        opts.add(bElm, i)
        j++
      } else {
        opts.move(wantedElmInOld, i)
        a[wantedElmInOld] = null
        j++
      }
    }
  }
  return actions
}

var diff1 = function (a, b) {
  var actions = [];
  var extr = function (v) {
    return v.key;
  };
  var update = function (a, b) {
    clone(a, b)
    actions.push({ op: TAG.UPDATE, old: a, new: b })
  }
  var move = function (from, to) {
    clone(a, b)
    actions.push({ op: TAG.MOVE, elm: a[from], before: a[to] })
  };
  var add = function (elm, i) {
    actions.push({ op: TAG.INSERT, elm: elm, before: a[i] })
  };
  var remove = function (i) {
    actions.push({ op: TAG.REMOVE, elm: a[i], before: a[i + 1] })
  };
  diff({
    old: a,
    cur: b,
    key: extr,
    add, move, remove, update
  });
  return actions
}

export const getCurrentFiber = () => currentFiber || null
export const isFn = (x: any): x is Function => typeof x === 'function'
export const isStr = (s: any): s is number | string =>
  typeof s === 'number' || typeof s === 'string'