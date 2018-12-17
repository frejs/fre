const ATTRS = 'ATTRS'
const REMOVE = 'REMOVE'
const TEXT = 'TEXT'
const REPLACE = 'REPLACE'

export let prevNode

export function diff(oldTree, newTree) {
  let index = 0
  let patches = {}

  walk(oldTree, newTree, index, patches)

  return patches
}

function walk(oldNode, newNode, index, patches) {

  let currentPatches = []
  if (typeof oldNode.type === 'function') {
    walk(oldNode.type(oldNode.props),newNode.type(newNode.props),index,patches)
  } else if (
    (typeof oldNode === 'string' && typeof newNode === 'string') ||
    (typeof oldNode === 'number' && typeof oldNode === 'number')
  ) {
    if (oldNode !== newNode) {
      currentPatches.push({ type: TEXT, text: newNode })
    }
  } else if (!newNode) {
    currentPatches.push({ type: REMOVE, index })
  } else if (oldNode.type === newNode.type) {
    let attrs = diffAttr(oldNode.props, newNode.props)

    if (Object.keys(attrs).length > 0) {
      currentPatches.push({ type: ATTRS, attrs })
    }
    diffChildren(oldNode.children, newNode.children, index, patches)
  } else {
    index += oldNode.children.length
    currentPatches.push({ type: REPLACE, newNode })
  }

  if (currentPatches.length > 0) {
    patches[index] = currentPatches
  }
}

function diffAttr(oldAttr, newAttr) {
  let patch = {}

  for (let key in oldAttr) {
    if (typeof oldAttr[key] !== 'function') {
      if (oldAttr[key] !== newAttr[key]) {
        patch[key] = newAttr[key]
      }
    }
  }
  for (let key in newAttr) {
    if (typeof newAttr[key] !== 'function') {
      if (!oldAttr.hasOwnProperty(key)) {
        patch[key] = newAttr[key]
      }
    }
  }

  return patch
}

function diffChildren(oldChildren, newChildren, index, patches) {
  oldChildren.forEach((child, i) => {
    walk(child, newChildren[i], ++index, patches)
  })
}
