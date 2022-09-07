export function walker(node) {
  return document.createTreeWalker(
    node,
    NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_COMMENT,
    {
      acceptNode: () => NodeFilter.FILTER_ACCEPT,
    }
  )
}
// let clone = walker(document.getElementById('app'))
export const walk = (fn, node) => node.nextNode() && fn() && walk(fn, node)

// walk(() => {
//   let current = clone.currentNode
//   console.log(current)
//   return current
// })
