import { fns,dom } from './patch'

let golbal = {}
let oldTree
let newTree
let once = true

let c

export function useState(state) {
  if (Object.keys(golbal).length > 0) {
    state = {
      ...state,
      ...golbal
    }
  }
  // counter
  if (once) {
    c = fns[call()]
    once = false
  }
  return proxy(state)
}

function proxy(state) {
  let newState = new Proxy(state, {
    get(obj, key) {
      if (golbal[key]) {
        return golbal[key]
      } else {
        return obj[key]
      }
    },
    set(obj, key, val) {
      golbal[key] = val
      obj[key] = val
      let vnode = c.type() //新的 vnode

      console.log(vnode)

      
      return true
    }
  })

  return newState
}

function call() {
  try {
    throw new Error()
  } catch (e) {
    try {
      return e.stack.match(/Object.(\S*)/)[1]
    } catch (e) {
      return ''
    }
  }
}
