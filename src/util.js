export const defer =
  typeof Promise === 'function' ? cb => Promise.resolve().then(cb) : setTimeout

export const arrayfy = array =>
  !array ? [] : Array.isArray(array) ? array : [array]

export const isNew = (prev, next) => key => prev[key] !== next[key]
