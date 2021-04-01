// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"../src/dom.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createElement = exports.updateElement = void 0;

var _reconciler = require("./reconciler");

var updateElement = function updateElement(dom, oldProps, newProps) {
  for (var name in Object.assign(Object.assign({}, oldProps), newProps)) {
    var oldValue = oldProps[name];
    var newValue = newProps[name];

    if (oldValue === newValue || name === "children") {} else if (name === "style") {
      if ((0, _reconciler.isStr)(newValue)) {
        dom.setAttribute(name, newValue);
      } else {
        for (var k in Object.assign(Object.assign({}, oldValue), newValue)) {
          if (!(oldValue && newValue && oldValue[k] === newValue[k])) {
            ;
            dom[name][k] = (newValue === null || newValue === void 0 ? void 0 : newValue[k]) || "";
          }
        }
      }
    } else if (name[0] === "o" && name[1] === "n") {
      name = name.slice(2).toLowerCase();
      if (oldValue) dom.removeEventListener(name, oldValue);
      dom.addEventListener(name, newValue);
    } else if (name in dom && !(dom instanceof SVGElement)) {
      ;
      dom[name] = newValue || "";
    } else if (newValue == null || newValue === false) {
      dom.removeAttribute(name);
    } else {
      dom.setAttribute(name, newValue);
    }
  }
};

exports.updateElement = updateElement;

var createElement = function createElement(fiber) {
  var dom = fiber.type === "text" ? document.createTextNode("") : fiber.lane & _reconciler.LANE.SVG ? document.createElementNS("http://www.w3.org/2000/svg", fiber.type) : document.createElement(fiber.type);
  updateElement(dom, {}, fiber.props);
  return dom;
};

exports.createElement = createElement;
},{"./reconciler":"../src/reconciler.ts"}],"../src/hooks.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isChanged = exports.getHook = exports.useRef = exports.useCallback = exports.useMemo = exports.useLayout = exports.useEffect = exports.useReducer = exports.useState = exports.resetCursor = void 0;

var _reconciler = require("./reconciler");

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var cursor = 0;

var resetCursor = function resetCursor() {
  cursor = 0;
};

exports.resetCursor = resetCursor;

var useState = function useState(initState) {
  return useReducer(null, initState);
};

exports.useState = useState;

var useReducer = function useReducer(reducer, initState) {
  var _getHook = getHook(cursor++),
      _getHook2 = _slicedToArray(_getHook, 2),
      hook = _getHook2[0],
      current = _getHook2[1];

  return [hook.length === 0 ? hook[0] = initState : hook[0], function (value) {
    hook[0] = reducer ? reducer(hook[0], value) : (0, _reconciler.isFn)(value) ? value(hook[0]) : value;
    (0, _reconciler.dispatchUpdate)(current);
  }];
};

exports.useReducer = useReducer;

var useEffect = function useEffect(cb, deps) {
  return effectImpl(cb, deps, "effect");
};

exports.useEffect = useEffect;

var useLayout = function useLayout(cb, deps) {
  return effectImpl(cb, deps, "layout");
};

exports.useLayout = useLayout;

var effectImpl = function effectImpl(cb, deps, key) {
  var _getHook3 = getHook(cursor++),
      _getHook4 = _slicedToArray(_getHook3, 2),
      hook = _getHook4[0],
      current = _getHook4[1];

  if (isChanged(hook[1], deps)) {
    hook[0] = cb;
    hook[1] = deps;
    current.hooks[key].push(hook);
  }
};

var useMemo = function useMemo(cb, deps) {
  var hook = getHook(cursor++)[0];

  if (isChanged(hook[1], deps)) {
    hook[1] = deps;
    return hook[0] = cb();
  }

  return hook[0];
};

exports.useMemo = useMemo;

var useCallback = function useCallback(cb, deps) {
  return useMemo(function () {
    return cb;
  }, deps);
};

exports.useCallback = useCallback;

var useRef = function useRef(current) {
  return useMemo(function () {
    return {
      current: current
    };
  }, []);
};

exports.useRef = useRef;

var getHook = function getHook(cursor) {
  var current = (0, _reconciler.getCurrentFiber)();
  var hooks = current.hooks || (current.hooks = {
    list: [],
    effect: [],
    layout: []
  });

  if (cursor >= hooks.list.length) {
    hooks.list.push([]);
  }

  return [hooks.list[cursor], current];
};

exports.getHook = getHook;

var isChanged = function isChanged(a, b) {
  return !a || a.length !== b.length || b.some(function (arg, index) {
    return arg !== a[index];
  });
};

exports.isChanged = isChanged;
},{"./reconciler":"../src/reconciler.ts"}],"../src/scheduler.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getTime = exports.shouldYield = exports.scheduleWork = exports.schedule = void 0;
var queue = [];
var threshold = 1000 / 60;
var unit = [];
var deadline = 0;

var schedule = function schedule(cb) {
  return unit.push(cb) === 1 && postMessage();
};

exports.schedule = schedule;

var scheduleWork = function scheduleWork(callback, fiber) {
  var job = {
    callback: callback,
    fiber: fiber
  };
  queue.push(job);
  schedule(flushWork);
};

exports.scheduleWork = scheduleWork;

var postMessage = function () {
  var cb = function cb() {
    return unit.splice(0, unit.length).forEach(function (c) {
      return c();
    });
  };

  if (typeof MessageChannel !== "undefined") {
    var _MessageChannel = new MessageChannel(),
        port1 = _MessageChannel.port1,
        port2 = _MessageChannel.port2;

    port1.onmessage = cb;
    return function () {
      return port2.postMessage(null);
    };
  }

  return function () {
    return setTimeout(cb);
  };
}();

var flushWork = function flushWork() {
  deadline = getTime() + threshold;
  var job = peek(queue);

  while (job && !shouldYield()) {
    var _job = job,
        callback = _job.callback,
        fiber = _job.fiber;
    job.callback = null;
    var next = callback(fiber);

    if (next) {
      job.callback = next;
    } else {
      queue.shift();
    }

    job = peek(queue);
  }

  job && schedule(flushWork);
};

var shouldYield = function shouldYield() {
  var _a, _b;

  return ((_b = (_a = navigator) === null || _a === void 0 ? void 0 : _a.scheduling) === null || _b === void 0 ? void 0 : _b.isInputPending()) || getTime() >= deadline;
};

exports.shouldYield = shouldYield;

var getTime = function getTime() {
  return performance.now();
};

exports.getTime = getTime;

var peek = function peek(queue) {
  return queue[0];
};
},{}],"../src/reconciler.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.some = exports.isStr = exports.isFn = exports.getCurrentFiber = exports.dispatchUpdate = exports.render = exports.LANE = void 0;

var _dom = require("./dom");

var _hooks = require("./hooks");

var _scheduler = require("./scheduler");

var _h = require("./h");

var currentFiber;
var finish = null;
var deletes = [];
var LANE;
exports.LANE = LANE;

(function (LANE) {
  LANE[LANE["UPDATE"] = 2] = "UPDATE";
  LANE[LANE["INSERT"] = 4] = "INSERT";
  LANE[LANE["REMOVE"] = 8] = "REMOVE";
  LANE[LANE["SVG"] = 16] = "SVG";
  LANE[LANE["DIRTY"] = 32] = "DIRTY";
})(LANE || (exports.LANE = LANE = {}));

var render = function render(vnode, node, done) {
  var rootFiber = {
    node: node,
    props: {
      children: vnode
    },
    done: done
  };
  dispatchUpdate(rootFiber);
};

exports.render = render;

var dispatchUpdate = function dispatchUpdate(fiber) {
  if (fiber && !(fiber.lane & LANE.DIRTY)) {
    fiber.lane = LANE.UPDATE | LANE.DIRTY;
    fiber.sibling = null;
    (0, _scheduler.scheduleWork)(reconcileWork, fiber);
  }
};

exports.dispatchUpdate = dispatchUpdate;

var reconcileWork = function reconcileWork(WIP) {
  while (WIP && !(0, _scheduler.shouldYield)()) {
    WIP = reconcile(WIP);
  }

  if (WIP) return reconcileWork.bind(null, WIP);
  if (finish) commitWork(finish);
  return null;
};

var reconcile = function reconcile(WIP) {
  isFn(WIP.type) ? updateHook(WIP) : updateHost(WIP);
  if (WIP.child) return WIP.child;

  while (WIP) {
    if (!finish && WIP.lane & LANE.DIRTY) {
      finish = WIP;
      WIP.lane &= ~LANE.DIRTY;
      return null;
    }

    if (WIP.sibling) return WIP.sibling;
    WIP = WIP.parent;
  }
};

var updateHook = function updateHook(WIP) {
  currentFiber = WIP;
  (0, _hooks.resetCursor)();

  try {
    var children = WIP.type(WIP.props);
  } catch (e) {
    if (!!e && typeof e.then === "function") {
      var p = getParent(WIP);

      if (!p.laziness) {
        p.laziness = [];
        children = p.props.fallback;
      }

      p.laziness.push(e);
    } else throw e;
  }

  isStr(children) && (children = (0, _h.createText)(children));
  reconcileChildren(WIP, children);
};

var getParentNode = function getParentNode(WIP) {
  while (WIP = WIP.parent) {
    if (!isFn(WIP.type)) return WIP.node;
  }
};

var getParent = function getParent(WIP) {
  while (WIP = WIP.parent) {
    if (WIP.type.name === "Suspense") return WIP;
  }
};

var updateHost = function updateHost(WIP) {
  WIP.parentNode = getParentNode(WIP);

  if (!WIP.node) {
    if (WIP.type === "svg") WIP.lane |= LANE.SVG;
    WIP.node = (0, _dom.createElement)(WIP);
  }

  reconcileChildren(WIP, WIP.props.children);
};

var reconcileChildren = function reconcileChildren(WIP, children) {
  var _a;

  var aCh = WIP.kids || [],
      bCh = WIP.kids = arrayfy(children),
      aHead = 0,
      bHead = 0,
      aTail = aCh.length - 1,
      bTail = bCh.length - 1,
      map = null,
      ch = Array(bCh.length),
      next = ((_a = WIP.sibling) === null || _a === void 0 ? void 0 : _a.node) ? WIP.sibling : null;

  while (aHead <= aTail && bHead <= bTail) {
    var c = null;

    if (aCh[aHead] == null) {
      aHead++;
    } else if (aCh[aTail] == null) {
      aTail--;
    } else if (same(aCh[aHead], bCh[bHead])) {
      c = bCh[bHead];
      clone(c, aCh[aHead]);
      c.lane = LANE.UPDATE;
      ch[bHead] = c;
      aHead++;
      bHead++;
    } else if (same(aCh[aTail], bCh[bTail])) {
      c = bCh[bTail];
      clone(c, aCh[aTail]);
      c.lane = LANE.UPDATE;
      ch[bTail] = c;
      aTail--;
      bTail--;
    } else {
      if (!map) {
        map = new Map();

        for (var _i = aHead; _i <= aTail; _i++) {
          var k = getKey(aCh[_i]);
          k && map.set(k, _i);
        }
      }

      var key = getKey(bCh[bHead]);

      if (map.has(key)) {
        var oldKid = aCh[map.get(key)];
        c = bCh[bHead];
        clone(c, oldKid);
        c.lane = LANE.INSERT;
        c.after = aCh[aHead];
        ch[bHead] = c;
        aCh[map.get(key)] = null;
      } else {
        c = bCh[bHead];
        c.lane = LANE.INSERT;
        c.node = null;
        c.after = aCh[aHead];
      }

      bHead++;
    }
  }

  var after = bTail <= bCh.length - 1 ? ch[bTail + 1] : next;

  while (bHead <= bTail) {
    var _c = bCh[bHead];

    if (_c) {
      _c.lane = LANE.INSERT;
      _c.after = after;
      _c.node = null;
    }

    bHead++;
  }

  while (aHead <= aTail) {
    var _c2 = aCh[aHead];

    if (_c2) {
      _c2.lane = LANE.REMOVE;
      deletes.push(_c2);
    }

    aHead++;
  }

  for (var i = 0, prev = null; i < bCh.length; i++) {
    var child = bCh[i];
    if (child == null) continue;
    child.parent = WIP;

    if (i > 0) {
      prev.sibling = child;
    } else {
      if (WIP.lane & LANE.SVG) child.lane |= LANE.SVG;
      WIP.child = child;
    }

    prev = child;
  }
};

function clone(a, b) {
  a.lastProps = b.props;
  a.node = b.node;
  a.kids = b.kids;
  a.hooks = b.hooks;
  a.ref = b.ref;
}

var getKey = function getKey(vdom) {
  return vdom == null ? vdom : vdom.key;
};

var getType = function getType(vdom) {
  return isFn(vdom.type) ? vdom.type.name : vdom.type;
};

var commitWork = function commitWork(fiber) {
  var _a;

  fiber.parent ? commit(fiber) : commit(fiber.child);
  deletes.forEach(commit);
  (_a = fiber.done) === null || _a === void 0 ? void 0 : _a.call(fiber);
  deletes = [];
  finish = null;
};

function invokeHooks(fiber) {
  var hooks = fiber.hooks,
      lane = fiber.lane,
      laziness = fiber.laziness;

  if (laziness) {
    Promise.all(laziness).then(function () {
      fiber.laziness = null;
      dispatchUpdate(fiber);
    });
  }

  if (hooks) {
    if (lane & LANE.REMOVE) {
      hooks.list.forEach(function (e) {
        return e[2] && e[2]();
      });
    } else {
      side(hooks.layout);
      (0, _scheduler.schedule)(function () {
        return side(hooks.effect);
      });
    }
  }
}

function wireKid(fiber) {
  var kid = fiber;

  while (isFn(kid.type) && kid.child) {
    kid = kid.child;
  }

  var after = fiber.after || kid.after;
  kid.after = after;
  kid.lane |= fiber.lane;
  var s = kid.sibling;

  while (s) {
    s.after = after;
    s.lane |= fiber.lane;
    s = s.sibling;
  }

  return kid;
}

var commit = function commit(fiber) {
  var _a;

  if (!fiber) return;
  var type = fiber.type,
      lane = fiber.lane,
      parentNode = fiber.parentNode,
      node = fiber.node,
      ref = fiber.ref;

  if (isFn(type)) {
    invokeHooks(fiber);
    var kid = wireKid(fiber);
    fiber.node = kid.node;

    if (fiber.lane & LANE.REMOVE) {
      commit(kid);
    } else {
      commit(fiber.child);
      commit(fiber.sibling);
    }

    fiber.lane = 0;
    return;
  }

  if (lane & LANE.REMOVE) {
    kidsRefer(fiber.kids);
    parentNode.removeChild(fiber.node);
    refer(ref, null);
    fiber.lane = 0;
    return;
  }

  if (lane & LANE.UPDATE) {
    (0, _dom.updateElement)(node, fiber.lastProps || {}, fiber.props);
  }

  if (lane & LANE.INSERT) {
    parentNode.insertBefore(fiber.node, (_a = fiber.after) === null || _a === void 0 ? void 0 : _a.node);
  }

  fiber.lane = 0;
  refer(ref, node);
  commit(fiber.child);
  commit(fiber.sibling);
};

var same = function same(a, b) {
  return getKey(a) === getKey(b) && getType(a) === getType(b);
};

var arrayfy = function arrayfy(arr) {
  return !arr ? [] : (0, _h.isArr)(arr) ? arr : [arr];
};

var refer = function refer(ref, dom) {
  if (ref) isFn(ref) ? ref(dom) : ref.current = dom;
};

var kidsRefer = function kidsRefer(kids) {
  kids.forEach(function (kid) {
    kid.kids && kidsRefer(kid.kids);
    refer(kid.ref, null);
  });
};

var side = function side(effects) {
  effects.forEach(function (e) {
    return e[2] && e[2]();
  });
  effects.forEach(function (e) {
    return e[2] = e[0]();
  });
  effects.length = 0;
};

var getCurrentFiber = function getCurrentFiber() {
  return currentFiber || null;
};

exports.getCurrentFiber = getCurrentFiber;

var isFn = function isFn(x) {
  return typeof x === "function";
};

exports.isFn = isFn;

var isStr = function isStr(s) {
  return typeof s === "number" || typeof s === "string";
};

exports.isStr = isStr;

var some = function some(v) {
  return v != null && v !== false && v !== true;
};

exports.some = some;
},{"./dom":"../src/dom.ts","./hooks":"../src/hooks.ts","./scheduler":"../src/scheduler.ts","./h":"../src/h.ts"}],"../src/h.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createText = createText;
exports.Fragment = Fragment;
exports.isArr = exports.h = void 0;

var _reconciler = require("./reconciler");

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

var h = function h(type, attrs) {
  var props = attrs || {};
  var key = props.key || null;
  var ref = props.ref || null;
  var children = props.children || [];
  var simple = '';
  var len = arguments.length;

  for (var i = 2; i < len; i++) {
    var child = arguments[i];
    var end = i === len - 1;
    var vnode = (0, _reconciler.some)(child) ? child : '';
    var str = (0, _reconciler.isStr)(vnode);
    if (str) simple += String(vnode);

    if (simple && (!str || end)) {
      children.push(createText(simple));
      simple = '';
    }

    if (!str) children.push(vnode);
  }

  while (children.some(function (v) {
    return isArr(v);
  })) {
    var _ref;

    children = (_ref = []).concat.apply(_ref, _toConsumableArray(children));
  }

  if (children.length) {
    props.children = children.length === 1 ? children[0] : children;
  }

  delete props.key;
  delete props.ref;
  return {
    type: type,
    props: props,
    key: key,
    ref: ref
  };
};

exports.h = h;

function createText(vnode) {
  return {
    type: 'text',
    props: {
      nodeValue: vnode
    }
  };
}

function Fragment(props) {
  return props.children;
}

var isArr = Array.isArray;
exports.isArr = isArr;
},{"./reconciler":"../src/reconciler.ts"}],"../src/suspense.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.lazy = lazy;
exports.Suspense = Suspense;

var _h = require("./h");

function lazy(loader) {
  var p;
  var comp;
  var err;
  return function Lazy(props) {
    if (!p) {
      p = loader();
      p.then(function (exports) {
        return comp = exports.default || exports;
      }, function (e) {
        return err = e;
      });
    }

    if (err) throw err;
    if (!comp) throw p;
    return (0, _h.h)(comp, props);
  };
}

function Suspense(props) {
  return props.children;
}
},{"./h":"../src/h.ts"}],"../src/type.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
},{}],"../src/index.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _exportNames = {
  h: true,
  Fragment: true,
  createElement: true,
  render: true,
  useState: true,
  useReducer: true,
  useEffect: true,
  useMemo: true,
  useCallback: true,
  useRef: true,
  useLayout: true,
  useLayoutEffect: true,
  shouldYield: true,
  lazy: true,
  Suspense: true
};
Object.defineProperty(exports, "h", {
  enumerable: true,
  get: function () {
    return _h.h;
  }
});
Object.defineProperty(exports, "Fragment", {
  enumerable: true,
  get: function () {
    return _h.Fragment;
  }
});
Object.defineProperty(exports, "createElement", {
  enumerable: true,
  get: function () {
    return _h.h;
  }
});
Object.defineProperty(exports, "render", {
  enumerable: true,
  get: function () {
    return _reconciler.render;
  }
});
Object.defineProperty(exports, "useState", {
  enumerable: true,
  get: function () {
    return _hooks.useState;
  }
});
Object.defineProperty(exports, "useReducer", {
  enumerable: true,
  get: function () {
    return _hooks.useReducer;
  }
});
Object.defineProperty(exports, "useEffect", {
  enumerable: true,
  get: function () {
    return _hooks.useEffect;
  }
});
Object.defineProperty(exports, "useMemo", {
  enumerable: true,
  get: function () {
    return _hooks.useMemo;
  }
});
Object.defineProperty(exports, "useCallback", {
  enumerable: true,
  get: function () {
    return _hooks.useCallback;
  }
});
Object.defineProperty(exports, "useRef", {
  enumerable: true,
  get: function () {
    return _hooks.useRef;
  }
});
Object.defineProperty(exports, "useLayout", {
  enumerable: true,
  get: function () {
    return _hooks.useLayout;
  }
});
Object.defineProperty(exports, "useLayoutEffect", {
  enumerable: true,
  get: function () {
    return _hooks.useLayout;
  }
});
Object.defineProperty(exports, "shouldYield", {
  enumerable: true,
  get: function () {
    return _scheduler.shouldYield;
  }
});
Object.defineProperty(exports, "lazy", {
  enumerable: true,
  get: function () {
    return _suspense.lazy;
  }
});
Object.defineProperty(exports, "Suspense", {
  enumerable: true,
  get: function () {
    return _suspense.Suspense;
  }
});

var _h = require("./h");

var _reconciler = require("./reconciler");

var _hooks = require("./hooks");

var _scheduler = require("./scheduler");

var _suspense = require("./suspense");

var _type = require("./type");

Object.keys(_type).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _type[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _type[key];
    }
  });
});
},{"./h":"../src/h.ts","./reconciler":"../src/reconciler.ts","./hooks":"../src/hooks.ts","./scheduler":"../src/scheduler.ts","./suspense":"../src/suspense.ts","./type":"../src/type.ts"}],"src/ref.tsx":[function(require,module,exports) {
"use strict";
/** @jsx h */

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

Object.defineProperty(exports, "__esModule", {
  value: true
}); // // preact:
// import { render, createElement as h } from "preact/compat";
// import { useState, useEffect } from "preact/hooks";
// react:
// import { createElement as h, useState, useEffect } from "react";
// import { render } from "react-dom";
// // fre:

var src_1 = require("../../src");

var Wrapper = function Wrapper() {
  var _src_1$useState = src_1.useState(true),
      _src_1$useState2 = _slicedToArray(_src_1$useState, 2),
      showApp = _src_1$useState2[0],
      setShowApp = _src_1$useState2[1];

  src_1.useEffect(function () {
    setTimeout(function () {
      setShowApp(false);
    }, 2000);
  }, []);

  var p = function p(dom) {
    if (dom) {
      console.log(dom);
    } else {
      console.log(111);
    }
  };

  var c = function c(dom) {
    if (dom) {
      console.log(dom);
    } else {
      console.log(222);
    }
  };

  return src_1.h("div", null, showApp ? src_1.h("div", {
    ref: p
  }, "111") : src_1.h("div", {
    ref: c
  }, "App removed..."));
};

src_1.render(src_1.h(Wrapper, null), document.getElementById("root"));
},{"../../src":"../src/index.ts"}],"node_modules/parcel/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "65254" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["node_modules/parcel/src/builtins/hmr-runtime.js","src/ref.tsx"], null)
//# sourceMappingURL=/ref.b1c74c00.js.map