import { FiberFinish, FiberHost, Fiber, TAG, HTMLElementEx, PropsOf, Ref, MODE, HookEffect } from './type'
import { createElement, updateElement } from './dom'

export const hostConfig = {
  createElement(fiber: FiberHost): HTMLElementEx {
    return createElement(fiber)
  },

  insertBefore(parent: Node, child: Node, ref?: Node | null) {
    parent.insertBefore(child, ref ?? null)
  },

  removeChild(parent: Node, child: Node) {
    parent.removeChild(child)
  },

  updateProps(
    node: HTMLElementEx,
    oldProps: PropsOf<string>,
    newProps: PropsOf<string>
  ) {
    updateElement(node, oldProps, newProps)
  },

  commitRef(ref?: Ref<HTMLElementEx>, node?: HTMLElementEx | null) {
    if (!ref) return
    typeof ref === 'function' ? ref(node ?? null) : (ref.current = node ?? null)
  },

  clearRefs(kids?: Fiber[]) {
    kids?.forEach((kid) => {
      if (kid.kids) hostConfig.clearRefs(kid.kids)
      hostConfig.commitRef(kid.ref, null)
    })
  },

  /** Recursively remove a fiber subtree from the DOM and run cleanups */
  removeFiber(fiber: Fiber) {
    if (fiber.isComp) {
      fiber.hooks?.list.forEach((e: any) => e[2] && e[2]())
    } else {
      if (fiber.node?.parentNode) {
        hostConfig.removeChild(fiber.node.parentNode, fiber.node)
      }
      hostConfig.clearRefs(fiber.kids)
      hostConfig.commitRef(fiber.ref, null)
    }
    fiber.kids?.forEach((kid) => hostConfig.removeFiber(kid))
  },

  /** Run a batch of effects: cleanups first, then effects, storing new cleanups */
  flushEffects(effects: Array<[Function, any, Function?]>) {
    effects.forEach((e) => e[2] && e[2]())
    effects.forEach((e) => (e[2] = e[0]()))
    effects.length = 0
  },
}

export const createNodes = (fiber?: FiberFinish) => {
  if (!fiber) return
  if (!fiber.isComp && !fiber.node) {
    if ((fiber as FiberHost).type === 'svg') {
      fiber.lane |= TAG.SVG
    }
    fiber.node = hostConfig.createElement(fiber as FiberHost)
  }
  if (fiber.lane & TAG.SVG && fiber.child) {
    fiber.child.lane |= TAG.SVG
  }
  createNodes(fiber.child as FiberFinish)
  createNodes(fiber.sibling as FiberFinish)
}

export const flushEffects = (effects: HookEffect[]) => {
  hostConfig.flushEffects(effects)
}

/** Walk the fiber tree and apply DOM mutations via hostConfig */
export const commit = (fiber?: FiberFinish) => {
  if (!fiber) return
  if (fiber.mode & MODE.OFFSCREEN) return commitSibling(fiber.sibling)

  hostConfig.commitRef(fiber.ref, fiber.node)
  commitSibling(fiber.child)

  let { op, ref, cur } = fiber.action || {}
  let suspenseNodeComment = null
  let p = fiber?.parent
  let parent: Node | null = null
  while (p) {
    parent = p.node
    if (parent && parent.nodeType !== 8) break
    if (parent?.nodeType === 8 && parent.nodeValue === 'Suspense') {
      suspenseNodeComment = parent
    }
    p = p.parent
  }

  if ((op & TAG.INSERT || op & TAG.MOVE) && !fiber.isComp) {
    if (!cur?.node) {
      if ((cur as FiberHost)?.type === 'svg' || cur?.lane & TAG.SVG) {
        cur!.lane |= TAG.SVG
      }
      cur!.node = hostConfig.createElement(cur as FiberHost)
    }
    if (parent) {
      hostConfig.insertBefore(parent, cur!.node, suspenseNodeComment ?? ref?.node)
    }
  }
  if ((op & TAG.UPDATE) && !fiber.isComp) {
    hostConfig.updateProps(
      fiber.node!,
      (fiber.alternate as FiberHost)?.props || {},
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

/** Remove a fiber subtree (called from reconcile phase for diff-removed fibers) */
export const removeElement = (fiber: Fiber) => {
  fiber.flag = TAG.REMOVE
  hostConfig.removeFiber(fiber)
}

