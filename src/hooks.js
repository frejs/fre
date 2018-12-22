import { rerender, comps } from './render'

let golbal = {}
export var once = true
export var comp

export function useState(state) {
  if (Object.keys(golbal).length > 0) {
    state = {
      ...state,
      ...golbal
    }
  }

  comp = comps['counter']
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
