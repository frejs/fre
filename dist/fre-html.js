// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles

// eslint-disable-next-line no-global-assign
require = (function (modules, cache, entry) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof require === "function" && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof require === "function" && require;
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

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }
      
      localRequire.resolve = resolve;

      var module = cache[name] = new newRequire.Module;

      modules[name][0].call(module.exports, localRequire, module, module.exports);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module() {
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;

  for (var i = 0; i < entry.length; i++) {
    newRequire(entry[i]);
  }

  // Override the current require with this new one
  return newRequire;
})({14:[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.mount = mount;
exports.render = render;
exports.setAttr = setAttr;
let vm = exports.vm = undefined;
let oldTree = exports.oldTree = undefined;
let el = exports.el = undefined;

function mount(vnode, el) {
  el.innerHTML = '';
  exports.oldTree = oldTree = vnode.type();
  exports.vm = vm = vnode;
  el = el;
  const node = render(vnode);
  el.appendChild(node);
}

function render(vnode) {
  if (typeof vnode.type === 'function') {
    vnode = vnode.type();
  }
  let node = document.createElement(vnode.type);
  for (let name in vnode.props) {
    setAttr(node, name, vnode.props[name]);
  }

  vnode.children.forEach(child => {
    child = typeof child == 'object' ? render(child) : document.createTextNode(child);
    node.appendChild(child);
  });

  return node;
}

function setAttr(node, name, value) {
  if (/on\w+/.test(name)) {
    name = name.toLowerCase();
    node[name] = value || '';
  } else {
    switch (name) {
      case 'className':
        name === 'class';
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
}
},{}],19:[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.diff = diff;
const ATTRS = 'ATTRS';
const REMOVE = 'REMOVE';
const TEXT = 'TEXT';
const REPLACE = 'REPLACE';

let Index = 0;
let patches = {};

function diff(oldTree, newTtree) {
  let index = 0;

  walk(oldTree, newTtree, index);

  return patches;
}

function walk(oldNode, newNode, index) {
  let currentPatches = [];

  if (!newNode) {
    currentPatches.push({ type: REMOVE, index });
  } else if (typeof oldNode === 'string' && typeof newNode === 'string') {
    if (oldNode !== newNode) {
      currentPatches.push({ type: TEXT, text: newNode });
    }
  } else if (oldNode.type === newNode.type) {
    let attrs = diffAttr(oldNode.props, newNode.props);

    if (Object.keys(attrs).length > 0) {
      currentPatches.push({ type: ATTRS, attrs });
    }
    diffChildren(oldNode.children, newNode.children);
  } else {
    Index += oldNode.children.length;
    currentPatches.push({ type: REPLACE, newNode });
  }

  if (currentPatches.length > 0) {
    patches[index] = currentPatches;
  }
}

function diffAttr(oldAttr, newAttr) {
  let patch = {};

  for (let key in oldAttr) {
    if (oldAttr[key] !== newAttr[key]) {
      patch[key] = newAttr[key];
    }
  }
  for (let key in newAttr) {
    if (!oldAttr.hasOwnProperty(key)) {
      patch[key] = newAttr[key];
    }
  }

  return patch;
}

function diffChildren(oldChildren, newChildren) {
  oldChildren.forEach((child, index) => {
    walk(child, newChildren[index], ++Index);
  });
}
},{}],20:[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.patch = patch;

var _render = require('./render');

let allPatches;
let index = 0;

function patch(node, patches) {
  allPatches = patches;

  walk(node);
}

function walk(node) {
  let currentPatch = allPatches[index++];
  node.childNodes.forEach(child => walk(child));

  if (currentPatch) {
    usePatch(node, currentPatch);
  }
}

function usePatch(node, patches) {
  patches.forEach(patch => {
    switch (patch.type) {
      case 'ATTRS':
        for (let key in patch.attrs) {
          let value = patch.attrs[key];
          if (value) {
            (0, _render.setAttr)(node, key, value);
          } else {
            node.removeAttribute(key);
          }
        }
        break;
      case 'TEXT':
        node.textContent = patch.text;
        break;
      case 'REPLACE':
        let newNode = typeof patch.newNode === 'object' ? (0, _render.render)(patch.newNode) : document.createTextNode(patch.newNode);
        node.parentNode.replaceChild(newNode, node);
        break;
      case 'REMOVE':
        node.parentNode.removeChild(node);
        break;
    }
  });
}
},{"./render":14}],13:[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useState = useState;

var _render = require('./render');

var _diff = require('./diff');

var _patch = require('./patch');

let save = {};
let newTree;

function useState(state) {
  if (Object.keys(save).length > 0) {
    state = save;
  }

  let proxy = new Proxy(state, {
    get(obj, key) {
      if (save[key]) {
        return save[key];
      } else {
        return obj[key];
      }
    },
    set(obj, key, val) {
      obj[key] = val;
      save[key] = val;
      newTree = _render.vm.type();
      let patches = (0, _diff.diff)(_render.oldTree, newTree);
      (0, _patch.patch)(el, patches);
      return true;
    }
  });

  return proxy;
}
},{"./render":14,"./diff":19,"./patch":20}],16:[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = html;
// complie tagged template to vnode , thanks htm

const CACHE = {};
const TEMPLATE = document.createElement('template');
const reg = /(\$_h\[\d+\])/g;

function html(statics) {
  const tpl = CACHE[statics] || (CACHE[statics] = build(statics));
  return tpl(this, arguments);
}

function build(statics) {
  let str = statics[0],
      i = 1;
  while (i < statics.length) {
    str += '$_h[' + i + ']' + statics[i++];
  }
  TEMPLATE.innerHTML = str.replace(/<(?:(\/)\/|(\/?)(\$_h\[\d+\]))/g, '<$1$2c c@=$3').replace(/<([\w:-]+)(?:\s[^<>]*?)?(\/?)>/g, (str, name, a) => str.replace(/(?:'.*?'|".*?"|([A-Z]))/g, (s, c) => c ? ':::' + c : s) + (a ? '</' + name + '>' : '')).replace(/[\r\n]|\ \ +/g, '').trim();

  return Function('h', '$_h', 'return ' + walk((TEMPLATE.content || TEMPLATE).firstChild));
}

function walk(n) {
  if (n.nodeType != 1) {
    if (n.nodeType == 3 && n.data) return field(n.data, ',');
    return 'null';
  }

  let str = '',
      nodeName = field(n.localName, str),
      sub = '',
      start = ',({';

  for (let i = 0; i < n.attributes.length; i++) {
    const name = n.attributes[i].name;
    const value = n.attributes[i].value;

    if (name == 'c@') {
      nodeName = value;
    } else if (name.substring(0, 3) == '...') {
      sub = '';
      start = ',Object.assign({';
      str += '},' + name.substring(3) + ',{';
    } else {
      str += `${sub}"${name.replace(/:::(\w)/g, (s, i) => i.toUpperCase())}":${value ? field(value, '+') : true}`;
      sub = ',';
    }
  }

  str = 'h(' + nodeName + start + str + '})';
  let child = n.firstChild;
  while (child) {
    str += ',' + walk(child);
    child = child.nextSibling;
  }

  return str + ')';
}

function field(value, sep) {
  const matches = value.match(reg);
  let strValue = JSON.stringify(value);

  if (matches != null) {
    if (matches[0] === value) return value;
    strValue = strValue.replace(reg, `"${sep}$1${sep}"`).replace(/"[+,]"/g, '');
    if (sep == ',') strValue = `[${strValue}]`;
  }

  return strValue;
}
},{}],15:[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.html = undefined;
exports.h = h;

var _html = require('./html');

var _html2 = _interopRequireDefault(_html);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function h(type, props, ...children) {
  return { type, props, children };
}

const html = exports.html = _html2.default.bind(h);
},{"./html":16}],2:[function(require,module,exports) {
'use strict';

var _hooks = require('./src/hooks');

var _h = require('./src/h');

var _render = require('./src/render');

function counter() {
  const state = (0, _hooks.useState)({
    count: 0
  });

  return _h.html`
    <div>
      <p>${state.count}</p>
      <button onclick=${() => {
    state.count++;
  }}>+</button>
    </div> 
  `;
}

(0, _render.mount)(_h.html`<${counter} />`, document.body);
},{"./src/hooks":13,"./src/h":15,"./src/render":14}],18:[function(require,module,exports) {

var global = (1, eval)('this');
var OldModule = module.bundle.Module;
function Module() {
  OldModule.call(this);
  this.hot = {
    accept: function (fn) {
      this._acceptCallback = fn || function () {};
    },
    dispose: function (fn) {
      this._disposeCallback = fn;
    }
  };
}

module.bundle.Module = Module;

if (!module.bundle.parent && typeof WebSocket !== 'undefined') {
  var hostname = '' || location.hostname;
  var ws = new WebSocket('ws://' + hostname + ':' + '57018' + '/');
  ws.onmessage = function (event) {
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      data.assets.forEach(function (asset) {
        hmrApply(global.require, asset);
      });

      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          hmrAccept(global.require, asset.id);
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
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + 'data.error.stack');
    }
  };
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
        parents.push(+k);
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
  if (cached && cached.hot._disposeCallback) {
    cached.hot._disposeCallback();
  }

  delete bundle.cache[id];
  bundle(id);

  cached = bundle.cache[id];
  if (cached && cached.hot && cached.hot._acceptCallback) {
    cached.hot._acceptCallback();
    return true;
  }

  return getParents(global.require, id).some(function (id) {
    return hmrAccept(global.require, id);
  });
}
},{}]},{},[18,2])
//# sourceMappingURL=/dist/fre-html.map