export const arrayfy = <T>(arr: T | Array<T>) => (!arr ? [] : Array.isArray(arr) ? arr : [arr])

export const isSame = (a: { type: any }, b: { type: any }) =>
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

export function merge<T1 extends object, T2 extends object>(a: T1 | null, b: T2 | null): T1 & T2 {
  const out: Partial<T1 & T2> = {}
  // @ts-ignore
  for (const i in a) out[i] = a[i]
  // @ts-ignore
  for (const i in b) out[i] = b[i]
  return out as T1 & T2
}
export const defer =
  typeof Promise === 'function' ? cb => Promise.resolve().then(cb) : setTimeout
