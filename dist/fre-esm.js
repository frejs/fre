function h (type, attrs) {
  let props = attrs || {};
  let key = props.key || null;
  let children = [];

  for (let i = 2; i < arguments.length; i++) {
    let vnode = arguments[i];
    if (vnode == null || vnode === true || vnode === false) ; else if (typeof vnode === 'number' || typeof vnode === 'string') {
      children.push({ type: 'text', props: { nodeValue: vnode } });
    } else {
      children.push(vnode);
    }
  }

  if (children.length) {
    props.children = children.length === 1 ? children[0] : children;
  }

  delete props.key;
  return { type, props, key }
}

const arrayfy = arr => (!arr ? [] : arr.pop ? arr : [arr]);

const isNew = (o, n) => k => k !== 'children' && o[k] !== n[k];

function hashfy (arr) {
  let out = {};
  let i = 0;
  let j = 0;
  arrayfy(arr).forEach(item => {
    if (item.pop) {
      item.forEach(item => {
        let key = item.key;
        key
          ? (out['.' + i + '.' + key] = item)
          : (out['.' + i + '.' + j] = item) && j++;
      });
      i++;
    } else (out['.' + i] = item) && i++;
  });
  return out
}

function merge (a, b) {
  let out = {};
  for (const i in a) out[i] = a[i];
  for (const i in b) out[i] = b[i];
  return out
}

function updateProperty (dom, name, value, newValue) {
  if (name === 'style') {
    for (let key in value) if (!newValue[key]) dom[name][key] = '';
    for (let key in newValue) dom[name][key] = newValue[key];
  } else if (name[0] === 'o' && name[1] === 'n') {
    name = name.slice(2).toLowerCase();
    if (value) dom.removeEventListener(name, value);
    dom.addEventListener(name, newValue);
  } else if (name in dom && !(dom instanceof SVGElement)) {
    dom[name] = newValue == null ? '' : newValue;
  } else if (newValue == null || newValue === false) {
    dom.removeAttribute(name);
  } else {
    dom.setAttribute(name, newValue);
  }
}

function updateElement (dom, props, newProps) {
  Object.keys(newProps)
    .filter(isNew(props, newProps))
    .forEach(key => updateProperty(dom, key, props[key], newProps[key]));
}

function createElement (fiber) {
  const dom =
    fiber.type === 'text'
      ? document.createTextNode('')
      : fiber.tag === SVG
        ? document.createElementNS('http://www.w3.org/2000/svg', fiber.type)
        : document.createElement(fiber.type);
  updateElement(dom, [], fiber.props);
  return dom
}

let cursor = 0;

function update (key, reducer, value) {
  const current = this ? this : getWIP();
  value = reducer ? reducer(current.state[key], value) : value;
  current.state[key] = value;
  scheduleWork(current);
}
function resetCursor () {
  cursor = 0;
}
function useState (initState) {
  return useReducer(null, initState)
}
function useReducer (reducer, initState) {
  let current = getWIP() || {};
  let key = '$' + cursor;
  let setter = update.bind(current, key, reducer);
  cursor++;
  let state = current.state || {};
  if (key in state) {
    return [state[key], setter]
  } else {
    current.state[key] = initState;
    return [initState, setter]
  }
}

function useEffect (cb, inputs) {
  let current = getWIP() || {};
  let key = '$' + cursor;
  current.effects = current.effects || {};
  current.effects[key] = useCallback(cb, inputs);
  cursor++;
}

function useCallback (cb, inputs) {
  return useMemo(() => cb, inputs)
}

function useMemo (cb, inputs) {
  let current = getWIP() || {};
  let isChange = inputs
    ? (current.oldInputs || []).some((v, i) => inputs[i] !== v)
    : true;
  if (inputs && !inputs.length && !current.isMounted) {
    isChange = true;
    current.isMounted = true;
  }
  current.oldInputs = inputs;

  return isChange || !current.isMounted ? (current.memo = cb()) : current.memo
}

function push (heap, node) {
  let index = heap.length;
  heap.push(node);

  while (true) {
    let parentIndex = Math.floor((index - 1) / 2);
    let parent = heap[parentIndex];

    if (parent && compare(parent, node) > 0) {
      heap[parentIndex] = node;
      heap[index] = parent;
      index = parentIndex;
    } else return
  }
}

function pop (heap) {
  let first = heap[0];
  if (first) {
    let last = heap.pop();
    if (first !== last) {
      heap[0] = last;
      let index = 0;
      let length = heap.length;

      while (index < length) {
        let leftIndex = (index + 1) * 2 - 1;
        let left = heap[leftIndex];
        let rightIndex = leftIndex + 1;
        let right = heap[rightIndex];

        if (left && compare(left, last) < 0) {
          if (right && compare(right, last) < 0) {
            heap[index] = right;
            heap[rightIndex] = last;
            index = rightIndex;
          } else {
            heap[index] = left;
            heap[leftIndex] = last;
            index = leftIndex;
          }
        } else if (right && compare(right, last) < 0) {
          heap[index] = right;
          heap[rightIndex] = last;
          index = rightIndex;
        } else return
      }
    }
    return first
  } else return null
}

function compare (a, b) {
  let diff = a.dueTime - b.dueTime;
  return diff !== 0 ? diff : a.id - b.id
}

function peek (heap) {
  var first = heap[0];
  return first || null
}

let taskQueue = [];
let taskId = 1;
let currentTask = null;
let currentCallback = null;
let inMC = false;
let frameLength = 5;
let frameDeadline = 0;

function scheduleCallback (callback) {
  const currentTime = getTime();
  let startTime = currentTime;
  let timeout = 5000; // idle
  let dueTime = startTime + timeout;

  let newTask = {
    id: taskId++,
    callback,
    startTime,
    dueTime
  };

  push(taskQueue, newTask);

  requestHostCallback(flushWork);
}
function requestHostCallback (cb) {
  currentCallback = cb;
  if (!inMC) {
    inMC = true;
    port.postMessage(null);
  }
}
function flushWork (iniTime) {
  try {
    return workLoop(iniTime)
  } finally {
    currentTask = null;
  }
}

function workLoop (iniTime) {
  let currentTime = iniTime;
  currentTask = peek(taskQueue);

  while (currentTask) {
    if (currentTask.dueTime > currentTime && shouldYield()) break
    let callback = currentTask.callback;
    if (callback) {
      currentTask.callback = null;
      let didout = currentTask.dueTime < currentTime;
      callback(didout);
    } else pop(taskQueue);
  }
}

function portMessage () {
  if (currentCallback) {
    let currentTime = getTime();
    frameDeadline = currentTime + frameLength;
    let moreWork = currentCallback(currentTime);
    moreWork
      ? port.postMessage(null)
      : (inMC = false) && (currentCallback = null);
  } else inMC = false;
}

const getTime = () => performance.now();
const shouldYield = () => getTime() > frameDeadline;

const channel = new MessageChannel();
const port = channel.port2;
channel.port1.onmessage = portMessage;

const options = {};
const [HOST, HOOK, ROOT, SVG, PLACE, UPDATE, DELETE] = [0, 1, 2, 3, 4, 5, 6];

let nextWork = null;
let pendingCommit = null;
let currentFiber = null;

function render (vnode, node) {
  let rootFiber = {
    tag: ROOT,
    node,
    props: { children: vnode }
  };
  scheduleWork(rootFiber);
}

function scheduleWork (fiber) {
  scheduleCallback(performWork);
  nextWork = fiber;
}

function performWork (didout) {
  while (nextWork && !didout) {
    nextWork = performNext(nextWork);
  }

  if (pendingCommit) {
    options.commitWork
      ? options.commitWork(pendingCommit)
      : commitWork(pendingCommit);
  }
}

function performNext (WIP) {
  WIP.parentNode = getParentNode(WIP);
  WIP.tag == HOOK ? updateHOOK(WIP) : updateHost(WIP);
  if (WIP.child) return WIP.child
  while (WIP) {
    completeWork(WIP);
    if (WIP.sibling) return WIP.sibling
    WIP = WIP.parent;
  }
}

function updateHost (WIP) {
  if (!options.end && !WIP.node) {
    if (WIP.type === 'svg') WIP.tag = SVG;
    WIP.node = createElement(WIP);
  }
  let p = WIP.parentNode || {};
  WIP.insertPoint = p.lastFiber || null;
  p.lastFiber = WIP;
  WIP.node.lastFiber = null;
  reconcileChildren(WIP, WIP.props.children);
}

function getParentNode (fiber) {
  if (!fiber.parent) return fiber.node
  while (fiber.parent.tag === HOOK) return fiber.parent.parent.node
  return fiber.parent.node
}

function updateHOOK (WIP) {
  WIP.props = WIP.props || {};
  WIP.state = WIP.state || {};
  currentFiber = WIP;
  resetCursor();
  reconcileChildren(WIP, WIP.type(WIP.props));
}

function reconcileChildren (WIP, children) {
  const oldFibers = WIP.kids;
  const newFibers = (WIP.kids = hashfy(children, WIP.kids));
  let reused = {};

  for (const k in oldFibers) {
    let newFiber = newFibers[k];
    let oldFiber = oldFibers[k];

    if (newFiber && newFiber.type === oldFiber.type) {
      reused[k] = oldFiber;
    } else {
      oldFiber.patchTag = DELETE;
      WIP.patches.push(oldFiber);
    }
  }

  let prevFiber = null;
  let alternate = null;

  for (const k in newFibers) {
    let newFiber = newFibers[k];
    let oldFiber = reused[k];

    if (oldFiber) {
      alternate = createFiber(oldFiber, { patchTag: UPDATE });
      if (!options.end) newFiber.patchTag = UPDATE;
      newFiber = merge(alternate, newFiber);
      newFiber.alternate = alternate;
      if (newFiber.key) newFiber.patchTag = PLACE;
    } else {
      newFiber = createFiber(newFiber, { patchTag: PLACE });
    }

    newFibers[k] = newFiber;
    newFiber.parent = WIP;

    if (prevFiber) {
      prevFiber.sibling = newFiber;
    } else {
      if (WIP.tag === SVG) newFiber.tag = SVG;
      WIP.child = newFiber;
    }
    prevFiber = newFiber;
  }
  if (prevFiber) prevFiber.sibling = null;
}

function createFiber (vnode, data) {
  data.tag = typeof vnode.type === 'function' ? HOOK : HOST;
  return merge(vnode, data)
}

function completeWork (fiber) {
  if (!options.end && fiber.parent) {
    fiber.parent.patches = (fiber.parent.patches || []).concat(
      fiber.patches || [],
      fiber.patchTag ? [fiber] : []
    );
  } else {
    pendingCommit = fiber;
  }
}

function commitWork (WIP) {
  WIP.patches.forEach(p => {
    p.parent.patches = p.patches = null;
    commit(p);
    const e = p.effects;
    if (e) for (const k in e) e[k]();
  });
  nextWork = pendingCommit = null;
}
function commit (fiber) {
  let parent = fiber.parentNode;
  let dom = fiber.node;
  while (!dom) dom = fiber.child.node;
  switch (fiber.patchTag) {
    case UPDATE:
      updateElement(dom, fiber.alternate.props, fiber.props);
      break
    case DELETE:
      parent.removeChild(dom);
      break
    default:
      let point = fiber.insertPoint ? fiber.insertPoint.node : null;
      let after = point ? point.nextSibling : parent.firstChild;
      if (fiber.tag === HOOK || after === dom) return
      if (after === null && dom === parent.lastChild) return
      parent.insertBefore(dom, after);
      break
  }
}

function getWIP () {
  return currentFiber || null
}

export { h as createElement, h, options, render, scheduleWork, useCallback, useEffect, useMemo, useReducer, useState };
//# sourceMappingURL=fre-esm.js.map
