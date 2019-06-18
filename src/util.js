export const arrayfy = arr => (!arr ? [] : Array.isArray(arr) ? arr : [arr])

export const isSame = (a, b) =>
  a.type === b.type || typeof a.type === typeof b.type

export const isNew = (o, n) => k =>
  k !== 'children' && k !== 'key' && o[k] !== n[k]

export function hashfy (arr) {
  let out = {}
  let i = 0
  arrayfy(arr).forEach(item => {
    let key = ((item || {}).props || {}).key
    key ? (out['.' + key] = item) : (out['.' + i] = item) && i++
  })
  return out
}

export function merge (a, b) {
  let out = {}
  for (var i in a) out[i] = a[i]
  for (var i in b) out[i] = b[i]
  return out
}
export const defer =
  typeof Promise === 'function' ? cb => Promise.resolve().then(cb) : setTimeout

