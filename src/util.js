export const defer =
  typeof Promise === 'function' ? cb => Promise.resolve().then(cb) : setTimeout

export const arrayfy = array =>
  !array ? [] : Array.isArray(array) ? array : [array]

export const isNew = (prev, next) => key => prev[key] !== next[key]

export const hashfy = arr => {
  // 将数组变成 hash 对象
  let out = {}
  let i = 0
  arrayfy(arr).forEach(item => {
    let key = ((item || {}).props || {}).key
    key ? (out['.' + key] = item) : (out['.' + i] = item) && i++
  })
  return out
}

export const merge = (a, b) => {
  for (var i in b) a[i] = b[i]
}
