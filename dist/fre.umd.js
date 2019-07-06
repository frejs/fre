/**
 * by 132yse Copyright 2019-07-06
 */

(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = global || self, factory(global.fre = {}));
}(this, function (exports) { 'use strict';

  function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

  var arrayfy = function arrayfy(arr) {
    return !arr ? [] : Array.isArray(arr) ? arr : [arr];
  };
  var isSame = function isSame(a, b) {
    return a.type === b.type || _typeof(a.type) === _typeof(b.type);
  };
  var isNew = function isNew(o, n) {
    return function (k) {
      return k !== 'children' && k !== 'key' && o[k] !== n[k];
    };
  };
  function hashfy(arr) {
    var out = {};
    var i = 0;
    arrayfy(arr).forEach(function (item) {
      var key = ((item || {}).props || {}).key;
      key ? out['.' + key] = item : (out['.' + i] = item) && i++;
    });
    return out;
  }
  function merge(a, b) {
    var out = {}; // @ts-ignore

    for (var i in a) {
      out[i] = a[i];
    } // @ts-ignore


    for (var _i in b) {
      out[_i] = b[_i];
    }

    return out;
  }
  var defer = typeof Promise === 'function' ? function (cb) {
    return Promise.resolve().then(cb);
  } : setTimeout;

  function _typeof$1(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof$1 = function _typeof(obj) { return typeof obj; }; } else { _typeof$1 = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof$1(obj); }
  function h(type, props) {
    for (var _len = arguments.length, rest = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
      rest[_key - 2] = arguments[_key];
    }

    var children = [];
    var length = arguments.length;

    while (rest.length) {
      var vnode = rest.pop();

      if (vnode && Array.isArray(vnode)) {
        for (length = vnode.length; length--;) {
          rest.push(vnode[length]);
        }
      } else if (vnode === null || vnode === true || vnode === false) {
        // @ts-ignore
        vnode = {
          type: function type() {}
        };
      } else if (typeof vnode === 'function') {
        children = vnode;
      } else {
        children.push(_typeof$1(vnode) === 'object' ? vnode : {
          type: 'text',
          props: {
            nodeValue: vnode
          }
        });
      }
    }

    return {
      type: type,
      props: merge(props, {
        children: children
      }),
      key: props && props.key
    };
  }

  function updateProperty(element, name, value, newValue) {
    if (name === 'style') {
      for (key in newValue) {
        var style = !newValue || !newValue[key] ? '' : newValue[key];
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
  function updateElement(element, props, newProps) {
    Object.keys(newProps).filter(isNew(props, newProps))
    .forEach(function (key) {
      if (key === 'value' || key === 'nodeValue') {
        element[key] = newProps[key];
      } else {
        updateProperty(element, key, props[key], newProps[key]);
      }
    });
  }
  function createElement(fiber) {
    var element = fiber.type === 'text' ? document.createTextNode('') : document.createElement(fiber.type);
    updateElement(element, [], fiber.props);
    return element;
  }

  function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }
  function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }
  function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }
  function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }
  var cursor = 0;
  function update(key, reducer, value) {
    var current = this ? this : getCurrentFiber();
    value = reducer ? reducer(current.state[key], value) : value;
    current.state[key] = value;
    scheduleWork(current);
  }
  function resetCursor() {
    cursor = 0;
  }
  function useState(initState) {
    return useReducer(null, initState);
  }
  function useReducer(reducer, initState) {
    var current = getCurrentFiber();
    if (!current) return [initState, setter];
    var key = '$' + cursor;
    var setter = update.bind(current, key, reducer);
    cursor++;
    var state = current.state || {};
    if (key in state) {
      return [state[key], setter];
    } else {
      current.state[key] = initState;
      return [initState, setter];
    }
  }
  function useEffect(cb, inputs) {
    var current = getCurrentFiber();
    if (current) current.effect = useMemo(cb, inputs);
  }
  function useMemo(cb, inputs) {
    return function () {
      var current = getCurrentFiber();
      if (current) {
        var hasChaged = inputs ? (current.oldInputs || []).some(function (v, i) {
          return inputs[i] !== v;
        }) : true;
        if (inputs && !inputs.length && !current.isMounted) {
          hasChaged = true;
          current.isMounted = true;
        }
        if (hasChaged) cb();
        current.oldInputs = inputs;
      }
    };
  }
  function createContext() {
    var initContext = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var context = initContext;
    var setters = [];
    var update = function update(newContext) {
      return setters.forEach(function (fn) {
        return fn(newContext);
      });
    };
    var subscribe = function subscribe(fn) {
      return setters.push(fn);
    };
    var unSubscribe = function unSubscribe(fn) {
      return setters = setters.filter(function (f) {
        return f !== fn;
      });
    };
    return {
      context: context,
      update: update,
      subscribe: subscribe,
      unSubscribe: unSubscribe
    };
  }
  function useContext(ctx) {
    var _useState = useState(ctx.context),
        _useState2 = _slicedToArray(_useState, 2),
        context = _useState2[0],
        setContext = _useState2[1];
    ctx.subscribe(setContext);
    useEffect(function () {
      return ctx.unSubscribe(setContext);
    });
    return [context, ctx.update];
  }

  var HOST = 0,
      HOOK = 1,
      ROOT = 2,
      PLACE = 3,
      REPLACE = 4,
      UPDATE = 5,
      DELETE = 6;
  var options = {};
  var updateQueue = [];
  var nextWork = null;
  var pendingCommit = null;
  var currentFiber = null;
  function render(vnode, el) {
    var rootFiber = {
      tag: ROOT,
      base: el,
      props: {
        children: vnode
      }
    };
    scheduleWork(rootFiber);
  }
  function scheduleWork(fiber) {
    updateQueue.push(fiber);
    defer(workLoop);
  }
  function workLoop() {
    if (!nextWork && updateQueue.length) {
      var update = updateQueue.shift();
      if (!update) return;
      nextWork = update;
    }
    while (nextWork) {
      nextWork = performWork(nextWork);
    }
    if (pendingCommit) {
      options.commitWork ? options.commitWork(pendingCommit) : commitWork(pendingCommit);
    }
  }
  function performWork(WIP) {
    WIP.tag == HOOK ? updateHOOK(WIP) : updateHost(WIP);
    if (WIP.child) return WIP.child;
    while (WIP) {
      completeWork(WIP);
      if (WIP.sibling) return WIP.sibling;
      WIP = WIP.parent;
    }
  }
  function updateHost(WIP) {
    if (!options.end && !WIP.base) {
      WIP.base = createElement(WIP);
    }
    var parent = WIP.parent || {};
    WIP.insertPoint = parent.oldPoint;
    parent.oldPoint = WIP;
    var children = WIP.props.children;
    reconcileChildren(WIP, children);
  }
  function updateHOOK(WIP) {
    WIP.props = WIP.props || {};
    WIP.state = WIP.state || {};
    currentFiber = WIP;
    resetCursor();
    var children = WIP.type(WIP.props);
    reconcileChildren(WIP, children);
    currentFiber.patches = WIP.patches;
  }
  function fiberize(children, WIP) {
    return WIP.children = hashfy(children);
  }
  function reconcileChildren(WIP, children) {
    var oldFibers = WIP.children;
    var newFibers = fiberize(children, WIP);
    var reused = {};
    for (var k in oldFibers) {
      var newFiber = newFibers[k];
      var oldFiber = oldFibers[k];
      if (newFiber && isSame(newFiber, oldFiber)) {
        reused[k] = oldFiber;
      } else {
        oldFiber.patchTag = DELETE;
        WIP.patches.push(oldFiber);
      }
    }
    var prevFiber = null;
    var alternate = null;
    for (var _k in newFibers) {
      var _newFiber = newFibers[_k];
      var _oldFiber = reused[_k];
      if (_oldFiber) {
        if (isSame(_oldFiber, _newFiber)) {
          alternate = createFiber(_oldFiber, {
            patchTag: UPDATE
          });
          if (!options.end) _newFiber.patchTag = UPDATE;
          _newFiber = merge(alternate, _newFiber);
          _newFiber.alternate = alternate;
          if (_oldFiber.key) {
            _newFiber.patchTag = REPLACE;
          }
        }
      } else {
        _newFiber = createFiber(_newFiber, {
          patchTag: PLACE
        });
      }
      newFibers[_k] = _newFiber;
      _newFiber.parent = WIP;
      if (prevFiber) {
        prevFiber.sibling = _newFiber;
      } else {
        WIP.child = _newFiber;
      }
      prevFiber = _newFiber;
    }
    if (prevFiber) prevFiber.sibling = null;
  }
  function createFiber(vnode, data) {
    data.tag = typeof vnode.type === 'function' ? HOOK : HOST;
    vnode.props = vnode.props || {
      nodeValue: vnode.nodeValue
    };
    return merge(vnode, data);
  }
  function completeWork(fiber) {
    if (!options.end && fiber.parent) {
      fiber.parent.patches = (fiber.parent.patches || []).concat(fiber.patches || [], fiber.patchTag ? [fiber] : []);
    } else {
      pendingCommit = fiber;
    }
  }
  function commitWork(WIP) {
    WIP.patches.forEach(function (p) {
      return commit(p);
    });
    currentFiber.effect && currentFiber.effect();
    nextWork = pendingCommit = null;
  }
  function commit(fiber) {
    var parentFiber = fiber.parent;
    while (parentFiber.tag == HOOK) {
      parentFiber = parentFiber.parent;
    }
    var parent = parentFiber.base;
    var dom = fiber.base || fiber.child.base;
    var insertPoint = fiber.insertPoint,
        patchTag = fiber.patchTag;
    if (fiber.tag == HOOK) {
      if (patchTag == DELETE) parent.removeChild(dom);
    } else if (patchTag == UPDATE) {
      updateElement(dom, fiber.alternate.props, fiber.props);
    } else if (patchTag == DELETE) {
      parent.removeChild(dom);
    } else {
      var after = insertPoint ? patchTag == PLACE ? insertPoint.base.nextSibling : insertPoint.base.nextSibling || parent.firstChild : null;
      if (after == dom) return;
      parent.insertBefore(dom, after);
    }
    parentFiber.patches = fiber.patches = [];
  }
  function getCurrentFiber() {
    return currentFiber || null;
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
