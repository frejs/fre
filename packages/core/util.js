export function arrify(val) {
  return val == null ? [] : Array.isArray(val) ? val : [val]
}

export function getRoot(fiber) {
  let node = fiber
  while (node.parent) {
    node = node.parent
  }
  return node
}