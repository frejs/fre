import { IFiber, IRef } from './type'
import { updateElement } from './dom'
import { isFn, TAG } from './reconcile'

export const commit = (fiber: IFiber): void => {
  commitWork(fiber)
}

const commitWork = (fiber: any) => {
  if (!fiber) {
    return
  }
  const { op, before, elm } = fiber.action || {}
  if (op === TAG.REMOVE) {
    remove(fiber)
    return
  }
  if (op & TAG.INSERT || op & TAG.MOVE) {
    if (fiber.isComp) {
      console.log(fiber.action.op)
      fiber.child.action.op = fiber.action.op
    } else {
      fiber.parentNode.insertBefore(elm.node, before?.node)
    }
  }
  if (op & TAG.UPDATE) {
    if (fiber.isComp) {
      fiber.child.action.op = fiber.action.op
    } else {
      updateElement(fiber.node, fiber.old.props || {}, fiber.props)
    }
  }
  if (op & TAG.REPLACE) {
    console.log(elm.node, elm.node)
    fiber.parentNode.replaceChild(before, elm)
  }

  refer(fiber.ref, fiber.node)

  fiber.action = null

  commitWork(fiber.child)
  commitWork(fiber.sibling)
}

const refer = (ref: IRef, dom?: HTMLElement): void => {
  if (ref)
    isFn(ref) ? ref(dom) : ((ref as { current?: HTMLElement })!.current = dom)
}

const kidsRefer = (kids: any): void => {
  kids.forEach(kid => {
    kid.kids && kidsRefer(kid.kids)
    refer(kid.ref, null)
  })
}

const remove = fiber => {
  if (fiber.isComp) {
    fiber.hooks && fiber.hooks.list.forEach(e => e[2] && e[2]())
    fiber.kids.forEach(remove)
  } else {
    kidsRefer(fiber.kids)
    refer(fiber.ref, null)
  }
}