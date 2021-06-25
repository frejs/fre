import { IFiber, IRef, } from "./type"
import { updateElement } from "./dom"
import { isFn, LANE } from './reconcile'

export const commit = (fiber: IFiber): void => {
  let d = fiber
  let e = d.e
  d.e = null
  do {
    let s = e.s
    while (s && isFn(s.type)) {
      s = s.child
    }
    e.s = s
    insert(e)
  } while (e = e.e)

  while (d = d.d) remove(d)
}

const insert = (fiber: IFiber): void => {
  let { lane, parentNode, node, ref } = fiber
  let s = fiber.s
  if (s) s.prev = fiber
  if (lane & LANE.UPDATE) {
    updateElement(node, fiber.lastProps || {}, fiber.props)
  }
  if (lane & LANE.INSERT) {
    const after = fiber.prev?.node
    parentNode.insertBefore(node, after)
  }
  refer(ref, node)
}

const refer = (ref: IRef, dom?: HTMLElement): void => {
  if (ref)
    isFn(ref) ? ref(dom) : ((ref as { current?: HTMLElement })!.current = dom)
}

const kidsRefer = (kids: any): void => {
  kids.forEach((kid) => {
    kid.kids && kidsRefer(kid.kids)
    refer(kid.ref, null)
  })
}

const remove = (d) => {
  if (isFn(d.type)) {
    d.child.lane = LANE.REMOVE
    remove(d.child)
  } else {
    kidsRefer(d.kids)
    d.parentNode.removeChild(d.node)
    refer(d.ref, null)
    d.lane = 0
  }
}