/**
 * by 132yse Copyright 2019-05-01
 */

(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = global || self, factory(global.fre = {}));
}(this, function (exports) { 'use strict';

  function h (type, props) {
    let rest = [];
    let children = [];
    let length = arguments.length;
    while (length-- > 2) rest.push(arguments[length]);
    while (rest.length) {
      let node = rest.pop();
      if (node && node.pop) {
        for (length = node.length; length--;) rest.push(node[length]);
      } else if (node === null || node === true || node === false) ; else {
        children.push(
          typeof node !== 'object' ? { type: 'text', nodeValue: node } : node
        );
      }
    }
    return { type, props: { ...props, children }, key: (props || {}).key || null }
  }

  const defer =
    typeof Promise === 'function' ? cb => Promise.resolve().then(cb) : setTimeout;
  const arrayfy = array =>
    !array ? [] : Array.isArray(array) ? array : [array];
  const isNew = (prev, next) => key => prev[key] !== next[key];
  const isSame = (a, b) => a.type == b.type && a.key == b.key;
  const hashfy = arr => {
    let out = {};
    let i = 0;
    arrayfy(arr).forEach(item => {
      let key = ((item || {}).props || {}).key;
      key ? (out['.' + key] = item) : (out['.' + i] = item) && i++;
    });
    return out
  };
  const merge = (a, b) => {
    for (var i in b) a[i] = b[i];
  };

  function updateProperty (element, name, value, newValue) {
    if (name === 'children' || name === 'key') ; else if (name === 'style') {
      Object.keys(newValue).forEach(key => {
        let style = !newValue || !newValue[key] ? '' : newValue[key];
        element[name][key] = style;
      });
    } else if (name[0] === 'o' && name[1] === 'n') {
      name = name.slice(2).toLowerCase();
      if (value) {
        element.removeEventListener(name, value);
      }
      element.addEventListener(name, newValue);
    } else {
      element.setAttribute(name, newValue);
    }
  }
  function updateElement (element, props, newProps) {
    Object.keys(newProps)
      .filter(isNew(props, newProps))
      .forEach(key => {
        if (key === 'value' || key === 'nodeValue') {
          element[key] = newProps[key];
        } else {
          updateProperty(element, key, props[key], newProps[key]);
        }
      });
  }
  function createElement (fiber) {
    const element =
      fiber.type === 'text'
        ? document.createTextNode('')
        : document.createElement(fiber.type);
    updateElement(element, [], fiber.props);
    return element
  }

  let cursor = 0;
  let oldInputs = [];
  function update (key, reducer, value) {
    const current = this ? this : getCurrentFiber();
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
    let current = getCurrentFiber();
    let key = '$' + cursor;
    let setter = update.bind(current, key, reducer);
    if (!current) {
      return [initState, setter]
    } else {
      cursor++;
      let state = current.state || {};
      if (typeof state === 'object' && key in state) {
        return [state[key], setter]
      } else {
        current.state[key] = initState;
      }
      let value = initState;
      return [value, setter]
    }
  }
  function useEffect (effect, inputs) {
    let current = getCurrentFiber();
    if (current) {
      let key = '$' + cursor;
      current.effects[key] = useMemo(effect, inputs);
      cursor++;
    }
  }
  function useMemo (create, inputs) {
    return function () {
      let current = getCurrentFiber();
      if (current) {
        let hasChaged = inputs
          ? oldInputs.some((value, i) => inputs[i] !== value)
          : true;
        if (hasChaged) {
          create();
        }
        oldInputs = inputs;
      }
    }
  }
  function createContext (initContext = {}) {
    let context = initContext;
    let setters = [];
    const update = newContext => setters.forEach(fn => fn(newContext));
    const subscribe = fn => setters.push(fn);
    const unSubscribe = fn => (setters = setters.filter(f => f !== fn));
    return { context, update, subscribe, unSubscribe }
  }
  function useContext (ctx) {
    const [context, setContext] = useState(ctx.context);
    ctx.subscribe(setContext);
    useEffect(() => ctx.unSubscribe(setContext));
    return [context, ctx.update]
  }

  const [HOST, HOOK, ROOT, PLACE, DELETE, UPDATE] = [
    'host',
    'hook',
    'root',
    'place',
    'delete',
    'update'
  ];
  let microtasks = [];
  let nextWork = null;
  let pendingCommit = null;
  let currentFiber = null;
  function render (vdom, container) {
    let rootFiber = {
      tag: ROOT,
      base: container,
      props: { children: vdom }
    };
    microtasks.push(rootFiber);
    defer(workLoop);
  }
  function scheduleWork (fiber) {
    microtasks.push(fiber);
    defer(workLoop);
  }
  function workLoop () {
    if (!nextWork && microtasks.length) {
      const update = microtasks.shift();
      if (!update) return
      nextWork = update;
    }
    while (nextWork) {
      nextWork.patches = [];
      nextWork = performWork(nextWork);
    }
    if (pendingCommit) {
      commitAllWork(pendingCommit);
    }
  }
  function performWork (WIP) {
    WIP.tag == HOOK ? updateHOOK(WIP) : updateHost(WIP);
    if (WIP.child) return WIP.child
    while (WIP) {
      completeWork(WIP);
      if (WIP.sibling) return WIP.sibling
      WIP = WIP.parent;
    }
  }
  function updateHost (WIP) {
    if (!WIP.base) WIP.base = createElement(WIP);
    const newChildren = WIP.props.children;
    reconcileChildren(WIP, newChildren);
  }
  function updateHOOK (WIP) {
    let instance = WIP.base;
    if (instance == null) {
      instance = WIP.base = createInstance(WIP);
    }
    WIP.props = WIP.props || {};
    WIP.state = WIP.state || {};
    WIP.effects = WIP.effects || {};
    currentFiber = WIP;
    resetCursor();
    const newChildren = WIP.type(WIP.props);
    reconcileChildren(WIP, newChildren);
  }
  function fiberize (children, WIP) {
    return (WIP.children = hashfy(children))
  }
  function reconcileChildren (WIP, newChildren) {
    const oldFibers = WIP.children;
    const newFibers = fiberize(newChildren, WIP);
    let reused = {};
    for (let o in oldFibers) {
      let newFiber = newFibers[o];
      let oldFiber = oldFibers[o];
      if (newFiber && oldFiber.type === newFiber.type) {
        reused[o] = oldFiber;
        if (newFiber.key) {
          oldFiber.key = newFiber.key;
        }
        continue
      }
    }
    let prevFiber = null;
    let alternate = null;
    for (let n in newFibers) {
      let newFiber = newFibers[n];
      let oldFiber = reused[n];
      if (oldFiber) {
        if (isSame(oldFiber, newFiber)) {
          alternate = new Fiber(oldFiber, {
            patchTag: UPDATE
          });
          newFiber = { ...alternate, ...newFiber };
          newFiber.patchTag = UPDATE;
          newFiber.alternate = alternate;
        }
      } else {
        newFiber = new Fiber(newFiber, {
          patchTag: PLACE
        });
      }
      newFibers[n] = newFiber;
      newFiber.parent = WIP;
      if (prevFiber) {
        prevFiber.sibling = newFiber;
      } else {
        WIP.child = newFiber;
      }
      prevFiber = newFiber;
    }
  }
  function createInstance (fiber) {
    const instance = new fiber.type(fiber.props);
    instance.fiber = fiber;
    return instance
  }
  function Fiber (vnode, data) {
    this.patchTag = data.patchTag;
    this.tag = data.tag || typeof vnode.type === 'function' ? HOOK : HOST;
    vnode.props = vnode.props || { nodeValue: vnode.nodeValue };
    merge(this, vnode);
  }
  function completeWork (fiber) {
    if (fiber.tag == HOOK) fiber.base.fiber = fiber;
    if (fiber.parent) {
      const childPatches = fiber.patches || [];
      const selfPatches = fiber.patchTag ? [fiber] : [];
      const parentPatches = fiber.parent.patches || [];
      fiber.parent.patches = parentPatches.concat(childPatches, selfPatches);
    } else {
      pendingCommit = fiber;
    }
  }
  function commitAllWork (WIP) {
    WIP.patches.forEach(p => commitWork(p));
    commitEffects(currentFiber.effects);
    WIP.base.rootFiber = WIP;
    WIP.patches = [];
    nextWork = null;
    pendingCommit = null;
  }
  function commitWork (fiber) {
    if (fiber.tag == ROOT) return
    let parentFiber = fiber.parent;
    while (parentFiber.tag == HOOK) {
      parentFiber = parentFiber.parent;
    }
    const parent = parentFiber.base;
    let dom = fiber.base;
    let after = (fiber.sibling || {}).base;
    if (fiber.patchTag == PLACE && fiber.tag == HOST) {
      try {
        parent.insertBefore(dom, after);
      } catch {
        parent.appendChild(dom);
      }
    } else if (fiber.patchTag == UPDATE && fiber.tag == HOST) {
      updateElement(fiber.base, fiber.alternate.props, fiber.props);
    } else if (fiber.patchTag == DELETE) {
      commitDELETE(fiber, parentNode);
    }
  }
  function commitDELETE (fiber, domParent) {
    let node = fiber;
    while (true) {
      if (node.tag == HOOK) {
        node = node.child;
        continue
      }
      domParent.removeChild(node.base);
      while (node != fiber && !node.sibling) {
        node = node.parent;
      }
      if (node == fiber) {
        return
      }
      node = node.sibling;
    }
  }
  function getCurrentFiber () {
    return currentFiber || null
  }
  function commitEffects (effects) {
    Object.keys(effects).forEach(key => {
      let effect = effects[key];
      effect();
    });
  }

  exports.createContext = createContext;
  exports.h = h;
  exports.render = render;
  exports.useContext = useContext;
  exports.useEffect = useEffect;
  exports.useMemo = useMemo;
  exports.useReducer = useReducer;
  exports.useState = useState;

  Object.defineProperty(exports, '__esModule', { value: true });

}));
