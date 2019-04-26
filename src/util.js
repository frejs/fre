export const defer =
  typeof Promise === 'function' ? cb => Promise.resolve().then(cb) : setTimeout

export const arrayfy = array =>
  !array ? [] : Array.isArray(array) ? array : [array]

export const isNew = (prev, next) => key => prev[key] !== next[key]

export const hashfy = arr => {
  // 将数组变成 hash 对象
  let res = {},
      i = 0
  arrayfy(arr).forEach(item => {
    let key = ((item || {}).props || {}).key
    key ? (res['.' + key] = item) : (res['.' + i] = item) && i++
  })
  return res
}
