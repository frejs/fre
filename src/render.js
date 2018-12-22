import { patch } from './patch'
import { comp, once } from './hooks'

let parent
let element
let oldVnode
let vnode
export var comps

export function render(vdom, el) {
  comps = filterFn(vdom)
  parent = el
  vnode = vdom.type()
  rerender()
}

export function rerender() {
  if (!once) {
    vnode = comp.type()
  }
  setTimeout(() => {
    element = patch(parent, element, oldVnode, (oldVnode = vnode))
  })
}

function filterFn(obj) {
  let fns = {}
  return walk(obj, fns)
}

function walk(obj, fns) {
  if (obj) {
    Object.keys(obj).forEach(i => {
      if (i === 'type') {
        let f = obj[i]
        if (typeof f === 'function') {
          fns[f.name] = obj
        }
      } else if (i === 'children') {
        let arr = obj[i]
        arr.forEach(child => {
          walk(child, fns)
        })
      }
    })
  }
  return fns
}
