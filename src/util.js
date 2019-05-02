export const defer =
  typeof Promise === 'function' ? cb => Promise.resolve().then(cb) : setTimeout

export const arrayfy = array =>
  !array ? [] : Array.isArray(array) ? array : [array]

export const isNew = (prev, next) => key => prev[key] !== next[key]

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

export const megre = (a, b) => {
  let out = {}

  for (var i in a) out[i] = a[i]
  for (var i in b) out[i] = b[i]

  return out
}
