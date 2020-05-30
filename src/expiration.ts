export function msExpiration(ms) {
  return ((ms / 10) | 0) + 2
}

function ceiling(num, precision) {
  return (((num / precision) | 0) + 1) * precision
}

export function computeExpiration(
  currentTime,
  expirationInMs,
  bucketSizeMs
) {
  return ceiling(
    currentTime + expirationInMs / 10,
    bucketSizeMs / 10
  )
}
