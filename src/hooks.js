import { onceNode, vm, ele } from './render'
import { diff, prevNode } from './diff'
import { patch } from './patch'

let save = {}
let once = false
let oldTree
let newTree

export function useState(state) {
  console.log(arguments.caller)
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
      if (!once) {
        oldTree = onceNode
        once = true
      } else {
        oldTree = prevNode
      }
      newTree = vm.type()

      let patches = diff(oldTree, newTree)
      patch(ele, patches)

      return true
    }
  })

  return newState
}
