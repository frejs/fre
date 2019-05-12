export const arrayfy = arr => (!arr ? [] : Array.isArray(arr) ? arr : [arr])

export const isNew = (o, n) => k => o[k] !== n[k]

export const isSame = (a, b) => a.type == b.type && a.key == b.key

export const hashfy = arr => {
  let out = {}
  let i = 0
  arrayfy(arr).forEach(item => {
    let key = ((item || {}).props || {}).key
    key ? (out['.' + key] = item) : (out['.' + i] = item) && i++
  })
  return out
}

export const extend = (a, b) => {
  for (var i in b) a[i] = b[i]
}

export const merge = (a, b) => {
  let out = {}

  for (var i in a) out[i] = a[i]
  for (var i in b) out[i] = b[i]

  return out
}

export const rIC =
  requestIdleCallback ||
  ((cb, ed = Date.now()) =>
    setTimeout(() => {
      cb({ timeRemaining: () => Math.max(0, 50 - (Date.now() - ed)) })
    }, 1))

export const rAF = requestAnimationFrame || setTimeout
