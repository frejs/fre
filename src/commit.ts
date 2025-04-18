import { FiberFinish, FiberHost, HTMLElementEx, Fiber, Ref, TAG } from './type'
import { updateElement } from './dom'
import { getParentNode, isFn } from './reconcile'

export const commit = (fiber?: FiberFinish) => {
  if (!fiber) {
    return
  }
  const { op, ref, elm } = fiber.action || {}
  if (op & TAG.INSERT || op & TAG.MOVE) {
    const parent = fiber.parentNode as HTMLElementEx
    const node = getChildNode(elm)
    const refnode = getChildNode(ref)
    parent.insertBefore(node, refnode)
  }
  if (op & TAG.REPLACE) {
    const parent = fiber.parentNode as HTMLElementEx
    const node = getChildNode(elm)
    const refnode = getChildNode(ref)
    parent.replaceChild(node, refnode)
    // removeElement(fiber.alternate)
  }
  if (op & TAG.UPDATE) {
    const node = getChildNode(fiber)
    updateElement(
      node,
      (fiber.old as FiberHost).props || {},
      (fiber as FiberHost).props
    )
  }

  refer(fiber.ref, fiber.node)

  fiber.action = null

  commitSibling(fiber.child)
  commitSibling(fiber.sibling)
}

function commitSibling(fiber?: FiberFinish) {
  if (fiber?.memo) {
    commitSibling(fiber.sibling)
  } else {
    commit(fiber)
  }
}

const getChildNode = (fiber: Fiber): HTMLElementEx => {
  if (fiber == null) return null
  if (fiber.isComp) {
    while ((fiber = fiber.child)) {
      if (!fiber.isComp) return fiber.node
    }
  } else {
    return fiber.node
  }


}
const refer = (ref?: Ref<HTMLElementEx>, dom?: HTMLElementEx) => {
  if (ref) isFn(ref) ? ref(dom) : (ref.current = dom)
}

const kidsRefer = (kids: Fiber[]) => {
  kids.forEach((kid) => {
    kid.kids && kidsRefer(kid.kids)
    refer(kid.ref, null)
  })
}

export const removeElement = (fiber: Fiber) => {
  if (fiber.isComp) {
    fiber.hooks && fiber.hooks.list.forEach((e) => e[2] && e[2]())
    fiber.kids.forEach(removeElement as any)
  } else {
    // @ts-expect-error
    fiber.parentNode.removeChild(fiber.node)
    kidsRefer(fiber.kids)
    refer(fiber.ref, null)
  }
}
