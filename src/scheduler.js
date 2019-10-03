let taskQueue = []
let timerQueue = []
let taskId = 1

let isPerform = false
let currentTask = null
let currentCallback = null
let inMC = false
let scheduledCallback = false
let scheduledTimeout = false
let outid
let frameLength = 5
let frameDeadline = 0

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

  if (startTime > currentTime) {
    newTask.index = startTime
    push(timerQueue, newTask)

    if (peek(taskQueue) == null && newTask == peek(timerQueue)) {
      scheduledTimeout
        ? clearTimeout(outid)
        : (scheduledTimeout = true)
      outid = setTimeout(
        () => handleTimeout(getTime()),
        startTime - currentTime
      )
    }
  } else {
    newTask.index = dueTime
    push(taskQueue, newTask)

    if (!scheduledTimeout && !isPerform) {
      scheduledTimeout = true
      requestHostCallback(flushWork)
    }
  }
  return newTask
}

function handleTimeout (currentTime) {
  scheduledTimeout = false
  advanceTimers(currentTime)

  if (!scheduledCallback) {
    if (peek(taskQueue) != null) {
      scheduledCallback = true
      requestHostCallback(flushWork)
    } else {
      if (peek(timerQueue)) {
        requestHostTimeout(handleTimeout, first.startTime - currentTime)
      }
    }
  }
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
  if (scheduledTimeout) {
    scheduledTimeout = false
    clearTimeout(outid)
  }
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
    frameDeadline = currentTime + frameLength

    try {
      let moreWork = currentCallback(currentTime) // important logic
      if (!moreWork) {
        inMC = false
        currentCallback = null
      } else {
        port.postMessage(null)
      }
    } catch (e) {
      port.postMessage(null)
      throw e
    }
  } else inMC = false
}

function workLoop (iniTime) {
  let currentTime = iniTime
  advanceTimers(currentTime)
  currentTask = peek(taskQueue)


  // while (currentTask != null) {
    // if (currentTask.dueTime > currentTime) break
    let callback = currentTask.callback

    if (callback) {
      currentTask.callback = null
      let didout = currentTask.dueTime < currentTime
      callback(didout)
      pop(taskQueue)
    }
  }
// }

function advanceTimers (currentTime) {
  let timer = peek(timerQueue)
  while (timer) {
    if (!timer.callback) {
      pop(timerQueue)
    } else if (timer.startTime <= currentTime) {
      pop(timerQueue)
      timer.index = timer.dueTime
      push(taskQueue, timer)
    } else return
    timer = peek(timerQueue)
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

const channel = new MessageChannel
const port = channel.port2
channel.port1.onmessage = performWork