function push (heap, node) {
  let index = heap.length
  heap.push(node)

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

function pop (heap) {
  let first = heap[0]
  if (first) {
    let last = heap.pop()
    if (first !== last) {
      heap[0] = last
      let index = 0
      let length = heap.length

      while (index < length) {
        let leftIndex = (index + 1) * 2 - 1
        let left = heap[leftIndex]
        let rightIndex = leftIndex + 1
        let right = heap[rightIndex]

        if (left && compare(left, last) < 0) {
          if (right && compare(right, last) < 0) {
            heap[index] = right
            heap[rightIndex] = last
            index = rightIndex
          } else {
            heap[index] = left
            heap[leftIndex] = last
            index = leftIndex
          }
        } else if (right && compare(right, last) < 0) {
          heap[index] = right
          heap[rightIndex] = last
          index = rightIndex
        } else return
      }
    }
    return first
  } else return null
}

function compare (a, b) {
  let diff = a.dueTime - b.dueTime
  return diff !== 0 ? diff : a.id - b.id
}

function peek (heap) {
  var first = heap[0]
  return first || null
}

export { push, peek, pop }
