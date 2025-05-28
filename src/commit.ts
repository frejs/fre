import { FiberFinish, FiberHost, HTMLElementEx, Fiber, Ref, TAG } from './type'
import { updateElement } from './dom'
import { isFn } from './reconcile'

export const commit = (fiber?: FiberFinish) => {
  if (!fiber) {
    return
  }
  refer(fiber.ref, fiber.node)

  commitSibling(fiber.child)
  const { op, ref, cur } = fiber.action || {}

  const parent = fiber?.parent?.node
  if (op & TAG.INSERT || op & TAG.MOVE) {
    console.log(cur.node.nodeValue, parent.nodeName)
    parent.insertBefore(cur.node, ref?.node)
  }
  if (op & TAG.REPLACE) {
    parent.replaceChild(cur.node, ref?.node)
    removeElement(ref, false)
  }
  if (op & TAG.UPDATE) {
    const node = fiber.node
    updateElement(
      node,
      (fiber.old as FiberHost).props || {},
      (fiber as FiberHost).props
    )
  }
  fiber.action = null

  commitSibling(fiber.sibling)

}

function commitSibling(fiber?: FiberFinish) {
  if (fiber?.memo) {
    commitSibling(fiber.sibling)
  } else {
    commit(fiber)
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

export const removeElement = (fiber: Fiber, flag: boolean = true) => {
  if (fiber.isComp) {
    fiber.hooks && fiber.hooks.list.forEach((e) => e[2] && e[2]())
  } else {
    if (flag) {
      (fiber.node.parentNode as any).removeChild(fiber.node)
      flag = false
    }
    kidsRefer(fiber.kids)
    refer(fiber.ref, null)
  }
  fiber.kids.forEach(v => removeElement(v, flag))
}
