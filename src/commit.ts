import { IFiber, IRef, } from "./type"
import { updateElement } from "./dom"
import { isFn, LANE } from './reconciler'

export const commitWork = (fiber: IFiber): void => {
  let eff = fiber
  while (eff) {
    commit(eff)
    eff = eff.next
  }
  fiber.done?.()
}

const commit = (fiber: IFiber): void => {
  let { lane, parentNode, node, ref } = fiber
  if (isFn(fiber.type)) return
  if (lane & LANE.REMOVE) {
    kidsRefer(fiber.kids)
    parentNode.removeChild(fiber.node)
    refer(ref, null)
    fiber.lane = 0
    return
  }
  if (lane & LANE.UPDATE) {
    updateElement(node, fiber.lastProps || {}, fiber.props)
  }
  if (lane & LANE.INSERT) {
    let sibling = fiber.sibling
    if (sibling) sibling.prev = fiber
    parentNode.insertBefore(node, fiber.prev?.node)
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