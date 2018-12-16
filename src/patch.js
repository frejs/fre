import { render, setAttr } from './render'

let allPatches
let index

export function patch(node, patches) {
  allPatches = patches
  index = 0
  walk(node)
}

function walk(node) {
  let currentPatch = allPatches[index++]

  node.childNodes.forEach(child => walk(child))
  if (currentPatch) {
    usePatch(node, currentPatch)
  }
}

function usePatch(node, patches) {
  patches.forEach(patch => {
    switch (patch.type) {
      case 'ATTRS':
        for (let key in patch.attrs) {
          let value = patch.attrs[key]
          if (value) {
            setAttr(node, key, value)
          } else {
            node.removeAttribute(key)
          }
        }
        break
      case 'TEXT':
        node.textContent = patch.text
        break
      case 'REPLACE':
        let newNode =
          typeof patch.newNode === 'object'
            ? render(patch.newNode)
            : document.createTextNode(patch.newNode)
        node.parentNode.replaceChild(newNode, node)
        break
      case 'REMOVE':
        node.parentNode.removeChild(node)
        break
    }
  })
}
