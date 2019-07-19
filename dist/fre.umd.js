/**
 * by 132yse Copyright 2019-07-19
 */

(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = global || self, factory(global.fre = {}));
}(this, function (exports) { 'use strict';

  const arrayfy = arr => (!arr ? [] : Array.isArray(arr) ? arr : [arr]);
  const isSame = (a, b) =>
    a.type === b.type || typeof a.type === typeof b.type;
  const isNew = (o, n) => k =>
    k !== 'children' && k !== 'key' && o[k] !== n[k];
  function hashfy (arr) {
    let out = {};
    let i = 0;
    arrayfy(arr).forEach(item => {
      let key = ((item || {}).props || {}).key;
      key ? (out['.' + key] = item) : (out['.' + i] = item) && i++;
    });
    return out
  }
  function merge (a, b) {
    let out = {};
    for (var i in a) out[i] = a[i];
    for (var i in b) out[i] = b[i];
    return out
  }
  const defer =
    typeof Promise === 'function' ? cb => Promise.resolve().then(cb) : setTimeout;

  function h (type, props) {
    let rest = [];
    let children = [];
    let length = arguments.length;
    while (length-- > 2) rest.push(arguments[length]);
    while (rest.length) {
      let vnode = rest.pop();
      if (vnode && vnode.pop) {
        for (length = vnode.length; length--;) rest.push(vnode[length]);
      } else if (vnode === null || vnode === true || vnode === false) {
        vnode = { type: () => {} };
      } else if (typeof vnode === 'function') {
        children = vnode;
      } else {
        children.push(
          typeof vnode === 'object'
            ? vnode
            : { type: 'text', props: { nodeValue: vnode } }
        );
      }
    }
    return {
      type,
      props: merge(props, { children }),
      key: props && props.key
    }
  }

  function updateProperty (element, name, value, newValue) {
    if (name === 'style') {
      for (key in newValue) {
        let style = !newValue || !newValue[key] ? '' : newValue[key];
        element[name][key] = style;
      }
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
  function update(key, reducer, value) {
    const current = this ? this : getWIP();
    value = reducer ? reducer(current.state[key], value) : value;
    current.state[key] = value;
    scheduleWork(current);
  }
  function resetCursor() {
    cursor = 0;
  }
  function useState(initState) {
    return useReducer(null, initState)
  }
  function useReducer(reducer, initState) {
    let current = getWIP();
    if (!current) return [initState, setter]
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
  function useEffect(cb, inputs) {
    let current = getWIP();
    if (current) current.effect = useMemo(cb, inputs);
  }
  function useMemo(cb, inputs) {
    return () => {
      let current = getWIP();
      if (current) {
        let hasChaged = inputs
          ? (current.oldInputs || []).some((v, i) => inputs[i] !== v)
          : true;
        if (inputs && !inputs.length && !current.isMounted) {
          hasChaged = true;
          current.isMounted = true;
        }
        if (hasChaged) cb();
        current.oldInputs = inputs;
      }
    }
  }
  function createContext(init = {}) {
    let context = init;
    let set = {};
    const update = context => {
      for (let key in set) set[key](context);
    };
    const subscribe = (fn, name) => {
      if(name in set) return
      set[name] = fn;
    };
    return { context, update, subscribe, set }
  }
  function useContext(ctx) {
    const [context, setContext] = useState(ctx.context);
    const name = getWIP().type.name;
    ctx.subscribe(setContext, name);
    return [context, ctx.update]
  }

  const options = {};
  const [HOST, HOOK, ROOT, PLACE, REPLACE, UPDATE, DELETE] = [0, 1, 2, 3, 4, 5, 6];
  let updateQueue = [];
  let nextWork = null;
  let pendingCommit = null;
  let currentFiber = null;
  function render(vnode, el) {
    let rootFiber = {
      tag: ROOT,
      base: el,
      props: { children: vnode }
    };
    scheduleWork(rootFiber);
  }
  function scheduleWork(fiber) {
    updateQueue.push(fiber);
    defer(workLoop);
  }
  function workLoop() {
    if (!nextWork && updateQueue.length) {
      const update = updateQueue.shift();
      if (!update) return
      nextWork = update;
    }
    while (nextWork) {
      nextWork = performWork(nextWork);
    }
    if (pendingCommit) {
      options.commitWork
        ? options.commitWork(pendingCommit)
        : commitWork(pendingCommit);
    }
  }
  function performWork(WIP) {
    WIP.tag == HOOK ? updateHOOK(WIP) : updateHost(WIP);
    if (WIP.child) return WIP.child
    while (WIP) {
      completeWork(WIP);
      if (WIP.sibling) return WIP.sibling
      WIP = WIP.parent;
    }
  }
  function updateHost(WIP) {
    if (!options.end && !WIP.base) {
      WIP.base = createElement(WIP);
    }
    let parent = WIP.parent || {};
    WIP.insertPoint = parent.oldPoint;
    parent.oldPoint = WIP;
    const children = WIP.props.children;
    reconcileChildren(WIP, children);
  }
  function updateHOOK(WIP) {
    WIP.props = WIP.props || {};
    WIP.state = WIP.state || {};
    currentFiber = WIP;
    resetCursor();
    const children = WIP.type(WIP.props);
    reconcileChildren(WIP, children);
    currentFiber.patches = WIP.patches;
  }
  function fiberize(children, WIP) {
    return (WIP.children = hashfy(children))
  }
  function reconcileChildren(WIP, children) {
    const oldFibers = WIP.children;
    const newFibers = fiberize(children, WIP);
    let reused = {};
    for (let k in oldFibers) {
      let newFiber = newFibers[k];
      let oldFiber = oldFibers[k];
      if (newFiber && isSame(newFiber, oldFiber)) {
        reused[k] = oldFiber;
      } else {
        oldFiber.patchTag = DELETE;
        WIP.patches.push(oldFiber);
      }
    }
    let prevFiber = null;
    let alternate = null;
    for (let k in newFibers) {
      let newFiber = newFibers[k];
      let oldFiber = reused[k];
      if (oldFiber) {
        if (isSame(oldFiber, newFiber)) {
          alternate = createFiber(oldFiber, {
            patchTag: UPDATE
          });
          if (!options.end) newFiber.patchTag = UPDATE;
          newFiber = merge(alternate, newFiber);
          newFiber.alternate = alternate;
          if (oldFiber.key) {
            newFiber.patchTag = REPLACE;
          }
        }
      } else {
        newFiber = createFiber(newFiber, {
          patchTag: PLACE
        });
      }
      newFibers[k] = newFiber;
      newFiber.parent = WIP;
      if (prevFiber) {
        prevFiber.sibling = newFiber;
      } else {
        WIP.child = newFiber;
      }
      prevFiber = newFiber;
    }
    if (prevFiber) prevFiber.sibling = null;
  }
  function createFiber(vnode, data) {
    data.tag = typeof vnode.type === 'function' ? HOOK : HOST;
    vnode.props = vnode.props || { nodeValue: vnode.nodeValue };
    return merge(vnode, data)
  }
  function completeWork(fiber) {
    if (!options.end && fiber.parent) {
      fiber.parent.patches = (fiber.parent.patches || []).concat(
        fiber.patches || [],
        fiber.patchTag ? [fiber] : []
      );
    } else {
      pendingCommit = fiber;
    }
  }
  function commitWork(WIP) {
    WIP.patches.forEach(p => commit(p));
    nextWork = pendingCommit = null;
  }
  function commit(fiber) {
    let parentFiber = fiber.parent;
    while (parentFiber.tag == HOOK) {
      parentFiber = parentFiber.parent;
    }
    const parent = parentFiber.base;
    let dom = fiber.base || fiber.child.base;
    const { insertPoint, patchTag } = fiber;
    if (fiber.tag == HOOK) {
      fiber.effect && fiber.effect();
      if (patchTag == DELETE) parent.removeChild(dom);
    } else if (patchTag == UPDATE) {
      updateElement(dom, fiber.alternate.props, fiber.props);
    } else if (patchTag == DELETE) {
      parent.removeChild(dom);
    } else {
      let after = insertPoint
        ? patchTag == PLACE
          ? insertPoint.base.nextSibling
          : insertPoint.base.nextSibling || parent.firstChild
        : null;
      if (after == dom) return
      parent.insertBefore(dom, after);
    }
    parentFiber.patches = fiber.patches = [];
  }
  function getWIP() {
    return currentFiber || null
  }

  exports.createContext = createContext;
  exports.createElement = h;
  exports.h = h;
  exports.options = options;
  exports.render = render;
  exports.scheduleWork = scheduleWork;
  exports.useContext = useContext;
  exports.useEffect = useEffect;
  exports.useMemo = useMemo;
  exports.useReducer = useReducer;
  exports.useState = useState;

  Object.defineProperty(exports, '__esModule', { value: true });

}));
