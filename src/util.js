export const arrayfy = arr => (!arr ? [] : Array.isArray(arr) ? arr : [arr])

export const isNew = (o, n) => k =>
  k !== 'children' && k !== 'key' && o[k] !== n[k]

export function hashfy (arr) {
  let out = {}
  let i = 0
  let j = 0
  arrayfy(arr).forEach(item => {
    if (item.pop) {
      item.forEach(item => {
        let key = ((item || {}).props || {}).key
        key
          ? (out['.' + i + '.' + key] = item)
          : (out['.' + i + '.' + j] = item) && j++
      })
      i++
    } else {
      ;(out['.' + i] = item) && i++
    }
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
