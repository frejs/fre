'use strict'

function fn() {
  return '111'
}
function fn2() {
  return '222'
}

let vnode = {
  type: fn,
  props: {},
  children: [
    {
      type: fn2,
      props: {},
      children: []
    }
  ]
}

function filterFn(obj) {
  let fns = {}
  return walk(obj, fns)
}

function walk(obj, fns) {
  Object.keys(obj).forEach(i => {
    if (i === 'type') {
      let f = obj[i]
      if (typeof f === 'function') {
        fns[f.name] = f
      }
    } else if (i === 'children') {
      let arr = obj[i]
      arr.forEach(child => {
        walk(child, fns)
      })
    } else {
      return
    }
  })
  return fns
}

let res = filterFn(vnode)
console.log(res)