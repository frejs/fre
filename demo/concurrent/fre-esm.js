;(function(global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined'
    ? factory(exports)
    : typeof define === 'function' && define.amd
    ? define(['exports'], factory)
    : ((global = global || self), factory((global.fre = {})))
})(this, function(exports) {
  'use strict'

  function h(type, attrs) {
    let props = attrs || {}
    let key = props.key || null
    let ref = props.ref || null
    let children = []

    for (let i = 2; i < arguments.length; i++) {
      let vnode = arguments[i]
      if (vnode == null || vnode === true || vnode === false);
      else if (typeof vnode === 'string' || typeof vnode === 'number') {
        children.push(createText(vnode))
      } else {
        children.push(vnode)
      }
    }

    if (children.length) {
      props.children = children.length === 1 ? children[0] : children
    }

    delete props.key
    delete props.ref
    return { type, props, key, ref }
  }

  function createText(vnode) {
    return { type: 'text', props: { nodeValue: vnode } }
  }

  function updateElement(dom, oldProps, newProps) {
    for (let name in { ...oldProps, ...newProps }) {
      let oldValue = oldProps[name]
      let newValue = newProps[name]

      if (oldValue == newValue || name === 'children');
      else if (name === 'style') {
        for (const k in { ...oldValue, ...newValue }) {
          if (!(oldValue && newValue && oldValue[k] === newValue[k])) {
            dom[name][k] = (newValue && newValue[k]) || ''
          }
        }
      } else if (name[0] === 'o' && name[1] === 'n') {
        name = name.slice(2).toLowerCase()
        if (oldValue) dom.removeEventListener(name, oldValue)
        dom.addEventListener(name, newValue)
      } else if (name in dom && !(dom instanceof SVGElement)) {
        dom[name] = newValue == null ? '' : newValue
      } else if (newValue == null || newValue === false) {
        dom.removeAttribute(name)
      } else {
        dom.setAttribute(name, newValue)
      }
    }
  }

  function createElement(fiber) {
    const dom =
      fiber.type === 'text'
        ? document.createTextNode('')
        : fiber.tag === SVG
        ? document.createElementNS('http://www.w3.org/2000/svg', fiber.type)
        : document.createElement(fiber.type)
    updateElement(dom, {}, fiber.props)
    return dom
  }

  let cursor = 0

  function resetCursor() {
    cursor = 0
  }

  function useState(initState) {
    return useReducer(null, initState)
  }

  function useReducer(reducer, initState) {
    let wip = getHook()
    let key = getKey()

    function setter(value) {
      let newValue = reducer
        ? reducer(wip.state[key], value)
        : isFn(value)
        ? value(wip.state[key])
        : value
      wip.state[key] = newValue
      scheduleWork(wip, true)
    }

    if (key in wip.state) {
      return [wip.state[key], setter]
    } else {
      wip.state[key] = initState
      return [initState, setter]
    }
  }

  function useEffect(cb, deps) {
    let wip = getHook()
    let key = getKey()
    if (isChanged(wip.__deps.e[key], deps)) {
      wip.effect[key] = useCallback(cb, deps)
      wip.__deps.e[key] = deps
    }
  }

  function useMemo(cb, deps) {
    let wip = getHook()
    let key = getKey()
    if (isChanged(wip.__deps.m[key], deps)) {
      wip.__deps.m[key] = deps
      return (wip.memo[key] = cb())
    }
    return wip.memo[key]
  }

  function useCallback(cb, deps) {
    return useMemo(() => cb, deps)
  }

  function useRef(current) {
    return useMemo(() => ({ current }), [])
  }

  function isChanged(a, b) {
    return !a || b.some((arg, index) => arg !== a[index])
  }

  function getKey() {
    let key = '$' + cursor
    cursor++
    return key
  }

  function push(heap, node) {
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

  function pop(heap) {
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
            if (right && compare(right, left) < 0) {
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

  function compare(a, b) {
    return a.dueTime - b.dueTime
  }

  function peek(heap) {
    return heap[0] || null
  }

  let taskQueue = []
  let currentTask = null
  let currentCallback = null
  let scheduling = false
  let frameDeadline = 0
  let frameLength = 5

  function scheduleCallback(callback) {
    const currentTime = getTime()
    let startTime = currentTime
    let timeout = 5000
    let dueTime = startTime + timeout

    let newTask = {
      callback,
      startTime,
      dueTime
    }

    push(taskQueue, newTask)

    currentCallback = flushWork

    if (!scheduling) {
      planWork()
      scheduling = true
    }

    return newTask
  }

  function flushWork(iniTime) {
    try {
      console.log(111)
      return workLoop(iniTime)
    } finally {
      currentTask = null
    }
  }

  function workLoop(iniTime) {
    let currentTime = iniTime
    currentTask = peek(taskQueue)

    while (currentTask) {
      if (currentTask.dueTime > currentTime && shouldYeild()) {
        break
      }
      let callback = currentTask.callback
      if (callback) {
        currentTask.callback = null
        const didout = currentTask.dueTime <= currentTime

        let next = callback(didout)
        if (next) {
          currentTask.callback = next
        } else {
          pop(taskQueue)
        }
      } else pop(taskQueue)

      currentTask = peek(taskQueue)
      currentTime = getTime()
    }

    return !!currentTask
  }

  function performWork() {
    if (currentCallback) {
      let currentTime = getTime()
      frameDeadline = currentTime + frameLength
      let moreWork = currentCallback(currentTime)

      if (moreWork) {
        planWork()
      } else {
        scheduling = false
        currentCallback = null
      }
    }
  }

  const planWork = (() => {
    if (typeof MessageChannel !== 'undefined') {
      const channel = new MessageChannel()
      const port = channel.port2
      channel.port1.onmessage = performWork

      return () => port.postMessage(null)
    }

    return () => setTimeout(performWork, 0)
  })()

  function shouldYeild() {
    return getTime() >= frameDeadline
  }

  const getTime = () => performance.now()

  const options = {}
  const [HOST, SVG, HOOK, PLACE, UPDATE, DELETE] = [0, 1, 2, 3, 4, 5]

  let preCommit = null
  let currentHook = null
  let WIP = null
  let commitQueue = []

  function render(vnode, node, done) {
    let rootFiber = {
      tag: HOST,
      node,
      props: { children: vnode },
      done
    }
    scheduleWork(rootFiber)
  }

  function scheduleWork(fiber, lock) {
    fiber.lock = lock
    WIP = fiber
    scheduleCallback(reconcileWork)
  }

  function reconcileWork(didout) {
    let suspend = null
    while (WIP && (!shouldYeild() || didout)) {
      try {
        WIP = reconcile(WIP)
      } catch (e) {
        if (!!e && typeof e.then === 'function') {
          suspend = WIP
          WIP = null
          e.then(() => {
            WIP = suspend
          })
        } else throw e
      }
    }
    if (preCommit) {
      commitWork(preCommit)
      return null
    }
    if (!didout) {
      return reconcileWork.bind(null)
    }
    return null
  }

  function reconcile(WIP) {
    WIP.parentNode = getParentNode(WIP)
    WIP.tag == HOOK ? updateHOOK(WIP) : updateHost(WIP)
    commitQueue.push(WIP)

    if (WIP.child) return WIP.child
    while (WIP) {
      if (WIP.lock == false || !WIP.parent) {
        preCommit = WIP
      }
      if (WIP.sibling && WIP.lock == null) {
        return WIP.sibling
      }
      WIP = WIP.parent
    }
  }

  function updateHOOK(WIP) {
    WIP.props = WIP.props || {}
    WIP.state = WIP.state || {}
    WIP.effect = {}
    WIP.memo = WIP.memo || {}
    WIP.__deps = WIP.__deps || { m: {}, e: {} }
    currentHook = WIP
    resetCursor()
    let children = WIP.type(WIP.props)
    if (!children.type) {
      children = createText(children)
    }
    reconcileChildren(WIP, children)
  }

  function updateHost(WIP) {
    if (!WIP.node) {
      if (WIP.type === 'svg') WIP.tag = SVG
      WIP.node = createElement(WIP)
    }
    let p = WIP.parentNode || {}
    WIP.insertPoint = p.last || null
    p.last = WIP
    WIP.node.last = null
    reconcileChildren(WIP, WIP.props.children)
  }
  function getParentNode(fiber) {
    while ((fiber = fiber.parent)) {
      if (fiber.tag < HOOK) return fiber.node
    }
  }

  function reconcileChildren(WIP, children) {
    if (!children) return
    delete WIP.child
    const oldFibers = WIP.kids
    const newFibers = (WIP.kids = hashfy(children))

    let reused = {}

    for (const k in oldFibers) {
      let newFiber = newFibers[k]
      let oldFiber = oldFibers[k]

      if (newFiber && newFiber.type === oldFiber.type) {
        reused[k] = oldFiber
      } else {
        oldFiber.op = DELETE
        commitQueue.push(oldFiber)
      }
    }

    let prevFiber = null
    let alternate = null

    for (const k in newFibers) {
      let newFiber = newFibers[k]
      let oldFiber = reused[k]

      if (oldFiber) {
        alternate = createFiber(oldFiber, UPDATE)
        newFiber.op = UPDATE
        newFiber = { ...alternate, ...newFiber }
        newFiber.alternate = alternate
        if (shouldPlace(newFiber)) {
          newFiber.op = PLACE
        }
      } else {
        newFiber = createFiber(newFiber, PLACE)
      }

      newFibers[k] = newFiber
      newFiber.parent = WIP

      if (prevFiber) {
        prevFiber.sibling = newFiber
      } else {
        if (WIP.tag === SVG) newFiber.tag = SVG
        WIP.child = newFiber
      }
      prevFiber = newFiber
    }

    if (prevFiber) prevFiber.sibling = null
    WIP.lock = WIP.lock ? false : null
  }

  function shouldPlace(fiber) {
    let p = fiber.parent
    if (p.tag === HOOK) return p.key && !p.lock
    return fiber.key
  }

  function commitWork(fiber) {
    commitQueue.forEach(c => {
      if (c.parent) commit(c)
    })

    WIP = null
    commitQueue = []
    preCommit = null
    fiber.done && fiber.done()
  }

  function applyEffect(fiber) {
    fiber.pending = fiber.pending || {}
    for (const k in fiber.effect) {
      const pend = fiber.pending[k]
      pend && pend()
      const after = fiber.effect[k]()
      after && (fiber.pending[k] = after)
    }
    fiber.effect = null
  }

  function commit(fiber) {
    let op = fiber.op
    let parent = fiber.parentNode
    let dom = fiber.node
    let ref = fiber.ref
    if (op === DELETE) {
      cleanup(fiber)
      while (fiber.tag === HOOK) fiber = fiber.child
      parent.removeChild(fiber.node)
      fiber.node = null
    } else if (fiber.tag === HOOK) {
      applyEffect(fiber)
    } else if (op === UPDATE) {
      updateElement(dom, fiber.alternate.props, fiber.props)
    } else {
      let point = fiber.insertPoint ? fiber.insertPoint.node : null
      let after = point ? point.nextSibling : parent.firstChild
      if (after === dom) return
      if (after === null && dom === parent.lastChild) return
      parent.insertBefore(dom, after)
    }

    if (ref) isFn(ref) ? ref(dom) : (ref.current = dom)
  }

  function cleanup(fiber) {
    let pend = fiber.pending
    for (const k in pend) pend[k]()
    fiber.pending = null
  }

  function createFiber(vnode, op) {
    return { ...vnode, op, tag: isFn(vnode.type) ? HOOK : HOST }
  }

  const arrayfy = arr => (!arr ? [] : arr.pop ? arr : [arr])

  function hashfy(arr) {
    let out = {}
    let i = 0
    let j = 0
    arrayfy(arr).forEach(item => {
      if (item.pop) {
        item.forEach(item => {
          item.key
            ? (out['.' + i + '.' + item.key] = item)
            : (out['.' + i + '.' + j] = item) && j++
        })
        i++
      } else {
        item.key ? (out['.' + item.key] = item) : (out['.' + i] = item) && i++
      }
    })
    return out
  }

  const isFn = fn => typeof fn === 'function'

  function getHook() {
    return currentHook || {}
  }

  exports.createElement = h
  exports.h = h
  exports.options = options
  exports.render = render
  exports.scheduleWork = scheduleWork
  exports.useCallback = useCallback
  exports.useEffect = useEffect
  exports.useMemo = useMemo
  exports.useReducer = useReducer
  exports.useRef = useRef
  exports.useState = useState
})
