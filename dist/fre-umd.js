(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = global || self, factory(global.fre = {}));
}(this, function (exports) { 'use strict';

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

  const isNew = (o, n) => k => k !== 'children' && o[k] !== n[k];

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
    current.effect = current.effects || {};
    current.effect[key] = useCallback(cb, inputs);
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
  let inMC = false;
  let frameLength = 5;
  let frameDeadline = 0;

  function scheduleCallback (callback) {
    const currentTime = getTime();
    let startTime = currentTime;
    let timeout = 5000; // idle
    let dueTime = startTime + timeout;

    let newTask = {
      callback,
      startTime,
      dueTime
    };

    push(taskQueue, newTask);

    requestHostCallback(flushWork);

    return newTask
  }
  function requestHostCallback (cb) {
    currentCallback = cb;
    if (!inMC) {
      inMC = true;
      planWork();
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
      if (currentTask.dueTime > currentTime && shouldYeild()) break
      let callback = currentTask.callback;
      if (callback) {
        currentTask.callback = null;
        let next = callback();
        if (next) {
          currentTask.callback = next;
        } else {
          if (currentTask === peek(taskQueue)) {
            pop(taskQueue);
          }
        }
      } else pop(taskQueue);
      currentTask = peek(taskQueue);
    }

    return !!currentTask
  }

  function performWork () {
    if (currentCallback) {
      let currentTime = getTime();
      frameDeadline = currentTime + frameLength;
      let moreWork = currentCallback(currentTime);
      if (!moreWork) {
        inMC = false;
        currentCallback = null;
      } else {
        planWork();
      }
    } else inMC = false;
  }

  const planWork = (() => {
    if (typeof MessageChannel !== "undefined") {
      const channel = new MessageChannel();
      const port = channel.port2;
      channel.port1.onmessage = performWork;

      return () => port.postMessage(null)
    }

    return () => setTimeout(performWork, 0)
  })();

  function shouldYeild () {
    return getTime() > frameDeadline
  }

  const getTime = () => performance.now();

  const options = {};
  const [HOST, HOOK, ROOT, SVG, PLACE, UPDATE, DELETE] = [0, 1, 2, 3, 4, 5, 6];

  let nextWork = null;
  let pendingCommit = null;
  let currentFiber = null;

  function render (vnode, node, done) {
    let rootFiber = {
      tag: ROOT,
      node,
      props: { children: vnode },
      done
    };
    scheduleWork(rootFiber);
  }

  function scheduleWork (fiber) {
    nextWork = fiber;
    scheduleCallback(performWork$1);
  }

  function performWork$1 () {
    while (nextWork && !shouldYeild()) {
      nextWork = performNext(nextWork);
    }

    if (pendingCommit) {
      commitWork(pendingCommit);
      return null
    }

    return performWork$1.bind(null)
  }

  function performNext (WIP) {
    WIP.parentNode = getParentNode(WIP);
    WIP.patches = [];
    WIP.tag == HOOK ? updateHOOK(WIP) : updateHost(WIP);
    if (WIP.child) return WIP.child
    while (WIP) {
      completeWork(WIP);
      if (WIP.sibling) return WIP.sibling
      WIP = WIP.parent;
    }
  }

  function updateHost (WIP) {
    if (!WIP.node) {
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
    let parent = fiber.parent;
    if (!parent) return fiber.node
    while (parent.tag === HOOK) parent = parent.parent;
    return parent.node
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

      if (oldFiber && isSame(oldFiber, newFiber)) {
        alternate = createFiber(oldFiber, { patchTag: UPDATE });
        newFiber.patchTag = UPDATE;
        newFiber = merge(alternate, newFiber);
        newFiber.alternate = alternate;
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

  function isSame (a, b) {
    return a.type == b.type && a.key == b.key
  }

  function createFiber (vnode, data) {
    data.tag = typeof vnode.type === 'function' ? HOOK : HOST;
    return merge(vnode, data)
  }

  function completeWork (fiber) {
    if (fiber.parent) {
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
      traverse(p.effect);
    });
    WIP.done && WIP.done();
    nextWork = pendingCommit = null;
  }

  function traverse (fns) {
    for (const k in fns) {
      const fn = fns[k];
      fn();
    }
  }
  function commit (fiber) {
    let tag = fiber.patchTag;
    let parent = fiber.parentNode;
    let dom = fiber.node;
    while (!dom) dom = fiber.child.node;

    if (tag === DELETE) {
      parent.removeChild(dom);
    } else if (fiber.tag === HOOK) ; else if (tag === UPDATE) {
      updateElement(dom, fiber.alternate.props, fiber.props);
    } else {
      let point = fiber.insertPoint ? fiber.insertPoint.node : null;
      let after = point ? point.nextSibling : parent.firstChild;
      if (after === dom) return
      if (after === null && dom === parent.lastChild) return
      parent.insertBefore(dom, after);
    }
  }

  function getWIP () {
    return currentFiber || null
  }

  const arrayfy = arr => (!arr ? [] : arr.pop ? arr : [arr]);

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

  exports.createElement = h;
  exports.h = h;
  exports.options = options;
  exports.render = render;
  exports.scheduleWork = scheduleWork;
  exports.useCallback = useCallback;
  exports.useEffect = useEffect;
  exports.useMemo = useMemo;
  exports.useReducer = useReducer;
  exports.useState = useState;

}));
//# sourceMappingURL=fre-umd.js.map
