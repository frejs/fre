// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles

// eslint-disable-next-line no-global-assign
parcelRequire = (function (modules, cache, entry) {
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

      var module = cache[name] = new newRequire.Module(name);

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

  for (var i = 0; i < entry.length; i++) {
    newRequire(entry[i]);
  }

  // Override the current require with this new one
  return newRequire;
})({8:[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.html = html;
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
  }).trim();

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
      str += sub + '"' + name.replace(/:::(\w)/g, function (s, i) {
        return i.toUpperCase();
      }) + '":' + (value ? field(value, '+') : true);
      sub = ',';
    }
  }

  str = 'h(' + nodeName + start + str + '})';
  var child = n.firstChild;
  while (child) {
    if (child.nodeName !== '#text') {
      str += ',' + walk(child);
      child = child.nextSibling;
    }
  }

  return str + ')';
}

function field(value, sep) {
  var matches = value.match(reg);
  var strValue = JSON.stringify(value);

  if (matches != null) {
    if (matches[0] === value) return value;
    strValue = strValue.replace(reg, '"' + sep + '$1' + sep + '"').replace(/"[+,]"/g, '');
    if (sep == ',') strValue = '[' + strValue + ']';
  }

  return strValue;
}
},{}],10:[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.h = h;

var _html = require('./html');

function h(type, props) {
  for (var _len = arguments.length, children = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
    children[_key - 2] = arguments[_key];
  }

  return { type: type, props: props, children: children };
}

exports.default = _html.html.bind(h);
},{"./html":8}],2:[function(require,module,exports) {
'use strict';

var _templateObject = _taggedTemplateLiteral(['\n  <ul class="list">\n    <li class="item">1</li>\n    <li class="item">2</li>\n    <li class="item">3</li>\n  </ul>\n'], ['\n  <ul class="list">\n    <li class="item">1</li>\n    <li class="item">2</li>\n    <li class="item">3</li>\n  </ul>\n']),
    _templateObject2 = _taggedTemplateLiteral(['\n  <ul class="list">\n    <li class="item">2</li>\n    <li class="item">3</li>\n    <li class="item">4</li>\n  </ul>\n'], ['\n  <ul class="list">\n    <li class="item">2</li>\n    <li class="item">3</li>\n    <li class="item">4</li>\n  </ul>\n']);

var _h = require('./src/h');

var _h2 = _interopRequireDefault(_h);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _taggedTemplateLiteral(strings, raw) { return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var oldDom = (0, _h2.default)(_templateObject);

var newDom = (0, _h2.default)(_templateObject2);

console.log(oldDom, newDom);
},{"./src/h":10}],3:[function(require,module,exports) {

var OVERLAY_ID = '__parcel__error__overlay__';

var global = (1, eval)('this');
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
  var hostname = '' || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + '49653' + '/');
  ws.onmessage = function (event) {
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
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
  overlay.id = OVERLAY_ID;

  // html encode message and stack trace
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
},{}]},{},[3,2])
//# sourceMappingURL=/fre1.a087753c.map