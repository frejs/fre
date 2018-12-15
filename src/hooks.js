import { first, vm, ele } from './render'
import { diff, oldDom } from './diff'
import { patch } from './patch'

let save = {}
let oldTree
let newTree
let once = false

export function useState(state) {
  if (Object.keys(save).length > 0) {
    state = save
  }

  let proxy = new Proxy(state, {
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
        oldTree = first
        once = true
      } else {
        oldTree = oldDom
      }
      newTree = vm.type()

      let patches = diff(oldTree, newTree)

      patch(ele, patches)

      return true
    }
  })

  return proxy
}
