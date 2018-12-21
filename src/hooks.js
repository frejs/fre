import { rerender } from './render'
import { comps, parent } from './patch'

let golbal = {}
let once = true
let comp

export function useState(state) {
  if (Object.keys(golbal).length > 0) {
    state = {
      ...state,
      ...golbal
    }
  }

  if (once) {
    comp = comps[c()]
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
      rerender()
      return true
    }
  })

  return newState
}

function c() {
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
