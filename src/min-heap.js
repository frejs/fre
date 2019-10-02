let heap = []

function push (heap, node) {
  let index = heap.length
  heap.push(node)
  siftUp(heap, node, index)
}

function siftUp (heap, node, i) {
  let index = i
  while (true) {
    let parentIndex = Math.floor((index - 1) / 2)
    let parent = heap[parentIndex]

    if (parent && compare(parent, node) > 0) {
      heap[parentIndex] = node
      heap[index] = parent
      index = parentIndex
    } else return
  }
}

function pop (heap, node) {
  let first = heap[0]
  if (first) {
    let last = heap.pop()
    if (first !== last) {
      heap[0] = last
      siftDown(heap, last, 0)
    }
    return first
  } else return null
}

function siftDown (heap, node, i) {
  let index = i
  let length = heap.length

  while (index < length) {
    let leftIndex = (index + 1) * 2 - 1
    let left = heap[leftIndex]
    let rightIndex = leftIndex + 1
    let right = heap[rightIndex]

    if (left && compare(left, node) < 0) {
      if (right && compare(right, node) < 0) {
        heap[index] = right
        heap[rightIndex] = node
        index = rightIndex
      } else {
        heap[index] = left
        heap[leftIndex] = node
        index = leftIndex
      }
    } else if (right && compare(right, node) < 0) {
      heap[index] = right
      heap[rightIndex] = node
      index = rightIndex
    } else return
  }
}

function compare (a, b) {
  let diff = a.sortIndex - b.sortIndex
  return diff !== 0 ? diff : a.id - b.id
}