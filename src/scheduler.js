let taskQueue = []
let taskId = 1

let isPerform = false
let currentTask = null
let currentCallback = null
let inMC = false
let scheduledCallback = false

export function scheduleCallback (callback) {
  const currentTime = getTime()
  let startTime = currentTime
  let timeout = 5000 // idle
  let dueTime = startTime + timeout

  let newTask = {
    id: taskId++,
    callback,
    startTime,
    dueTime,
    index: -1
  }

  newTask.index = dueTime
  push(taskQueue, newTask)

  if (!scheduledCallback && !isPerform) {
    scheduledCallback = true
    requestHostCallback(flushWork)
  }

  return newTask
}
function requestHostCallback (cb) {
  currentCallback = cb
  if (!inMC) {
    inMC = true
    port.postMessage(null)
  }
}
function flushWork (iniTime) {
  scheduledCallback = false
  isPerform = true

  try {
    return workLoop(iniTime)
  } finally {
    currentTask = null
    isPerform = false
  }
}

function performWork () {
  if (currentCallback) {
    let currentTime = getTime()
    let moreWork = currentCallback(currentTime)
    moreWork
      ? port.postMessage(null)
      : (inMC = false) && (currentCallback = null)
  } else inMC = false
}

function workLoop (iniTime) {
  let currentTime = iniTime
  currentTask = peek(taskQueue)

  let callback = currentTask.callback
  if (callback) {
    let didout = currentTask.dueTime < currentTime
    callback(didout)
    pop(taskQueue)
  }
}

const getTime = () => performance.now()

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
  let diff = a.sortIndex - b.sortIndex
  return diff !== 0 ? diff : a.id - b.id
}

function peek (heap) {
  var first = heap[0]
  return first || null
}

const channel = new MessageChannel()
const port = channel.port2
channel.port1.onmessage = performWork
