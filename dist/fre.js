<<<<<<< HEAD
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/core/index.ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/core/components/component.ts":
/*!******************************************!*\
  !*** ./src/core/components/component.ts ***!
  \******************************************/
/*! exports provided: Component, default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"Component\", function() { return Component; });\n/* harmony import */ var _watcher__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./watcher */ \"./src/core/components/watcher.ts\");\n/* harmony import */ var _observer_observer__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../observer/observer */ \"./src/core/observer/observer.ts\");\n\r\n\r\nvar Component = /** @class */ (function () {\r\n    function Component(props) {\r\n        if (props === void 0) { props = {}; }\r\n        this.state = {};\r\n        this.props = props;\r\n    }\r\n    Component.prototype.willMount = function () {\r\n        new _observer_observer__WEBPACK_IMPORTED_MODULE_1__[\"Observer\"](this.state);\r\n        new _watcher__WEBPACK_IMPORTED_MODULE_0__[\"Watcher\"](this);\r\n    };\r\n    return Component;\r\n}());\r\n\r\n/* harmony default export */ __webpack_exports__[\"default\"] = (Component);\r\n\n\n//# sourceURL=webpack:///./src/core/components/component.ts?");

/***/ }),

/***/ "./src/core/components/watcher.ts":
/*!****************************************!*\
  !*** ./src/core/components/watcher.ts ***!
  \****************************************/
/*! exports provided: Watcher */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"Watcher\", function() { return Watcher; });\n/* harmony import */ var _vdom_dep__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../vdom/dep */ \"./src/core/vdom/dep.ts\");\n/* harmony import */ var _render_diff__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../render/diff */ \"./src/core/render/diff.ts\");\n\r\n\r\nvar Watcher = /** @class */ (function () {\r\n    function Watcher(vm) {\r\n        this.vm = vm;\r\n        _vdom_dep__WEBPACK_IMPORTED_MODULE_0__[\"Dep\"].target = this;\r\n        this.update = this.update.bind(this);\r\n    }\r\n    Watcher.prototype.update = function () {\r\n        Object(_render_diff__WEBPACK_IMPORTED_MODULE_1__[\"renderComponent\"])(this.vm);\r\n    };\r\n    return Watcher;\r\n}());\r\n\r\n\n\n//# sourceURL=webpack:///./src/core/components/watcher.ts?");

/***/ }),

/***/ "./src/core/index.ts":
/*!***************************!*\
  !*** ./src/core/index.ts ***!
  \***************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _render_render__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./render/render */ \"./src/core/render/render.ts\");\n/* harmony import */ var _vdom_h__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./vdom/h */ \"./src/core/vdom/h.ts\");\n/* harmony import */ var _components_component__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./components/component */ \"./src/core/components/component.ts\");\n\r\n\r\n\r\n/* harmony default export */ __webpack_exports__[\"default\"] = ({\r\n    h: _vdom_h__WEBPACK_IMPORTED_MODULE_1__[\"h\"],\r\n    Component: _components_component__WEBPACK_IMPORTED_MODULE_2__[\"default\"],\r\n    render: _render_render__WEBPACK_IMPORTED_MODULE_0__[\"default\"]\r\n});\r\n\n\n//# sourceURL=webpack:///./src/core/index.ts?");

/***/ }),

/***/ "./src/core/observer/observer.ts":
/*!***************************************!*\
  !*** ./src/core/observer/observer.ts ***!
  \***************************************/
/*! exports provided: Observer */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"Observer\", function() { return Observer; });\n/* harmony import */ var _vdom_dep__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../vdom/dep */ \"./src/core/vdom/dep.ts\");\n\r\nvar Observer = /** @class */ (function () {\r\n    function Observer(state) {\r\n        this.observe(state);\r\n    }\r\n    Observer.prototype.observe = function (state) {\r\n        var _this = this;\r\n        if (!state || typeof state !== 'object') {\r\n            return;\r\n        }\r\n        Object.keys(state).forEach(function (key) {\r\n            _this.defineReactive(state, key, state[key]);\r\n            _this.observe(state[key]);\r\n        });\r\n    };\r\n    Observer.prototype.defineReactive = function (obj, key, val) {\r\n        var that = this;\r\n        var dep = new _vdom_dep__WEBPACK_IMPORTED_MODULE_0__[\"Dep\"]();\r\n        Object.defineProperty(obj, key, {\r\n            enumerable: true,\r\n            configurable: true,\r\n            get: function () {\r\n                if (_vdom_dep__WEBPACK_IMPORTED_MODULE_0__[\"Dep\"].target) {\r\n                    dep.add(_vdom_dep__WEBPACK_IMPORTED_MODULE_0__[\"Dep\"].target);\r\n                }\r\n                _vdom_dep__WEBPACK_IMPORTED_MODULE_0__[\"Dep\"].target = null;\r\n                return val;\r\n            },\r\n            set: function (newVal) {\r\n                if (newVal !== val) {\r\n                    that.observe(newVal);\r\n                    val = newVal;\r\n                    dep.notify();\r\n                }\r\n            }\r\n        });\r\n    };\r\n    return Observer;\r\n}());\r\n\r\n\n\n//# sourceURL=webpack:///./src/core/observer/observer.ts?");

/***/ }),

/***/ "./src/core/render/diff.ts":
/*!*********************************!*\
  !*** ./src/core/render/diff.ts ***!
  \*********************************/
/*! exports provided: diff, renderComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"diff\", function() { return diff; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"renderComponent\", function() { return renderComponent; });\n/* harmony import */ var _vdom_dom__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../vdom/dom */ \"./src/core/vdom/dom.ts\");\n\r\nfunction diff(node, vnode, container) {\r\n    var ret = diffNode(node, vnode);\r\n    if (container && ret.parentNode !== container) {\r\n        container.appendChild(ret);\r\n    }\r\n    return ret;\r\n}\r\nfunction diffNode(node, vnode) {\r\n    var newNode = node;\r\n    if (typeof vnode === undefined ||\r\n        typeof vnode === null ||\r\n        typeof vnode === 'boolean') {\r\n        vnode = '';\r\n    }\r\n    if (typeof vnode === 'number')\r\n        vnode = String(vnode);\r\n    if (typeof vnode === 'string') {\r\n        if (node && node.nodeType === 3) {\r\n            if (node.textContent !== vnode) {\r\n                node.textContent = vnode;\r\n            }\r\n        }\r\n        else {\r\n            newNode = document.createTextNode(vnode);\r\n            if (node && node.parentNode) {\r\n                node.parentNode.replaceChild(newNode, node);\r\n            }\r\n        }\r\n        return newNode;\r\n    }\r\n    if (typeof vnode.type === 'function') {\r\n        return diffComponent(node, vnode);\r\n    }\r\n    if (!node || !isSameNodeType(node, vnode)) {\r\n        newNode = document.createElement(vnode.type);\r\n        if (node) {\r\n            node.childNodes.slice().map(newNode.appendChild);\r\n            if (node.parentNode) {\r\n                node.parentNode.replaceChild(newNode, node);\r\n            }\r\n        }\r\n    }\r\n    if (vnode.children && vnode.children.length > 0 || newNode.childNodes && newNode.childNodes.length > 0) {\r\n        diffChildren(newNode, vnode.children);\r\n    }\r\n    diffAttrs(newNode, vnode);\r\n    return newNode;\r\n}\r\nfunction diffChildren(node, vchildren) {\r\n    var nodeChildren = node.childNodes;\r\n    var children = [];\r\n    var keyed = {};\r\n    if (nodeChildren.length > 0) {\r\n        for (var i = 0; i < nodeChildren.length; i++) {\r\n            var child = nodeChildren[i];\r\n            var key = child.key;\r\n            if (key) {\r\n                keyed[key] = child;\r\n            }\r\n            else {\r\n                children.push(child);\r\n            }\r\n        }\r\n    }\r\n    if (vchildren.length > 0) {\r\n        var min = 0;\r\n        var childrenLen = children.length;\r\n        for (var i = 0; i < vchildren.length; i++) {\r\n            var vchild = vchildren[i];\r\n            var key = vchild.key;\r\n            var child = void 0;\r\n            if (key) {\r\n                if (keyed[key]) {\r\n                    child = keyed[key];\r\n                    keyed[key] = undefined;\r\n                }\r\n            }\r\n            else if (min < childrenLen) {\r\n                for (var j = min; j < childrenLen; j++) {\r\n                    var c = children[j];\r\n                    if (c && isSameNodeType(c, vchild)) {\r\n                        child = c;\r\n                        children[j] = undefined;\r\n                        if (j === children - 1)\r\n                            childrenLen--;\r\n                        if (j === min)\r\n                            min++;\r\n                    }\r\n                }\r\n            }\r\n            child = diffNode(child, vchild);\r\n            var f = nodeChildren[i];\r\n            if (child && child !== node && child !== f) {\r\n                if (!f) {\r\n                    node.appendChild(child);\r\n                }\r\n                else if (child === f.nextSibling) {\r\n                    removeNode(f);\r\n                }\r\n                else {\r\n                    node.insertBefore(child, f);\r\n                }\r\n            }\r\n        }\r\n    }\r\n}\r\nfunction diffComponent(node, vnode) {\r\n    var component = node && node.component;\r\n    var oldNode = node;\r\n    if (component && component.constructor === vnode.type) {\r\n        setComponentProps(component, vnode.props);\r\n        node = component.base;\r\n    }\r\n    else {\r\n        if (component) {\r\n            unmountComponent(component);\r\n            oldNode = null;\r\n        }\r\n        component = createComponent(vnode.type, vnode.props);\r\n        setComponentProps(component, vnode.props);\r\n        node = component.base;\r\n        if (oldNode && node !== oldNode) {\r\n            oldNode.component = null;\r\n            removeNode(oldNode);\r\n        }\r\n    }\r\n    return node;\r\n}\r\nfunction setComponentProps(component, props) {\r\n    if (!component.base) {\r\n        if (component.willMount)\r\n            component.willMount();\r\n    }\r\n    else if (component.willChange) {\r\n        component.willChange(props);\r\n    }\r\n    component.props = props;\r\n    renderComponent(component);\r\n}\r\nfunction renderComponent(component) {\r\n    var base;\r\n    var vnode = component.render();\r\n    if (component.base && component.willUpdate) {\r\n        component.willUpdate();\r\n    }\r\n    base = diffNode(component.base, vnode);\r\n    if (component.base) {\r\n        if (component.updated)\r\n            component.updated();\r\n    }\r\n    else if (component.mounted) {\r\n        component.mounted();\r\n    }\r\n    component.base = base;\r\n}\r\nfunction createComponent(component, props) {\r\n    var _this = this;\r\n    var inst;\r\n    if (component.prototype && component.prototype.render) {\r\n        inst = new component(props);\r\n    }\r\n    else {\r\n        inst = new component(props);\r\n        inst.constructor = component;\r\n        inst.render = function () { return _this.constructor(props); };\r\n    }\r\n    return inst;\r\n}\r\nfunction unmountComponent(component) {\r\n    if (component.willUnmout)\r\n        component.willUnmout();\r\n    removeNode(component.base);\r\n}\r\nfunction isSameNodeType(node, vnode) {\r\n    if (typeof vnode === 'string' || typeof vnode === 'number') {\r\n        return node.nodeType === 3;\r\n    }\r\n    if (typeof vnode.type === 'string') {\r\n        return node.nodeName.toLowerCase() === vnode.type.toLowerCase();\r\n    }\r\n    return node && node.component && node.component.constructor === vnode.type;\r\n}\r\nfunction diffAttrs(node, vnode) {\r\n    var nodeAttr = {};\r\n    var vnodeAttr = vnode.props;\r\n    for (var i = 0; i < node.attributes.length; i++) {\r\n        var attr = node.attributes[i];\r\n        nodeAttr[attr.name] = attr.value;\r\n    }\r\n    for (var name_1 in nodeAttr) {\r\n        if (!(name_1 in vnodeAttr)) {\r\n            Object(_vdom_dom__WEBPACK_IMPORTED_MODULE_0__[\"setAttr\"])(node, name_1, undefined);\r\n        }\r\n    }\r\n    for (var name_2 in vnodeAttr) {\r\n        if (nodeAttr[name_2] !== vnodeAttr[name_2]) {\r\n            Object(_vdom_dom__WEBPACK_IMPORTED_MODULE_0__[\"setAttr\"])(node, name_2, vnodeAttr[name_2]);\r\n        }\r\n    }\r\n}\r\nfunction removeNode(node) {\r\n    if (node && node.parentNode) {\r\n        node.parentNode.removeChild(node);\r\n    }\r\n}\r\n\n\n//# sourceURL=webpack:///./src/core/render/diff.ts?");

/***/ }),

/***/ "./src/core/render/render.ts":
/*!***********************************!*\
  !*** ./src/core/render/render.ts ***!
  \***********************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _diff__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./diff */ \"./src/core/render/diff.ts\");\n\r\nfunction render(vnode, container, node) {\r\n    return Object(_diff__WEBPACK_IMPORTED_MODULE_0__[\"diff\"])(node, vnode, container);\r\n}\r\n/* harmony default export */ __webpack_exports__[\"default\"] = (render);\r\n\n\n//# sourceURL=webpack:///./src/core/render/render.ts?");

/***/ }),

/***/ "./src/core/vdom/dep.ts":
/*!******************************!*\
  !*** ./src/core/vdom/dep.ts ***!
  \******************************/
/*! exports provided: Dep */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"Dep\", function() { return Dep; });\nvar Dep = /** @class */ (function () {\r\n    function Dep() {\r\n        this.subs = [];\r\n        this.add = this.add.bind(this);\r\n        this.notify = this.notify.bind(this);\r\n    }\r\n    Dep.prototype.add = function (watcher) {\r\n        this.subs.push(watcher);\r\n    };\r\n    Dep.prototype.clean = function () {\r\n        this.subs = [];\r\n    };\r\n    Dep.prototype.notify = function () {\r\n        this.subs.forEach(function (watcher) { return watcher.update(); });\r\n    };\r\n    return Dep;\r\n}());\r\n\r\nDep.target = null;\r\n\n\n//# sourceURL=webpack:///./src/core/vdom/dep.ts?");

/***/ }),

/***/ "./src/core/vdom/dom.ts":
/*!******************************!*\
  !*** ./src/core/vdom/dom.ts ***!
  \******************************/
/*! exports provided: setAttr */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"setAttr\", function() { return setAttr; });\nfunction setAttr(node, name, value) {\r\n    if (/on\\w+/.test(name)) {\r\n        name = name.toLowerCase();\r\n        node[name] = value;\r\n    }\r\n    else {\r\n        switch (name) {\r\n            case 'className':\r\n                name = 'class';\r\n                node.setAttribute(name, value);\r\n                break;\r\n            case 'value':\r\n                if (node.tagName.toUpperCase() === 'input' || node.tagName.toUpperCase() === 'textarea') {\r\n                    node.value = value;\r\n                }\r\n                else {\r\n                    node.setAttribute(name, value);\r\n                }\r\n                break;\r\n            case 'style':\r\n                node.style.cssText = value;\r\n                break;\r\n            default:\r\n                node.setAttribute(name, value);\r\n                break;\r\n        }\r\n    }\r\n}\r\n\n\n//# sourceURL=webpack:///./src/core/vdom/dom.ts?");

/***/ }),

/***/ "./src/core/vdom/h.ts":
/*!****************************!*\
  !*** ./src/core/vdom/h.ts ***!
  \****************************/
/*! exports provided: Vnode, h */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"Vnode\", function() { return Vnode; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"h\", function() { return h; });\nvar Vnode = /** @class */ (function () {\r\n    function Vnode(type, props, children) {\r\n        props = props || {};\r\n        this.type = type;\r\n        this.props = props;\r\n        this.children = children;\r\n        this.key = this.props.key || null;\r\n    }\r\n    return Vnode;\r\n}());\r\n\r\nfunction h(type, props) {\r\n    var children = [];\r\n    for (var _i = 2; _i < arguments.length; _i++) {\r\n        children[_i - 2] = arguments[_i];\r\n    }\r\n    return new Vnode(type, props, children);\r\n}\r\n\n\n//# sourceURL=webpack:///./src/core/vdom/h.ts?");

/***/ })

/******/ });
=======
!function(e,t){"object"==typeof exports&&"object"==typeof module?module.exports=t():"function"==typeof define&&define.amd?define([],t):"object"==typeof exports?exports.fre=t():e.fre=t()}(window,function(){return function(e){var t={};function n(o){if(t[o])return t[o].exports;var r=t[o]={i:o,l:!1,exports:{}};return e[o].call(r.exports,r,r.exports,n),r.l=!0,r.exports}return n.m=e,n.c=t,n.d=function(e,t,o){n.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:o})},n.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},n.t=function(e,t){if(1&t&&(e=n(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var o=Object.create(null);if(n.r(o),Object.defineProperty(o,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var r in e)n.d(o,r,function(t){return e[t]}.bind(null,r));return o},n.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(t,"a",t),t},n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},n.p="",n(n.s=2)}([function(e,t,n){"use strict";t.__esModule=!0;var o=n(4);function r(e,t){var n=e;return void 0!==typeof t&&null!==typeof t&&"boolean"!=typeof t||(t=""),"number"==typeof t&&(t=String(t)),"string"==typeof t?(e&&3===e.nodeType?e.textContent!==t&&(e.textContent=t):(n=document.createTextNode(t),e&&e.parentNode&&e.parentNode.replaceChild(n,e)),n):"function"==typeof t.type?function(e,t){var n=e&&e.component,o=e;n&&n.constructor===t.type?(i(n,t.props),e=n.base):(n&&(!function(e){e.willUnmout&&e.willUnmout();a(e.base)}(n),o=null),i(n=function(e,t){var n,o=this;e.prototype&&e.prototype.render?n=new e(t):((n=new e(t)).constructor=e,n.render=function(){return o.constructor(t)});return n}(t.type,t.props),t.props),e=n.base,o&&e!==o&&(o.component=null,a(o)));return e}(e,t):(e&&s(e,t)||(n=document.createElement(t.type),e&&(e.childNodes.slice().map(n.appendChild),e.parentNode&&e.parentNode.replaceChild(n,e))),(t.children&&t.children.length>0||n.childNodes&&n.childNodes.length>0)&&function(e,t){var n=e.childNodes,o=[],i={};if(n.length>0)for(var u=0;u<n.length;u++){var c=n[u],f=c.key;f?i[f]=c:o.push(c)}if(t.length>0)for(var p=0,d=o.length,u=0;u<t.length;u++){var l=t[u],f=l.key,c=void 0;if(f)i[f]&&(c=i[f],i[f]=void 0);else if(p<d)for(var h=p;h<d;h++){var y=o[h];y&&s(y,l)&&(c=y,o[h]=void 0,h===o-1&&d--,h===p&&p++)}c=r(c,l);var v=n[u];c&&c!==e&&c!==v&&(v?c===v.nextSibling?a(v):e.insertBefore(c,v):e.appendChild(c))}}(n,t.children),function(e,t){for(var n={},r=t.props,i=0;i<e.attributes.length;i++){var u=e.attributes[i];n[u.name]=u.value}for(var s in n)s in r||o.setAttr(e,s,void 0);for(var a in r)n[a]!==r[a]&&o.setAttr(e,a,r[a])}(n,t),n)}function i(e,t){e.base?e.willChange&&e.willChange(t):e.willMount&&e.willMount(),e.props=t,u(e)}function u(e){var t,n=e.render();e.base&&e.willUpdate&&e.willUpdate(),t=r(e.base,n),e.base?e.updated&&e.updated():e.mounted&&e.mounted(),e.base=t}function s(e,t){return"string"==typeof t||"number"==typeof t?3===e.nodeType:"string"==typeof t.type?e.nodeName.toLowerCase()===t.type.toLowerCase():e&&e.component&&e.component.constructor===t.type}function a(e){e&&e.parentNode&&e.parentNode.removeChild(e)}t.diff=function(e,t,n){var o=r(e,t);return n&&o.parentNode!==n&&n.appendChild(o),o},t.renderComponent=u},function(e,t,n){"use strict";t.__esModule=!0;var o=function(){function e(){this.subs=[],this.add=this.add.bind(this),this.notify=this.notify.bind(this)}return e.prototype.add=function(e){this.subs.push(e)},e.prototype.clean=function(){this.subs=[]},e.prototype.notify=function(){this.subs.forEach(function(e){return e.update()})},e}();t.Dep=o,o.target=null},function(e,t,n){"use strict";t.__esModule=!0;var o=n(3),r=n(5),i=n(6);t.default={h:r.h,Component:i.default,render:o.default}},function(e,t,n){"use strict";t.__esModule=!0;var o=n(0);t.default=function(e,t,n){return o.diff(n,e,t)}},function(e,t,n){"use strict";t.__esModule=!0,t.setAttr=function(e,t,n){if(/on\w+/.test(t))e[t=t.toLowerCase()]=n;else switch(t){case"className":t="class",e.setAttribute(t,n);break;case"value":"input"===e.tagName.toUpperCase()||"textarea"===e.tagName.toUpperCase()?e.value=n:e.setAttribute(t,n);break;case"style":e.style.cssText=n;break;default:e.setAttribute(t,n)}}},function(e,t,n){"use strict";t.__esModule=!0;var o=function(){return function(e,t,n){t=t||{},this.type=e,this.props=t,this.children=n,this.key=this.props.key||null}}();t.Vnode=o,t.h=function(e,t){for(var n=[],r=2;r<arguments.length;r++)n[r-2]=arguments[r];return new o(e,t,n)}},function(e,t,n){"use strict";t.__esModule=!0;var o=n(7),r=n(8),i=function(){function e(e){void 0===e&&(e={}),this.state={},this.props=e}return e.prototype.willMount=function(){new r.Observer(this.state),new o.Watcher(this)},e}();t.Component=i,t.default=i},function(e,t,n){"use strict";t.__esModule=!0;var o=n(1),r=n(0),i=function(){function e(e){this.vm=e,o.Dep.target=this,this.update=this.update.bind(this)}return e.prototype.update=function(){r.renderComponent(this.vm)},e}();t.Watcher=i},function(e,t,n){"use strict";t.__esModule=!0;var o=n(1),r=function(){function e(e){this.observe(e)}return e.prototype.observe=function(e){var t=this;e&&"object"==typeof e&&Object.keys(e).forEach(function(n){t.defineReactive(e,n,e[n]),t.observe(e[n])})},e.prototype.defineReactive=function(e,t,n){var r=this,i=new o.Dep;Object.defineProperty(e,t,{enumerable:!0,configurable:!0,get:function(){return o.Dep.target&&i.add(o.Dep.target),o.Dep.target=null,n},set:function(e){e!==n&&(r.observe(e),n=e,i.notify())}})},e}();t.Observer=r}])});
>>>>>>> 8a3120ff8241679b185c512a0b2ddeaa057d2808
