export const arrayfy = arr => (!arr ? [] : Array.isArray(arr) ? arr : [arr])

export const isSame = (a, b) => a.type === b.type

export const isNew = (o, n) => k =>
  k !== 'children' && k !== 'key' && o[k] !== n[k]

export function hashfy (arr, kids) {
  let out = {}
  let i = 0
  const newKids = arrayfy(arr)
  newKids.forEach(item => {
    let key = ((item || {}).props || {}).key
    key ? (out['.' + key] = item) : (out['.' + i] = item) && i++
  })
  return out
}

export function merge (a, b) {
  let out = {}
  for (const i in a) out[i] = a[i]
  for (const i in b) out[i] = b[i]
  return out
}
export const defer = requestAnimationFrame || setTimeout

export const isFn = fn => typeof fn === 'function'
