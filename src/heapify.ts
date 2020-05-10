export function push(heap, node) {
  const i = heap.length
  heap.push(node)
  siftUp(heap, node, i)
}

export function pop(heap) {
  const first = heap[0]
  if (!first) return null
  const last = heap.pop()
  if (last !== first) {
    heap[0] = last
    siftDown(heap, last, 0)
  }
  return first
}

function siftUp(heap, node, i) {
  while (i > 0) {
    const pi = (i - 1) >>> 1
    const parent = heap[pi]
    if (cmp(parent, node) <= 0) return
    heap[pi] = node
    heap[i] = parent
    i = pi
  }
}

function siftDown(heap, node, i) {
  for (;;) {
    const li = i * 2 + 1
    const left = heap[li]
    if (li >= heap.length) return
    const ri = li + 1
    const right = heap[ri]
    const ci = ri < heap.length && cmp(right, left) < 0 ? ri : li
    const child = heap[ci]
    if (cmp(child, node) > 0) return
    heap[ci] = node
    heap[i] = child
    i = ci
  }
}

function cmp(a, b) {
  return a.dueTime - b.dueTime
}

export function peek(heap) {
  return heap[0] || null
}
