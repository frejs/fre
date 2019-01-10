// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles

// eslint-disable-next-line no-global-assign
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

  for (var i = 0; i < entry.length; i++) {
    newRequire(entry[i]);
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
  return newRequire;
})({"../../packages/hooks/index.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.use = use;
exports.useState = useState;

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

var buckets = new WeakMap();
var currentBucket = [];

function use() {
  for (var _len = arguments.length, fns = new Array(_len), _key = 0; _key < _len; _key++) {
    fns[_key] = arguments[_key];
  }

  fns = fns.map(function (fn) {
    return function hook() {
      if (buckets.has(hook)) {
        var bucket = buckets.get(hook);
        bucket.cursor = 0;
      }

      currentBucket.push(hook);

      for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        args[_key2] = arguments[_key2];
      }

      return fn.apply(this, args);
    };
  });
  if (fns.length < 2) return fns[0];
  return fns;
}

function useState(state) {
  if (currentBucket.length > 0) {
    var hook = currentBucket[currentBucket.length - 1];
    var bucket;

    if (!buckets.has(hook)) {
      bucket = {
        cursor: 0,
        slots: []
      };
      buckets.set(hook, bucket);
    }

    bucket = buckets.get(hook);

    if (!(bucket.cursor in bucket.slots)) {
      var slot = [typeof state == 'function' ? state() : state, function (v) {
        return slot[0] = v;
      }];
      bucket.slots[bucket.cursor] = slot;
    }

    return _toConsumableArray(bucket.slots[bucket.cursor++]);
  } else {
    throw new Error('Only use useState() inside of use-wrapped functions.');
  }
}
},{}],"../../packages/core/h.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.h = h;

function h(type, props) {
  for (var _len = arguments.length, children = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
    children[_key - 2] = arguments[_key];
  }

  return {
    type: type,
    props: props,
    key: props.key || null,
    children: children
  };
}
},{}],"../../packages/core/patch.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.patch = patch;
exports.create = create;

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function patch(parent, element, oldVnode, vnode) {
  if (oldVnode == vnode) {} else if (oldVnode == null) {
    element = parent.insertBefore(create(vnode), element);
  } else if (vnode.type && vnode.type === oldVnode.type) {
    if (typeof vnode.type === 'function') {
      vnode = vnode.type(vnode.props);
      oldVnode = oldVnode.type(oldVnode.props);
      patch(parent, element, oldVnode, vnode);
    }

    update(element, oldVnode.props, vnode.props);
    var reusableChildren = {};
    var oldElements = [];
    var newKeys = {};
    oldVnode.children.forEach(function (oldChild, index) {
      var oldElement = element.childNodes[index];
      oldElements[index] = oldElement;
      var oldKey = oldChild.props ? oldChild.props.key : null;

      if (null != oldKey) {
        reusableChildren[oldKey] = [oldElement, oldChild];
      }
    });
    var i = 0;
    var j = 0;

    while (j < vnode.children.length) {
      var oldElement = oldElements[i];
      var oldChild = oldVnode.children[i];
      var newChild = vnode.children[j];
      var oldKey = oldChild.props ? oldChild.props.key : null;
      var newKey = newChild.props ? newChild.props.key : null;

      var _reusableChild = reusableChildren[newKey] || [];

      if (null == newKey) {
        if (null == oldKey) {
          patch(element, oldElement, oldChild, newChild);
          j++;
        }

        i++;
      } else {
        if (oldKey === newKey) {
          patch(element, _reusableChild[0], _reusableChild[1], newChild);
          i++;
        } else if (_reusableChild[0]) {
          element.insertBefore(_reusableChild[0], oldElement);
          patch(element, _reusableChild[0], _reusableChild[1], newChild);
        } else {
          patch(element, oldElement, null, newChild);
        }

        j++;
        newKeys[newKey] = newChild;
      }
    }

    while (i < oldVnode.children.length) {
      var _oldChild = oldVnode.children[i];

      var _oldKey = _oldChild.props ? _oldChild.props.key : null;

      if (null == _oldKey) {
        element.removeChild(reusableChild[0]);
      }

      i++;
    }

    for (var _i in reusableChildren) {
      var _reusableChild2 = reusableChildren[_i];
      var reusableNode = _reusableChild2[1];

      if (!newKeys[reusableNode.props.key]) {
        element.removeChild(_reusableChild2[0]);
      }
    }
  } else if (oldVnode !== vnode) {
    var _i2 = element;
    parent.replaceChild(element = create(vnode), _i2);
  }

  return element;
}

function create(vnode) {
  if (typeof vnode.type === 'function') {
    var _vnode;

    vnode = (_vnode = vnode).type.apply(_vnode, [vnode.props].concat(_toConsumableArray(vnode.children)));
  }

  var element = typeof vnode === 'string' || typeof vnode === 'number' ? document.createTextNode(vnode) : document.createElement(vnode.type);

  if (vnode.props) {
    vnode.children.forEach(function (child) {
      element.appendChild(create(child));
    });

    for (var name in vnode.props) {
      setAttrs(element, name, vnode.props[name]);
    }
  }

  return element;
}

function update(element, oldProps, props) {
  var cloneProps = _objectSpread({}, oldProps, props);

  for (var name in cloneProps) {
    setAttrs(element, name, cloneProps[name]);
  }
}

function setAttrs(node, name, value) {
  switch (name) {
    case String(name.match(/on\w+/)):
      name = name.toLowerCase();
      node[name] = value || '';
      break;

    case 'className':
      name === 'class';
      break;

    case 'key':
      break;

    case 'value':
      if (node.tagName.toUpperCase() === 'INPUT' || node.tagName.toUpperCase() === 'TEXTAREA') {
        node.value = value;
      } else {
        node.setAttribute(name, value);
      }

      break;

    case 'style':
      node.style.cssText = value;
      break;

    default:
      node.setAttribute(name, value);
  }
}
},{}],"../../packages/core/render.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.render = render;
exports.rerender = rerender;

var _patch = require("./patch");

var parent, element, oldVnode, vnode, root, lock;

function render(vdom, el) {
  root = vdom;
  parent = el;
  vnode = vdom.type();
  rerender();
}

function rerender() {
  vnode = root.type(root.props);

  if (!lock) {
    lock = true;
    setTimeout(function () {
      lock = !lock;
      element = (0, _patch.patch)(parent, element, oldVnode, oldVnode = vnode);
    });
  }
}
},{"./patch":"../../packages/core/patch.js"}],"../../packages/core/index.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "useState", {
  enumerable: true,
  get: function () {
    return _hooks.useState;
  }
});
Object.defineProperty(exports, "h", {
  enumerable: true,
  get: function () {
    return _h.h;
  }
});
Object.defineProperty(exports, "render", {
  enumerable: true,
  get: function () {
    return _render.render;
  }
});

var _hooks = require("../hooks");

var _h = require("./h");

var _render = require("./render");
},{"../hooks":"../../packages/hooks/index.js","./h":"../../packages/core/h.js","./render":"../../packages/core/render.js"}],"index.js":[function(require,module,exports) {
"use strict";

var _core = require("../../packages/core");

console.log('111');
},{"../../packages/core":"../../packages/core/index.js"}],"C:/Users/admin/AppData/Local/Yarn/Data/global/node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
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
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "50806" + '/');

  ws.onmessage = function (event) {
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      console.clear();
      data.assets.forEach(function (asset) {
        hmrApply(global.parcelRequire, asset);
      });
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          hmrAccept(global.parcelRequire, asset.id);
        }
      });
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

function hmrAccept(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAccept(bundle.parent, id);
  }

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

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAccept(global.parcelRequire, id);
  });
}
},{}]},{},["C:/Users/admin/AppData/Local/Yarn/Data/global/node_modules/parcel-bundler/src/builtins/hmr-runtime.js","index.js"], null)
//# sourceMappingURL=/counter.e31bb0bc.map