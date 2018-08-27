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