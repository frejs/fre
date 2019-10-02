let taskQueue = []
let timerQueue = []
let taskId = 1

let isPerform = false
let currentTask = null
let isHostCallbackScheduled = false
let isHostTimeoutScheduled = false
let iniTime = Date.now()

function scheduleCallback (callback) {
  const currentTime = getTime()
  let startTime = currentTime
  let timeout = 5000 // idle
  let dueTime = startTime + timeout
  let outid

  let newTask = {
    id: taskId++,
    callback,
    startTime,
    dueTime,
    index: -1
  }

  if (startTime > currentTime) {
    newTask.index = startTime
    push(timerQueue, newTask)

    if (peek(taskQueue) == null && newTask == peek(timerQueue)) {
      isHostTimeoutScheduled
        ? clearTimeout(outid)
        : (isHostTimeoutScheduled = true)
      outid = setTimeout(
        () => handleTimeout(getTime()),
        startTime - currentTime
      )
    }
  } else {
    newTask.index = dueTime
    push(taskQueue, newTask)

    if (!isHostTimeoutScheduled && !isPerform) {
      isHostTimeoutScheduled = true
      requestHostCallback(flushWork)
    }
  }
  return newTask
}

function handleTimeout (currentTime) {
  isHostTimeoutScheduled = false
  advanceTimers(currentTime)

  if (!isHostCallbackScheduled) {
    if (peek(taskQueue) != null) {
      isHostCallbackScheduled = true
      requestHostCallback(flushWork)
    } else {
      if (peek(timerQueue)) {
        requestHostTimeout(handleTimeout, first.startTime - currentTime)
      }
    }
  }
}
function requestHostCallback (cb) {}
function flushWork () {}
const getTime = () => Date.now() - iniTime

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

function pop (heap, node) {
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
    return first
  } else return null
}

function compare (a, b) {
  let diff = a.sortIndex - b.sortIndex
  return diff !== 0 ? diff : a.id - b.id
}

function peek (heap) {
  var first = heap[0]
  return first || null
}
