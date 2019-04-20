export const defer =
  typeof Promise === 'function' ? cb => Promise.resolve().then(cb) : setTimeout
