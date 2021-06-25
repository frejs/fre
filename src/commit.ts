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
    paint(e)
  } while (e = e.e)

  while (d = d.d) {
    if (isFn(d.type)) {
      d.child.lane = LANE.REMOVE
      paint(d.child)
    } else {
      paint(d)
    }
  }
}

const paint = (fiber: IFiber): void => {
  let { lane, parentNode, node, ref } = fiber
  if (lane & LANE.REMOVE) {
    kidsRefer(fiber.kids)
    parentNode.removeChild(fiber.node)
    refer(ref, null)
    fiber.lane = 0
    return
  }
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