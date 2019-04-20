/**
 * by 132yse Copyright 2019-04-20
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
        for (length = node.length; length--;) {
          rest.push(node[length]);
        }
      } else if (node === null || node === true || node === false) ; else {
        if (typeof node !== 'object') node = { type: 'text', value: node };
        children.push(node);
      }
    }
    return { type, props: { ...props, children } }
  }

  const isEvent = name => name[0] === 'o' && name[1] === 'n';
  const isText = name => name === 'value';
  const isOther = name =>
    name !== 'value' && name[0] !== 'o' && name[1] !== 'n' && name !== 'children';
  const isNew = (prev, next) => key => prev[key] !== next[key];
  function updateProperties (dom, prevProps, nextProps) {
    Object.keys(nextProps)
      .filter(isText)
      .filter(isNew(prevProps, nextProps))
      .forEach(name => (dom['nodeValue'] = nextProps[name]));
    Object.keys(nextProps)
      .filter(isOther)
      .filter(isNew(prevProps, nextProps))
      .forEach(name => {
        dom.setAttribute(name, nextProps[name]);
      });
    Object.keys(prevProps)
      .filter(isEvent)
      .forEach(name => {
        const eventType = name.toLowerCase().substring(2);
        dom.removeEventListener(eventType, prevProps[name]);
      });
    Object.keys(nextProps)
      .filter(isEvent)
      .filter(isNew(prevProps, nextProps))
      .forEach(name => {
        const eventType = name.toLowerCase().substring(2);
        dom.addEventListener(eventType, nextProps[name]);
      });
  }
  function createElement (fiber) {
    const element =
      fiber.type === 'text'
        ? document.createTextNode('')
        : document.createElement(fiber.type);
    updateProperties(element, [], fiber.props);
    return element
  }

  let cursor = 0;
  let oldInputs = [];
  function update (key, reducer, value) {
    reducer ? (value = reducer(this.state[key], value)) : value;
    this.state[key] = value;
    scheduleWork(this);
  }
  function resetCursor () {
    cursor = 0;
  }
  function useState (initState) {
    return useReducer(null, initState)
  }
  function useReducer (reducer, initState) {
    let current = getCurrentInstance();
    let key = '$' + cursor;
    let setter = update.bind(current, key, reducer);
    if (!current) {
      return [initState, setter]
    } else {
      cursor++;
      let state = current.state;
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
    let current = getCurrentInstance();
    if (current) {
      let key = '$' + cursor;
      current.effects[key] = useMemo(effect, inputs);
      cursor++;
    }
  }
  function useMemo (create, inputs) {
    return function () {
      let current = getCurrentInstance();
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

  const defer =
    typeof Promise === 'function' ? cb => Promise.resolve().then(cb) : setTimeout;
  const arrayfy = array =>
    !array ? [] : Array.isArray(array) ? array : [array];

  const [HOST, HOOK, ROOT, PLACE, DELETE, UPDATE] = [
    'host',
    'hook',
    'root',
    'place',
    'delete',
    'update'
  ];
  let updateQueue = [];
  let nextWork = null;
  let pendingCommit = null;
  let currentInstance = null;
  function render (vdom, container) {
    updateQueue.push({
      from: ROOT,
      base: container,
      props: { children: vdom }
    });
    defer(workLoop);
  }
  function scheduleWork (instance) {
    updateQueue.push({
      from: HOOK,
      instance,
      state: instance.state
    });
    defer(workLoop);
  }
  function workLoop () {
    if (!nextWork && updateQueue.length) {
      resetWork();
    }
    while (nextWork) {
      nextWork = performWork(nextWork);
    }
    if (pendingCommit) {
      commitAllWork(pendingCommit);
    }
  }
  function resetWork () {
    const update = updateQueue.shift();
    if (!update) return
    if (update.state) {
      update.instance.fiber.state = update.state;
    }
    const root =
      update.from == ROOT ? update.base.rootFiber : getRoot(update.instance.fiber);
    nextWork = {
      tag: ROOT,
      base: update.base || root.base,
      props: update.props || root.props,
      alternate: root
    };
  }
  function performWork (WIP) {
    if (WIP.tag == HOOK) {
      updateHOOK(WIP);
    } else {
      updateHost(WIP);
    }
    if (WIP.child) {
      return WIP.child
    }
    let wip = WIP;
    while (wip) {
      completeWork(wip);
      if (wip.sibling) return wip.sibling
      wip = wip.parent;
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
    } else if (WIP.props == WIP.props && !WIP.state) {
      cloneChildFibers(WIP);
    }
    instance.props = WIP.props || {};
    instance.state = WIP.state || {};
    instance.effects = WIP.effects || {};
    currentInstance = instance;
    resetCursor();
    const newChildren = WIP.type(WIP.props);
    reconcileChildren(WIP, newChildren);
  }
  function reconcileChildren (WIP, newChildren) {
    const childs = arrayfy(newChildren);
    let index = 0;
    let oldFiber = WIP.alternate ? WIP.alternate.child : null;
    let newFiber = null;
    while (index < childs.length || oldFiber != null) {
      const prevFiber = newFiber;
      const child = index < childs.length && childs[index];
      const sameType = oldFiber && child && child.type == oldFiber.type;
      if (sameType) {
        newFiber = {
          tag: oldFiber.tag,
          base: oldFiber.base,
          parent: WIP,
          alternate: oldFiber,
          patchTag: UPDATE,
          type: oldFiber.type,
          props: child.props || { value: child.value },
          state: oldFiber.state
        };
      }
      if (child && !sameType) {
        newFiber = {
          tag: typeof child.type === 'string' ? HOST : HOOK,
          type: child.type,
          props: child.props || { value: child.value },
          parent: WIP,
          patchTag: PLACE
        };
      }
      if (oldFiber && !sameType) {
        oldFiber.patchTag = DELETE;
        WIP.patches = WIP.patches || [];
        WIP.patches.push(oldFiber);
      }
      if (oldFiber) {
        oldFiber = oldFiber.sibling;
      }
      if (index == 0) {
        WIP.child = newFiber;
      } else if (prevFiber && child) {
        prevFiber.sibling = newFiber;
      }
      index++;
    }
  }
  function createInstance (fiber) {
    const instance = new fiber.type(fiber.props);
    instance.fiber = fiber;
    return instance
  }
  function cloneChildFibers (parentFiber) {
    const oldFiber = parentFiber.alternate;
    if (!oldFiber.child) return
    let oldChild = oldFiber.child;
    let prevChild = null;
    while (oldChild) {
      const newChild = {
        type: oldChild.type,
        tag: oldChild.tag,
        base: oldChild.base,
        props: oldChild.props,
        state: oldChild.state,
        alternate: oldChild,
        parent: parentFiber
      };
      if (prevChild) {
        prevChild.sibling = newChild;
      } else {
        parentFiber.child = newChild;
      }
      prevChild = newChild;
      oldChild = oldChild.sibling;
    }
  }
  function completeWork (fiber) {
    if (fiber.tag == HOOK) {
      fiber.base.fiber = fiber;
    }
    if (fiber.parent) {
      const childpatches = fiber.patches || [];
      const thisEffect = fiber.patchTag != null ? [fiber] : [];
      const parentpatches = fiber.parent.patches || [];
      fiber.parent.patches = parentpatches.concat(childpatches, thisEffect);
    } else {
      pendingCommit = fiber;
    }
  }
  function commitAllWork (WIP) {
    WIP.patches.forEach(f => commitWork(f));
    commitEffects(currentInstance.effects);
    WIP.base.rootFiber = WIP;
    nextWork = null;
    pendingCommit = null;
  }
  function commitWork (fiber) {
    if (fiber.tag == ROOT) return
    let parentFiber = fiber.parent;
    while (parentFiber.tag == HOOK) {
      parentFiber = parentFiber.parent;
    }
    const parentNode = parentFiber.base;
    if (fiber.patchTag == PLACE && fiber.tag == HOST) {
      parentNode.appendChild(fiber.base);
    } else if (fiber.patchTag == UPDATE && fiber.tag == HOST) {
      updateProperties(fiber.base, fiber.alternate.props, fiber.props);
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
  function getRoot (fiber) {
    let node = fiber;
    while (node.parent) {
      node = node.parent;
    }
    return node
  }
  function getCurrentInstance () {
    return currentInstance || null
  }
  function commitEffects (effects) {
    Object.keys(effects).forEach(key => {
      let effect = effects[key];
      effect();
    });
  }

  exports.h = h;
  exports.render = render;
  exports.useState = useState;
  exports.useReducer = useReducer;
  exports.useEffect = useEffect;
  exports.useMemo = useMemo;

  Object.defineProperty(exports, '__esModule', { value: true });

}));
