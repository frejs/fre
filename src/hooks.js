let golbal = {}
let oldTree
let newTree

export function useState(state) {
  const caller = caller()

  if (Object.keys(save).length > 0) {
    state = {
      ...state,
      ...golbal[caller]
    }
  }

  return proxy(state)
}

function proxy(state) {
  let newState = new Proxy(state, {
    get(obj, key) {
      if (golbal[caller][key]) {
        return golbal[caller][key]
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

function caller() {
  try {
    throw new Error()
  } catch (e) {
    try {
      return e.stack.split('at ')[3].split(' ')[0]
    } catch (e) {
      return ''
    }
  }
}
