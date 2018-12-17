import { prevNode, vm, ele } from './render'
import { diff } from './diff'
import { patch } from './patch'

let save = {}
let oldTree
let newTree

export function useState(state) {
  if (Object.keys(save).length > 0) {
    state = {
      ...state,
      ...save
    }
  }

  return proxy(state)
}

function proxy(state) {
  let newState = new Proxy(state, {
    get(obj, key) {
      if (save[key]) {
        return save[key]
      } else {
        return obj[key]
      }
    },
    set(obj, key, val) {
      save[key] = val
      oldTree = prevNode
      newTree = vm.type(vm.props)

      let patches = diff(oldTree, newTree)
      patch(ele, patches)

      return true
    }
  })

  return newState
}
