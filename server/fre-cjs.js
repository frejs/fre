'use strict';

function h (type, attrs) {
  let props = attrs || {};
  let key = props.key || null;
  let ref = props.ref || null;
  let children = [];

  for (let i = 2; i < arguments.length; i++) {
    let vnode = arguments[i];
    if (vnode == null || vnode === true || vnode === false) ; else if (typeof vnode === 'string' || typeof vnode === 'number') {
      children.push(createText(vnode));
    } else {
      children.push(vnode);
    }
  }

  if (children.length) {
    props.children = children.length === 1 ? children[0] : children;
  }

  delete props.key;
  delete props.ref;
  return { type, props, key, ref }
}

function createText(vnode){
  return { type: 'text', props: { nodeValue: vnode } }
}

function updateElement (dom, oldProps, newProps) {
  for (let name in { ...oldProps, ...newProps }) {
    let oldValue = oldProps[name];
    let newValue = newProps[name];

    if (oldValue == newValue || name === 'children') ; else if (name === 'style') {
      for (const k in { ...oldValue, ...newValue }) {
        if (!(oldValue && newValue && oldValue[k] === newValue[k])) {
          dom[name][k] = (newValue && newValue[k]) || '';
        }
      }
    } else if (name[0] === 'o' && name[1] === 'n') {
      name = name.slice(2).toLowerCase();
      if (oldValue) dom.removeEventListener(name, oldValue);
      dom.addEventListener(name, newValue);
    } else if (name in dom && !(dom instanceof SVGElement)) {
      dom[name] = newValue == null ? '' : newValue;
    } else if (newValue == null || newValue === false) {
      dom.removeAttribute(name);
    } else {
      dom.setAttribute(name, newValue);
    }
  }
}

function createElement (fiber) {
  const dom =
    fiber.type === 'text'
      ? document.createTextNode('')
      : fiber.tag === SVG
        ? document.createElementNS('http://www.w3.org/2000/svg', fiber.type)
        : document.createElement(fiber.type);
  updateElement(dom, {}, fiber.props);
  return dom
}

let cursor = 0;

function resetCursor () {
  cursor = 0;
}

function useState (initState) {
  return useReducer(null, initState)
}

function useReducer (reducer, initState) {
  const hook = getHook(cursor++);
  const current = getCurrentHook();

  function setter (value) {
    let newValue = reducer
      ? reducer(hook[0], value)
      : isFn(value)
        ? value(hook[0])
        : value;
    hook[0] = newValue;
    !options.currentFiber&&scheduleWork(current, true);
  }

  if (hook.length) {
    return [hook[0], setter]
  } else {
    hook[0] = initState;
    return [initState, setter]
  }
}

function useEffect (cb, deps) {
  let hook = getHook(cursor++);
  if (isChanged(hook[1], deps)) {
    hook[0] = useCallback(cb, deps);
    hook[1] = deps;
    getCurrentHook().hooks.effect.push(hook);
  }
}

function useMemo (cb, deps) {
  let hook = getHook(cursor++);
  if (isChanged(hook[1], deps)) {
    hook[1] = deps;
    return (hook[0] = cb())
  }
  return hook[0]
}

function useCallback (cb, deps) {
  return useMemo(() => cb, deps)
}

function useRef (current) {
  return useMemo(() => ({ current }), [])
}

function getHook (cursor) {
  const currentHook = getCurrentHook();
  let hooks =
    currentHook.hooks ||
    (currentHook.hooks = { list: [], effect: [], cleanup: [] });
  if (cursor >= hooks.list.length) {
    hooks.list.push([]);
  }

  // console.log(currentHook,cursor)
  return hooks.list[cursor]
}

function isChanged (a, b) {
  return !a || b.some((arg, index) => arg !== a[index])
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
          if (right && compare(right, left) < 0) {
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
  return a.dueTime - b.dueTime
}

function peek (heap) {
  return heap[0] || null
}

let taskQueue = [];
let currentTask = null;
let currentCallback = null;
let scheduling = false;
let frameDeadline = 0;
let frameLength = 1000 / 60;

function scheduleCallback (callback) {
  const currentTime = getTime();
  let startTime = currentTime;
  let timeout = 3000;
  let dueTime = startTime + timeout;

  let newTask = {
    callback,
    startTime,
    dueTime
  };

  push(taskQueue, newTask);

  currentCallback = flushWork;

  if (!scheduling) {
    planWork();
    scheduling = true;
  }

  return newTask
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
    if (currentTask.dueTime > currentTime && shouldYeild()) {
      break
    }
    let callback = currentTask.callback;
    if (callback) {
      currentTask.callback = null;
      const didout = currentTask.dueTime <= currentTime;

      let next = callback(didout);
      if (next) {
        currentTask.callback = next;
      } else {
        pop(taskQueue);
      }
    } else {
      pop(taskQueue);
    }

    currentTask = peek(taskQueue);
    currentTime = getTime();
  }

  if (currentTask) {
    return true
  } else {
    return false
  }
}

function performWork () {
  if (currentCallback) {
    let currentTime = getTime();
    frameDeadline = currentTime + frameLength;
    let moreWork = currentCallback(currentTime);

    if (moreWork) {
      planWork();
    } else {
      scheduling = false;
      currentCallback = null;
    }
  }
}

const planWork = (() => {
  if (typeof MessageChannel !== 'undefined') {
    const channel = new MessageChannel();
    const port = channel.port2;
    channel.port1.onmessage = performWork;

    return () => port.postMessage(null)
  }

  return () => setTimeout(performWork, 0)
})();

function shouldYeild () {
  return getTime() >= frameDeadline
}

const getTime = () => performance.now();

var options = {};
const [HOST, SVG, HOOK, PLACE, UPDATE, DELETE] = [0, 1, 2, 3, 4, 5];

let preCommit = null;
let currentFiber = null;
let WIP = null;
let updateQueue = [];
let commitQueue = [];

function render (vnode, node, done) {
  let rootFiber = {
    tag: HOST,
    node,
    props: { children: vnode },
    done
  };
  scheduleWork(rootFiber);
}

function scheduleWork (fiber, lock) {
  fiber.lock = lock;
  updateQueue.push(fiber);
  WIP = updateQueue.shift();
  scheduleCallback(reconcileWork);
}

function reconcileWork (didout) {
  let suspend = null;
  while (WIP && (!shouldYeild() || didout)) {
    try {
      WIP = reconcile(WIP);
    } catch (e) {
      if (!!e && typeof e.then === 'function') {
        suspend = WIP;
        WIP = null;
        e.then(() => {
          WIP = suspend;
        });
      } else throw e
    }
  }
  if (preCommit) {
    commitWork(preCommit);
    return null
  }
  if (WIP && !didout) {
    return reconcileWork.bind(null)
  }
  if (updateQueue.length > 0) {
    WIP = updateQueue.shift();
    scheduleCallback(reconcileWork);
  }
  return null
}

function reconcile (WIP) {
  WIP.parentNode = getParentNode(WIP);
  WIP.tag == HOOK ? updateHOOK(WIP) : updateHost(WIP);
  commitQueue.push(WIP);

  if (WIP.child) return WIP.child
  while (WIP) {
    if (WIP.lock == false || !WIP.parent) {
      preCommit = WIP;
    }
    if (WIP.sibling && WIP.lock == null) {
      return WIP.sibling
    }
    WIP = WIP.parent;
  }
}

function updateHOOK (WIP) {
  WIP.props = WIP.props || {};
  currentFiber = WIP;
  resetCursor();
  let children = WIP.type(WIP.props);
  if (!children.type) {
    children = createText(children);
  }
  reconcileChildren(WIP, children);
}

function updateHost (WIP) {
  if (!WIP.node) {
    if (WIP.type === 'svg') WIP.tag = SVG;
    WIP.node = createElement(WIP);
  }
  let p = WIP.parentNode || {};
  WIP.insertPoint = p.last || null;
  p.last = WIP;
  WIP.node.last = null;
  reconcileChildren(WIP, WIP.props.children);
}
function getParentNode (fiber) {
  while ((fiber = fiber.parent)) {
    if (fiber.tag < HOOK) return fiber.node
  }
}

function reconcileChildren (WIP, children) {
  if (!children) return
  delete WIP.child;
  const oldFibers = WIP.kids;
  const newFibers = (WIP.kids = hashfy(children));

  let reused = {};

  for (const k in oldFibers) {
    let newFiber = newFibers[k];
    let oldFiber = oldFibers[k];

    if (newFiber && newFiber.type === oldFiber.type) {
      reused[k] = oldFiber;
    } else {
      oldFiber.op = DELETE;
      commitQueue.push(oldFiber);
    }
  }

  let prevFiber = null;
  let alternate = null;

  for (const k in newFibers) {
    let newFiber = newFibers[k];
    let oldFiber = reused[k];

    if (oldFiber) {
      alternate = createFiber(oldFiber, UPDATE);
      newFiber.op = UPDATE;
      newFiber = { ...alternate, ...newFiber };
      newFiber.alternate = alternate;
      if (shouldPlace(newFiber)) {
        newFiber.op = PLACE;
      }
    } else {
      newFiber = createFiber(newFiber, PLACE);
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
  WIP.lock = WIP.lock ? false : null;
}

function shouldPlace (fiber) {
  let p = fiber.parent;
  if (p.tag === HOOK) return p.key && !p.lock
  return fiber.key
}

function commitWork (fiber) {
  commitQueue.forEach(c => {
    if (c.parent) commit(c);
  });
  fiber.done && fiber.done();
  commitQueue = [];
  preCommit = null;
  WIP = null;
}

function commit (fiber) {
  let op = fiber.op;
  let parent = fiber.parentNode;
  let dom = fiber.node;
  let ref = fiber.ref;
  if (op === DELETE) {
    defer(fiber, (dom = null));
    delRef(fiber.kids);
    while (fiber.tag === HOOK) fiber = fiber.child;
    parent.removeChild(fiber.node);
  } else if (fiber.tag === HOOK) {
    defer(fiber);
  } else if (op === UPDATE) {
    updateElement(dom, fiber.alternate.props, fiber.props);
    refer(ref, null);
  } else {
    let point = fiber.insertPoint ? fiber.insertPoint.node : null;
    let after = point ? point.nextSibling : parent.firstChild;
    if (after === dom) return
    if (after === null && dom === parent.lastChild) return
    parent.insertBefore(dom, after);
  }
  refer(ref, dom);
}

function createFiber (vnode, op) {
  return { ...vnode, op, tag: isFn(vnode.type) ? HOOK : HOST }
}

const arrayfy = arr => (!arr ? [] : arr.pop ? arr : [arr]);

function hashfy (arr) {
  let out = {};
  let i = 0;
  let j = 0;
  arrayfy(arr).forEach(item => {
    if (item.pop) {
      item.forEach(item => {
        item.key
          ? (out['.' + i + '.' + item.key] = item)
          : (out['.' + i + '.' + j] = item) && j++;
      });
      i++;
    } else {
      item.key ? (out['.' + item.key] = item) : (out['.' + i] = item) && i++;
    }
  });
  return out
}

const isFn = fn => typeof fn === 'function';
let raf =
  typeof requestAnimationFrame === 'undefined'
    ? setTimeout
    : requestAnimationFrame;

function defer (fiber) {
  raf(() => {
    if (fiber.hooks) {
      fiber.hooks.cleanup.forEach(c => c());
      fiber.hooks.effect.forEach((e, i) => {
        const res = e[0]();
        if (res) fiber.hooks.cleanup[i] = res;
      });
      fiber.hooks.effect = [];
    }
  });
}

function refer (ref, dom) {
  if (ref) isFn(ref) ? ref(dom) : (ref.current = dom);
}

function delRef (kids) {
  raf(() => {
    for (const k in kids) {
      const kid = kids[k];
      refer(kid.ref, null);
      if (kid.kids) delRef(kid.kids);
    }
  });
}

function getCurrentHook() {
  return currentFiber || options.currentFiber
}

exports.createElement = h;
exports.h = h;
exports.options = options;
exports.render = render;
exports.scheduleWork = scheduleWork;
exports.useCallback = useCallback;
exports.useEffect = useEffect;
exports.useMemo = useMemo;
exports.useReducer = useReducer;
exports.useRef = useRef;
exports.useState = useState;
exports.resetCursor = resetCursor;
//# sourceMappingURL=fre-cjs.js.map
