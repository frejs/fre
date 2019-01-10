let buckets = new WeakMap()
let currentBucket = []

function use(...fns) {
  fns = fns.map(fn => {
    return function hook(...args) {
      if (buckets.has(hook)) {
        let bucket = buckets.get(hook)
        bucket.cursor = 0
      }
      currentBucket.push(hook)
      return fn.apply(this, args)
    }
  })
  if (fns.length < 2) return fns[0]
  return fns
}

function useState(state) {
  if (currentBucket.length > 0) {
    let hook = currentBucket[currentBucket.length - 1]
    let bucket
    if (!buckets.has(hook)) {
      bucket = { cursor: 0, slots: [] }
      buckets.set(hook, bucket)
    }
    bucket = buckets.get(hook)
    if (!(bucket.cursor in bucket.slots)) {
      let slot = [
        typeof state == "function" ? state() : state,
        function setter(v) {
          slot[0] = v
        }
      ]
      bucket.slots[bucket.cursor] = slot
    }
    return [...bucket.slots[bucket.cursor++]]
  } else {
    throw new Error("Only use useState() inside of hook-wrapped functions.")
  }
}