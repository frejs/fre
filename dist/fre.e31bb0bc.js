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
})({"src/patch.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.patch = patch;
exports.create = create;
exports.comps = void 0;

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

//这个方法就是，第一次渲染的时候，parent 是根节点，然后 parent 就变成 element 了
var comps;
exports.comps = comps;

function patch(parent, element, oldNode, node) {
  console.log(element);

  if (oldNode == null) {
    exports.comps = comps = filterFn(node); //首次渲染，将node 的 dom 插到 body 下

    element = parent.insertBefore(create(node), element);
  } else if (node.tag && node.tag === oldNode.tag) {
    update(element, oldNode.data, node.data); //更新属性

    var reusableChildren = {}; //可以复用的孩子{key:[type,vnode]}

    var oldElements = []; //旧的真实元素

    var newKeys = {}; //新的vnode {key:vnode}

    for (var i = 0; i < oldNode.children.length; i++) {
      //循环旧的 vnode，这次循环主要是筛选出带key，可以复用的vnode，最终是{key:[type,vnode]}
      var oldElement = element.childNodes[i];
      oldElements[i] = oldElement;
      var oldChild = oldNode.children[i];
      var oldKey = oldChild.data ? oldChild.data.key : null;

      if (null != oldKey) {
        reusableChildren[oldKey] = [oldElement, oldChild];
      }
    }

    var i = 0;
    var j = 0;

    while (j < node.children.length) {
      //循环新的node的子节点，循环这个的目的
      var oldElement = oldElements[i]; //这个是一个个 旧的 node 真实节点

      var oldChild = oldNode.children[i]; //一个个旧的 vnode

      var newChild = node.children[j]; //一个个新的vnode

      var oldKey = oldChild.data ? oldChild.data.key : null;
      var newKey = newChild.data ? newChild.data.key : null;
      var reusableChild = reusableChildren[newKey] || [];

      if (null == newKey) {
        //这种是文字或者数字，直接下一个
        if (null == oldKey) {
          patch(element, oldElement, oldChild, newChild);
          j++;
        }

        i++;
      } else {
        if (oldKey === newKey) {
          //key相同的，如果新旧的key是相同的，就可以复用
          patch(element, reusableChild[0], reusableChild[1], newChild);
          i++;
        } else if (reusableChild[0]) {
          //如果key不同，就在前面插入这个element
          element.insertBefore(reusableChild[0], oldElement);
          patch(element, reusableChild[0], reusableChild[1], newChild);
        } else {
          patch(element, oldElement, null, newChild);
        }

        j++;
        newKeys[newKey] = newChild;
      }
    }

    while (i < oldNode.children.length) {
      //这个主要是用于删除的
      var oldChild = oldNode.children[i];
      var oldKey = oldChild.data ? oldChild.data.key : null;

      if (null == oldKey) {
        element.removeChild(reusableChild[0]);
      }

      i++;
    }

    for (var i in reusableChildren) {
      var reusableChild = reusableChildren[i];
      var reusableNode = reusableChild[1];

      if (!newKeys[reusableNode.data.key]) {
        element.removeChild(reusableChild[0]);
      }
    }
  } else if (node !== oldNode) {
    //然后会如果两个对象不同的话就直接替换
    var i = element;
    parent.replaceChild(element = create(node), i);
  }

  return element;
}

function create(vnode) {
  if (typeof vnode.type === 'function') {
    vnode = vnode.type(vnode.props);
  }

  var dom = document.createElement(vnode.type);

  for (var name in vnode.props) {
    setAttrs(dom, name, vnode.props[name]);
  }

  vnode.children.forEach(function (child) {
    child = _typeof(child) == 'object' ? create(child) : document.createTextNode(child);
    dom.appendChild(child);
  });
  return dom;
}

function update(dom, oldProps, props) {
  var cloneProps = _objectSpread({}, oldProps, props);

  for (var name in cloneProps) {
    setAttrs(dom, name, cloneProps[name]);
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

function filterFn(obj) {
  var fns = {};
  return walk(obj, fns);
}

function walk(obj, fns) {
  if (obj) {
    Object.keys(obj).forEach(function (i) {
      if (i === 'type') {
        var f = obj[i];

        if (typeof f === 'function') {
          fns[f.name] = obj;
        }
      } else if (i === 'children') {
        var arr = obj[i];
        arr.forEach(function (child) {
          walk(child, fns);
        });
      }
    });
  }

  return fns;
}
},{}],"src/render.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.render = render;
exports.rerender = rerender;

var _patch = require("./patch");

var parent;
var element;
var oldVnode = element;
var vnode;

function render(vdom, el) {
  parent = el;
  vnode = vdom;
  rerender();
}

function rerender() {
  setTimeout(function () {
    element = (0, _patch.patch)(parent, element, oldVnode, oldVnode = vnode);
  });
}
},{"./patch":"src/patch.js"}],"src/hooks.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useState = useState;

var _render = require("./render");

var _patch = require("./patch");

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var golbal = {};
var once = true;
var comp;

function useState(state) {
  if (Object.keys(golbal).length > 0) {
    state = _objectSpread({}, state, golbal);
  }

  if (once) {
    comp = _patch.comps[c()];
    once = false;
  }

  return proxy(state);
}

function proxy(state) {
  var newState = new Proxy(state, {
    get: function get(obj, key) {
      if (golbal[key]) {
        return golbal[key];
      } else {
        return obj[key];
      }
    },
    set: function set(obj, key, val) {
      golbal[key] = val;
      obj[key] = val;
      (0, _render.rerender)();
      return true;
    }
  });
  return newState;
}

function c() {
  try {
    throw new Error();
  } catch (e) {
    try {
      return e.stack.match(/Object.(\S*)/)[1];
    } catch (e) {
      return '';
    }
  }
}
},{"./render":"src/render.js","./patch":"src/patch.js"}],"src/html.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = html;
// complie tagged template to vnode , thanks htm
var CACHE = {};
var TEMPLATE = document.createElement('template');
var reg = /(\$_h\[\d+\])/g;

function html(statics) {
  var tpl = CACHE[statics] || (CACHE[statics] = build(statics));
  return tpl(this, arguments);
}

function build(statics) {
  var str = statics[0],
      i = 1;

  while (i < statics.length) {
    str += '$_h[' + i + ']' + statics[i++];
  }

  TEMPLATE.innerHTML = str.replace(/<(?:(\/)\/|(\/?)(\$_h\[\d+\]))/g, '<$1$2c c@=$3').replace(/<([\w:-]+)(?:\s[^<>]*?)?(\/?)>/g, function (str, name, a) {
    return str.replace(/(?:'.*?'|".*?"|([A-Z]))/g, function (s, c) {
      return c ? ':::' + c : s;
    }) + (a ? '</' + name + '>' : '');
  }).replace(/[\r\n]|\ \ +/g, '').trim();
  return Function('h', '$_h', 'return ' + walk((TEMPLATE.content || TEMPLATE).firstChild));
}

function walk(n) {
  if (n.nodeType != 1) {
    if (n.nodeType == 3 && n.data) return field(n.data, ',');
    return 'null';
  }

  var str = '',
      nodeName = field(n.localName, str),
      sub = '',
      start = ',({';

  for (var i = 0; i < n.attributes.length; i++) {
    var name = n.attributes[i].name;
    var value = n.attributes[i].value;

    if (name == 'c@') {
      nodeName = value;
    } else if (name.substring(0, 3) == '...') {
      sub = '';
      start = ',Object.assign({';
      str += '},' + name.substring(3) + ',{';
    } else {
      str += "".concat(sub, "\"").concat(name.replace(/:::(\w)/g, function (s, i) {
        return i.toUpperCase();
      }), "\":").concat(value ? field(value, '+') : true);
      sub = ',';
    }
  }

  str = 'h(' + nodeName + start + str + '})';
  var child = n.firstChild;

  while (child) {
    str += ',' + walk(child);
    child = child.nextSibling;
  }

  return str + ')';
}

function field(value, sep) {
  var matches = value.match(reg);
  var strValue = JSON.stringify(value);

  if (matches != null) {
    if (matches[0] === value) return value;
    strValue = strValue.replace(reg, "\"".concat(sep, "$1").concat(sep, "\"")).replace(/"[+,]"/g, '');
    if (sep == ',') strValue = "[".concat(strValue, "]");
  }

  return strValue;
}
},{}],"src/h.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.h = h;
exports.html = void 0;

var _html = _interopRequireDefault(require("./html"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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

var html = _html.default.bind(h);

exports.html = html;
},{"./html":"src/html.js"}],"src/index.js":[function(require,module,exports) {
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
Object.defineProperty(exports, "html", {
  enumerable: true,
  get: function () {
    return _h.html;
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

var _hooks = require("./hooks");

var _h = require("./h");

var _render = require("./render");
},{"./hooks":"src/hooks.js","./h":"src/h.js","./render":"src/render.js"}],"index.js":[function(require,module,exports) {
"use strict";

var _src = require("./src");

function _templateObject2() {
  var data = _taggedTemplateLiteral(["<", " />"]);

  _templateObject2 = function _templateObject2() {
    return data;
  };

  return data;
}

function _templateObject() {
  var data = _taggedTemplateLiteral(["\n    <div>\n      <p>", "</p>\n      <button onclick=", ">+</button>\n      <button onclick=", ">-</button>\n    </div>\n  "]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

function counter() {
  var state = (0, _src.useState)({
    count: 0
  });
  console.log(state);
  return (0, _src.html)(_templateObject(), state.count, function () {
    state.count++;
  }, function () {
    state.count--;
  });
}

(0, _src.render)((0, _src.html)(_templateObject2(), counter), document.body);
},{"./src":"src/index.js"}],"C:/Users/admin/AppData/Local/Yarn/Data/global/node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
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
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "57324" + '/');

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
//# sourceMappingURL=/fre.e31bb0bc.map