import React from "react";
const ReactDOM = function(React2) {
  "use strict";
  var validateFormat = function() {
  };
  {
    validateFormat = function(format) {
      if (format === void 0) {
        throw new Error("invariant requires an error message argument");
      }
    };
  }
  function invariant(condition, format, a, b, c, d, e, f) {
    validateFormat(format);
    if (!condition) {
      var error = void 0;
      if (format === void 0) {
        error = new Error("Minified exception occurred; use the non-minified dev environment for the full error message and additional helpful warnings.");
      } else {
        var args = [a, b, c, d, e, f];
        var argIndex = 0;
        error = new Error(format.replace(/%s/g, function() {
          return args[argIndex++];
        }));
        error.name = "Invariant Violation";
      }
      error.framesToPop = 1;
      throw error;
    }
  }
  !React2 ? invariant(false, "ReactDOM was loaded before React. Make sure you load the React package before loading ReactDOM.") : void 0;
  var invokeGuardedCallbackImpl = function(name, func, context, a, b, c, d, e, f) {
    var funcArgs = Array.prototype.slice.call(arguments, 3);
    try {
      func.apply(context, funcArgs);
    } catch (error) {
      this.onError(error);
    }
  };
  {
    if (typeof window !== "undefined" && typeof window.dispatchEvent === "function" && typeof document !== "undefined" && typeof document.createEvent === "function") {
      var fakeNode = document.createElement("react");
      var invokeGuardedCallbackDev = function(name, func, context, a, b, c, d, e, f) {
        !(typeof document !== "undefined") ? invariant(false, "The `document` global was defined when React was initialized, but is not defined anymore. This can happen in a test environment if a component schedules an update from an asynchronous callback, but the test has already finished running. To solve this, you can either unmount the component at the end of your test (and ensure that any asynchronous operations get canceled in `componentWillUnmount`), or you can change the test itself to be asynchronous.") : void 0;
        var evt = document.createEvent("Event");
        var didError = true;
        var windowEvent = window.event;
        var windowEventDescriptor = Object.getOwnPropertyDescriptor(window, "event");
        var funcArgs = Array.prototype.slice.call(arguments, 3);
        function callCallback2() {
          fakeNode.removeEventListener(evtType, callCallback2, false);
          if (typeof window.event !== "undefined" && window.hasOwnProperty("event")) {
            window.event = windowEvent;
          }
          func.apply(context, funcArgs);
          didError = false;
        }
        var error = void 0;
        var didSetError = false;
        var isCrossOriginError = false;
        function handleWindowError(event) {
          error = event.error;
          didSetError = true;
          if (error === null && event.colno === 0 && event.lineno === 0) {
            isCrossOriginError = true;
          }
          if (event.defaultPrevented) {
            if (error != null && typeof error === "object") {
              try {
                error._suppressLogging = true;
              } catch (inner) {
              }
            }
          }
        }
        var evtType = "react-" + (name ? name : "invokeguardedcallback");
        window.addEventListener("error", handleWindowError);
        fakeNode.addEventListener(evtType, callCallback2, false);
        evt.initEvent(evtType, false, false);
        fakeNode.dispatchEvent(evt);
        if (windowEventDescriptor) {
          Object.defineProperty(window, "event", windowEventDescriptor);
        }
        if (didError) {
          if (!didSetError) {
            error = new Error(`An error was thrown inside one of your components, but React doesn't know what it was. This is likely due to browser flakiness. React does its best to preserve the "Pause on exceptions" behavior of the DevTools, which requires some DEV-mode only tricks. It's possible that these don't work in your browser. Try triggering the error in production mode, or switching to a modern browser. If you suspect that this is actually an issue with React, please file an issue.`);
          } else if (isCrossOriginError) {
            error = new Error("A cross-origin error was thrown. React doesn't have access to the actual error object in development. See https://fb.me/react-crossorigin-error for more information.");
          }
          this.onError(error);
        }
        window.removeEventListener("error", handleWindowError);
      };
      invokeGuardedCallbackImpl = invokeGuardedCallbackDev;
    }
  }
  var invokeGuardedCallbackImpl$1 = invokeGuardedCallbackImpl;
  var hasError = false;
  var caughtError = null;
  var hasRethrowError = false;
  var rethrowError = null;
  var reporter = {
    onError: function(error) {
      hasError = true;
      caughtError = error;
    }
  };
  function invokeGuardedCallback(name, func, context, a, b, c, d, e, f) {
    hasError = false;
    caughtError = null;
    invokeGuardedCallbackImpl$1.apply(reporter, arguments);
  }
  function invokeGuardedCallbackAndCatchFirstError(name, func, context, a, b, c, d, e, f) {
    invokeGuardedCallback.apply(this, arguments);
    if (hasError) {
      var error = clearCaughtError();
      if (!hasRethrowError) {
        hasRethrowError = true;
        rethrowError = error;
      }
    }
  }
  function rethrowCaughtError() {
    if (hasRethrowError) {
      var error = rethrowError;
      hasRethrowError = false;
      rethrowError = null;
      throw error;
    }
  }
  function hasCaughtError() {
    return hasError;
  }
  function clearCaughtError() {
    if (hasError) {
      var error = caughtError;
      hasError = false;
      caughtError = null;
      return error;
    } else {
      invariant(false, "clearCaughtError was called but no error was captured. This error is likely caused by a bug in React. Please file an issue.");
    }
  }
  function recomputePluginOrdering() {
    if (!eventPluginOrder) {
      return;
    }
    for (var pluginName in namesToPlugins) {
      var pluginModule = namesToPlugins[pluginName];
      var pluginIndex = eventPluginOrder.indexOf(pluginName);
      !(pluginIndex > -1) ? invariant(false, "EventPluginRegistry: Cannot inject event plugins that do not exist in the plugin ordering, `%s`.", pluginName) : void 0;
      if (plugins[pluginIndex]) {
        continue;
      }
      !pluginModule.extractEvents ? invariant(false, "EventPluginRegistry: Event plugins must implement an `extractEvents` method, but `%s` does not.", pluginName) : void 0;
      plugins[pluginIndex] = pluginModule;
      var publishedEvents = pluginModule.eventTypes;
      for (var eventName in publishedEvents) {
        !publishEventForPlugin(publishedEvents[eventName], pluginModule, eventName) ? invariant(false, "EventPluginRegistry: Failed to publish event `%s` for plugin `%s`.", eventName, pluginName) : void 0;
      }
    }
  }
  function publishEventForPlugin(dispatchConfig, pluginModule, eventName) {
    !!eventNameDispatchConfigs.hasOwnProperty(eventName) ? invariant(false, "EventPluginHub: More than one plugin attempted to publish the same event name, `%s`.", eventName) : void 0;
    eventNameDispatchConfigs[eventName] = dispatchConfig;
    var phasedRegistrationNames = dispatchConfig.phasedRegistrationNames;
    if (phasedRegistrationNames) {
      \u00E5;
      for (var phaseName in phasedRegistrationNames) {
        if (phasedRegistrationNames.hasOwnProperty(phaseName)) {
          var phasedRegistrationName = phasedRegistrationNames[phaseName];
          publishRegistrationName(phasedRegistrationName, pluginModule, eventName);
        }
      }
      return true;
    } else if (dispatchConfig.registrationName) {
      publishRegistrationName(dispatchConfig.registrationName, pluginModule, eventName);
      return true;
    }
    return false;
  }
  function publishRegistrationName(registrationName, pluginModule, eventName) {
    !!registrationNameModules[registrationName] ? invariant(false, "EventPluginHub: More than one plugin attempted to publish the same registration name, `%s`.", registrationName) : void 0;
    registrationNameModules[registrationName] = pluginModule;
    registrationNameDependencies[registrationName] = pluginModule.eventTypes[eventName].dependencies;
    {
      var lowerCasedName = registrationName.toLowerCase();
      possibleRegistrationNames[lowerCasedName] = registrationName;
      if (registrationName === "onDoubleClick") {
        possibleRegistrationNames.ondblclick = registrationName;
      }
    }
  }
  var plugins = [];
  var eventNameDispatchConfigs = {};
  var registrationNameModules = {};
  var registrationNameDependencies = {};
  var possibleRegistrationNames = {};
  function injectEventPluginOrder(injectedEventPluginOrder) {
    !!eventPluginOrder ? invariant(false, "EventPluginRegistry: Cannot inject event plugin ordering more than once. You are likely trying to load more than one copy of React.") : void 0;
    eventPluginOrder = Array.prototype.slice.call(injectedEventPluginOrder);
    recomputePluginOrdering();
  }
  function injectEventPluginsByName(injectedNamesToPlugins) {
    var isOrderingDirty = false;
    for (var pluginName in injectedNamesToPlugins) {
      if (!injectedNamesToPlugins.hasOwnProperty(pluginName)) {
        continue;
      }
      var pluginModule = injectedNamesToPlugins[pluginName];
      if (!namesToPlugins.hasOwnProperty(pluginName) || namesToPlugins[pluginName] !== pluginModule) {
        !!namesToPlugins[pluginName] ? invariant(false, "EventPluginRegistry: Cannot inject two different event plugins using the same name, `%s`.", pluginName) : void 0;
        namesToPlugins[pluginName] = pluginModule;
        isOrderingDirty = true;
      }
    }
    if (isOrderingDirty) {
      recomputePluginOrdering();
    }
  }
  var warningWithoutStack = function() {
  };
  {
    warningWithoutStack = function(condition, format) {
      for (var _len = arguments.length, args = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
        args[_key - 2] = arguments[_key];
      }
      if (format === void 0) {
        throw new Error("`warningWithoutStack(condition, format, ...args)` requires a warning message argument");
      }
      if (args.length > 8) {
        throw new Error("warningWithoutStack() currently supports at most 8 arguments.");
      }
      if (condition) {
        return;
      }
      if (typeof console !== "undefined") {
        var argsWithFormat = args.map(function(item) {
          return "" + item;
        });
        argsWithFormat.unshift("Warning: " + format);
        Function.prototype.apply.call(console.error, console, argsWithFormat);
      }
      try {
        var argIndex = 0;
        var message = "Warning: " + format.replace(/%s/g, function() {
          return args[argIndex++];
        });
        throw new Error(message);
      } catch (x) {
      }
    };
  }
  var warningWithoutStack$1 = warningWithoutStack;
  var getFiberCurrentPropsFromNode = null;
  var getInstanceFromNode = null;
  var getNodeFromInstance = null;
  function setComponentTree(getFiberCurrentPropsFromNodeImpl, getInstanceFromNodeImpl, getNodeFromInstanceImpl) {
    getFiberCurrentPropsFromNode = getFiberCurrentPropsFromNodeImpl;
    getInstanceFromNode = getInstanceFromNodeImpl;
    getNodeFromInstance = getNodeFromInstanceImpl;
    {
      !(getNodeFromInstance && getInstanceFromNode) ? warningWithoutStack$1(false, "EventPluginUtils.setComponentTree(...): Injected module is missing getNodeFromInstance or getInstanceFromNode.") : void 0;
    }
  }
  var validateEventDispatches = void 0;
  {
    validateEventDispatches = function(event) {
      var dispatchListeners = event._dispatchListeners;
      var dispatchInstances = event._dispatchInstances;
      var listenersIsArr = Array.isArray(dispatchListeners);
      var listenersLen = listenersIsArr ? dispatchListeners.length : dispatchListeners ? 1 : 0;
      var instancesIsArr = Array.isArray(dispatchInstances);
      var instancesLen = instancesIsArr ? dispatchInstances.length : dispatchInstances ? 1 : 0;
      !(instancesIsArr === listenersIsArr && instancesLen === listenersLen) ? warningWithoutStack$1(false, "EventPluginUtils: Invalid `event`.") : void 0;
    };
  }
  function executeDispatch(event, listener, inst) {
    var type = event.type || "unknown-event";
    event.currentTarget = getNodeFromInstance(inst);
    invokeGuardedCallbackAndCatchFirstError(type, listener, void 0, event);
    event.currentTarget = null;
  }
  function executeDispatchesInOrder(event) {
    var dispatchListeners = event._dispatchListeners;
    var dispatchInstances = event._dispatchInstances;
    {
      validateEventDispatches(event);
    }
    if (Array.isArray(dispatchListeners)) {
      for (var i = 0; i < dispatchListeners.length; i++) {
        if (event.isPropagationStopped()) {
          break;
        }
        executeDispatch(event, dispatchListeners[i], dispatchInstances[i]);
      }
    } else if (dispatchListeners) {
      executeDispatch(event, dispatchListeners, dispatchInstances);
    }
    event._dispatchListeners = null;
    event._dispatchInstances = null;
  }
  function accumulateInto(current2, next) {
    !(next != null) ? invariant(false, "accumulateInto(...): Accumulated items must not be null or undefined.") : void 0;
    if (current2 == null) {
      return next;
    }
    if (Array.isArray(current2)) {
      if (Array.isArray(next)) {
        current2.push.apply(current2, next);
        return current2;
      }
      current2.push(next);
      return current2;
    }
    if (Array.isArray(next)) {
      return [current2].concat(next);
    }
    return [current2, next];
  }
  function forEachAccumulated(arr, cb, scope) {
    if (Array.isArray(arr)) {
      arr.forEach(cb, scope);
    } else if (arr) {
      cb.call(scope, arr);
    }
  }
  var eventQueue = null;
  var executeDispatchesAndRelease = function(event) {
    if (event) {
      executeDispatchesInOrder(event);
      if (!event.isPersistent()) {
        event.constructor.release(event);
      }
    }
  };
  var executeDispatchesAndReleaseTopLevel = function(e) {
    return executeDispatchesAndRelease(e);
  };
  function isInteractive(tag) {
    return tag === "button" || tag === "input" || tag === "select" || tag === "textarea";
  }
  function shouldPreventMouseEvent(name, type, props) {
    switch (name) {
      case "onClick":
      case "onClickCapture":
      case "onDoubleClick":
      case "onDoubleClickCapture":
      case "onMouseDown":
      case "onMouseDownCapture":
      case "onMouseMove":
      case "onMouseMoveCapture":
      case "onMouseUp":
      case "onMouseUpCapture":
        return !!(props.disabled && isInteractive(type));
      default:
        return false;
    }
  }
  var injection = {
    /**
     * @param {array} InjectedEventPluginOrder
     * @public
     */
    injectEventPluginOrder,
    /**
     * @param {object} injectedNamesToPlugins Map from names to plugin modules.
     */
    injectEventPluginsByName
  };
  function getListener(inst, registrationName) {
    var listener = void 0;
    var stateNode = inst.stateNode;
    if (!stateNode) {
      return null;
    }
    var props = getFiberCurrentPropsFromNode(stateNode);
    if (!props) {
      return null;
    }
    listener = props[registrationName];
    if (shouldPreventMouseEvent(registrationName, inst.type, props)) {
      return null;
    }
    !(!listener || typeof listener === "function") ? invariant(false, "Expected `%s` listener to be a function, instead got a value of `%s` type.", registrationName, typeof listener) : void 0;
    return listener;
  }
  function extractEvents(topLevelType, targetInst, nativeEvent, nativeEventTarget) {
    var events = null;
    for (var i = 0; i < plugins.length; i++) {
      var possiblePlugin = plugins[i];
      if (possiblePlugin) {
        var extractedEvents = possiblePlugin.extractEvents(topLevelType, targetInst, nativeEvent, nativeEventTarget);
        if (extractedEvents) {
          events = accumulateInto(events, extractedEvents);
        }
      }
    }
    return events;
  }
  function runEventsInBatch(events) {
    if (events !== null) {
      eventQueue = accumulateInto(eventQueue, events);
    }
    var processingEventQueue = eventQueue;
    eventQueue = null;
    if (!processingEventQueue) {
      return;
    }
    forEachAccumulated(processingEventQueue, executeDispatchesAndReleaseTopLevel);
    !!eventQueue ? invariant(false, "processEventQueue(): Additional events were enqueued while processing an event queue. Support for this has not yet been implemented.") : void 0;
    rethrowCaughtError();
  }
  function runExtractedEventsInBatch(topLevelType, targetInst, nativeEvent, nativeEventTarget) {
    var events = extractEvents(topLevelType, targetInst, nativeEvent, nativeEventTarget);
    runEventsInBatch(events);
  }
  var FunctionComponent = 0;
  var ClassComponent = 1;
  var IndeterminateComponent = 2;
  var HostRoot = 3;
  var HostPortal = 4;
  var HostComponent = 5;
  var HostText = 6;
  var Fragment = 7;
  var Mode = 8;
  var ContextConsumer = 9;
  var ContextProvider = 10;
  var ForwardRef = 11;
  var Profiler = 12;
  var SuspenseComponent = 13;
  var MemoComponent = 14;
  var SimpleMemoComponent = 15;
  var LazyComponent = 16;
  var IncompleteClassComponent = 17;
  var randomKey = Math.random().toString(36).slice(2);
  var internalInstanceKey = "__reactInternalInstance$" + randomKey;
  var internalEventHandlersKey = "__reactEventHandlers$" + randomKey;
  function precacheFiberNode(hostInst, node) {
    node[internalInstanceKey] = hostInst;
  }
  function getClosestInstanceFromNode(node) {
    if (node[internalInstanceKey]) {
      return node[internalInstanceKey];
    }
    while (!node[internalInstanceKey]) {
      if (node.parentNode) {
        node = node.parentNode;
      } else {
        return null;
      }
    }
    var inst = node[internalInstanceKey];
    if (inst.tag === HostComponent || inst.tag === HostText) {
      return inst;
    }
    return null;
  }
  function getInstanceFromNode$1(node) {
    var inst = node[internalInstanceKey];
    if (inst) {
      if (inst.tag === HostComponent || inst.tag === HostText) {
        return inst;
      } else {
        return null;
      }
    }
    return null;
  }
  function getNodeFromInstance$1(inst) {
    if (inst.tag === HostComponent || inst.tag === HostText) {
      return inst.stateNode;
    }
    invariant(false, "getNodeFromInstance: Invalid argument.");
  }
  function getFiberCurrentPropsFromNode$1(node) {
    return node[internalEventHandlersKey] || null;
  }
  function updateFiberProps(node, props) {
    node[internalEventHandlersKey] = props;
  }
  function getParent(inst) {
    do {
      inst = inst.return;
    } while (inst && inst.tag !== HostComponent);
    if (inst) {
      return inst;
    }
    return null;
  }
  function getLowestCommonAncestor(instA, instB) {
    var depthA = 0;
    for (var tempA = instA; tempA; tempA = getParent(tempA)) {
      depthA++;
    }
    var depthB = 0;
    for (var tempB = instB; tempB; tempB = getParent(tempB)) {
      depthB++;
    }
    while (depthA - depthB > 0) {
      instA = getParent(instA);
      depthA--;
    }
    while (depthB - depthA > 0) {
      instB = getParent(instB);
      depthB--;
    }
    var depth = depthA;
    while (depth--) {
      if (instA === instB || instA === instB.alternate) {
        return instA;
      }
      instA = getParent(instA);
      instB = getParent(instB);
    }
    return null;
  }
  function traverseTwoPhase(inst, fn, arg) {
    var path = [];
    while (inst) {
      path.push(inst);
      inst = getParent(inst);
    }
    var i = void 0;
    for (i = path.length; i-- > 0; ) {
      fn(path[i], "captured", arg);
    }
    for (i = 0; i < path.length; i++) {
      fn(path[i], "bubbled", arg);
    }
  }
  function traverseEnterLeave(from, to, fn, argFrom, argTo) {
    var common = from && to ? getLowestCommonAncestor(from, to) : null;
    var pathFrom = [];
    while (true) {
      if (!from) {
        break;
      }
      if (from === common) {
        break;
      }
      var alternate = from.alternate;
      if (alternate !== null && alternate === common) {
        break;
      }
      pathFrom.push(from);
      from = getParent(from);
    }
    var pathTo = [];
    while (true) {
      if (!to) {
        break;
      }
      if (to === common) {
        break;
      }
      var _alternate = to.alternate;
      if (_alternate !== null && _alternate === common) {
        break;
      }
      pathTo.push(to);
      to = getParent(to);
    }
    for (var i = 0; i < pathFrom.length; i++) {
      fn(pathFrom[i], "bubbled", argFrom);
    }
    for (var _i = pathTo.length; _i-- > 0; ) {
      fn(pathTo[_i], "captured", argTo);
    }
  }
  function listenerAtPhase(inst, event, propagationPhase) {
    var registrationName = event.dispatchConfig.phasedRegistrationNames[propagationPhase];
    return getListener(inst, registrationName);
  }
  function accumulateDirectionalDispatches(inst, phase2, event) {
    {
      !inst ? warningWithoutStack$1(false, "Dispatching inst must not be null") : void 0;
    }
    var listener = listenerAtPhase(inst, event, phase2);
    if (listener) {
      event._dispatchListeners = accumulateInto(event._dispatchListeners, listener);
      event._dispatchInstances = accumulateInto(event._dispatchInstances, inst);
    }
  }
  function accumulateTwoPhaseDispatchesSingle(event) {
    if (event && event.dispatchConfig.phasedRegistrationNames) {
      traverseTwoPhase(event._targetInst, accumulateDirectionalDispatches, event);
    }
  }
  function accumulateDispatches(inst, ignoredDirection, event) {
    if (inst && event && event.dispatchConfig.registrationName) {
      var registrationName = event.dispatchConfig.registrationName;
      var listener = getListener(inst, registrationName);
      if (listener) {
        event._dispatchListeners = accumulateInto(event._dispatchListeners, listener);
        event._dispatchInstances = accumulateInto(event._dispatchInstances, inst);
      }
    }
  }
  function accumulateDirectDispatchesSingle(event) {
    if (event && event.dispatchConfig.registrationName) {
      accumulateDispatches(event._targetInst, null, event);
    }
  }
  function accumulateTwoPhaseDispatches(events) {
    forEachAccumulated(events, accumulateTwoPhaseDispatchesSingle);
  }
  function accumulateEnterLeaveDispatches(leave, enter, from, to) {
    traverseEnterLeave(from, to, accumulateDispatches, leave, enter);
  }
  function accumulateDirectDispatches(events) {
    forEachAccumulated(events, accumulateDirectDispatchesSingle);
  }
  var canUseDOM = !!(typeof window !== "undefined" && window.document && window.document.createElement);
  function unsafeCastStringToDOMTopLevelType(topLevelType) {
    return topLevelType;
  }
  function unsafeCastDOMTopLevelTypeToString(topLevelType) {
    return topLevelType;
  }
  function makePrefixMap(styleProp, eventName) {
    var prefixes2 = {};
    prefixes2[styleProp.toLowerCase()] = eventName.toLowerCase();
    prefixes2["Webkit" + styleProp] = "webkit" + eventName;
    prefixes2["Moz" + styleProp] = "moz" + eventName;
    return prefixes2;
  }
  var vendorPrefixes = {
    animationend: makePrefixMap("Animation", "AnimationEnd"),
    animationiteration: makePrefixMap("Animation", "AnimationIteration"),
    animationstart: makePrefixMap("Animation", "AnimationStart"),
    transitionend: makePrefixMap("Transition", "TransitionEnd")
  };
  var prefixedEventNames = {};
  var style = {};
  if (canUseDOM) {
    style = document.createElement("div").style;
    if (!("AnimationEvent" in window)) {
      delete vendorPrefixes.animationend.animation;
      delete vendorPrefixes.animationiteration.animation;
      delete vendorPrefixes.animationstart.animation;
    }
    if (!("TransitionEvent" in window)) {
      delete vendorPrefixes.transitionend.transition;
    }
  }
  function getVendorPrefixedEventName(eventName) {
    if (prefixedEventNames[eventName]) {
      return prefixedEventNames[eventName];
    } else if (!vendorPrefixes[eventName]) {
      return eventName;
    }
    var prefixMap = vendorPrefixes[eventName];
    for (var styleProp in prefixMap) {
      if (prefixMap.hasOwnProperty(styleProp) && styleProp in style) {
        return prefixedEventNames[eventName] = prefixMap[styleProp];
      }
    }
    return eventName;
  }
  var TOP_ABORT = unsafeCastStringToDOMTopLevelType("abort");
  var TOP_ANIMATION_END = unsafeCastStringToDOMTopLevelType(getVendorPrefixedEventName("animationend"));
  var TOP_ANIMATION_ITERATION = unsafeCastStringToDOMTopLevelType(getVendorPrefixedEventName("animationiteration"));
  var TOP_ANIMATION_START = unsafeCastStringToDOMTopLevelType(getVendorPrefixedEventName("animationstart"));
  var TOP_BLUR = unsafeCastStringToDOMTopLevelType("blur");
  var TOP_CAN_PLAY = unsafeCastStringToDOMTopLevelType("canplay");
  var TOP_CAN_PLAY_THROUGH = unsafeCastStringToDOMTopLevelType("canplaythrough");
  var TOP_CANCEL = unsafeCastStringToDOMTopLevelType("cancel");
  var TOP_CHANGE = unsafeCastStringToDOMTopLevelType("change");
  var TOP_CLICK = unsafeCastStringToDOMTopLevelType("click");
  var TOP_CLOSE = unsafeCastStringToDOMTopLevelType("close");
  var TOP_COMPOSITION_END = unsafeCastStringToDOMTopLevelType("compositionend");
  var TOP_COMPOSITION_START = unsafeCastStringToDOMTopLevelType("compositionstart");
  var TOP_COMPOSITION_UPDATE = unsafeCastStringToDOMTopLevelType("compositionupdate");
  var TOP_CONTEXT_MENU = unsafeCastStringToDOMTopLevelType("contextmenu");
  var TOP_COPY = unsafeCastStringToDOMTopLevelType("copy");
  var TOP_CUT = unsafeCastStringToDOMTopLevelType("cut");
  var TOP_DOUBLE_CLICK = unsafeCastStringToDOMTopLevelType("dblclick");
  var TOP_AUX_CLICK = unsafeCastStringToDOMTopLevelType("auxclick");
  var TOP_DRAG = unsafeCastStringToDOMTopLevelType("drag");
  var TOP_DRAG_END = unsafeCastStringToDOMTopLevelType("dragend");
  var TOP_DRAG_ENTER = unsafeCastStringToDOMTopLevelType("dragenter");
  var TOP_DRAG_EXIT = unsafeCastStringToDOMTopLevelType("dragexit");
  var TOP_DRAG_LEAVE = unsafeCastStringToDOMTopLevelType("dragleave");
  var TOP_DRAG_OVER = unsafeCastStringToDOMTopLevelType("dragover");
  var TOP_DRAG_START = unsafeCastStringToDOMTopLevelType("dragstart");
  var TOP_DROP = unsafeCastStringToDOMTopLevelType("drop");
  var TOP_DURATION_CHANGE = unsafeCastStringToDOMTopLevelType("durationchange");
  var TOP_EMPTIED = unsafeCastStringToDOMTopLevelType("emptied");
  var TOP_ENCRYPTED = unsafeCastStringToDOMTopLevelType("encrypted");
  var TOP_ENDED = unsafeCastStringToDOMTopLevelType("ended");
  var TOP_ERROR = unsafeCastStringToDOMTopLevelType("error");
  var TOP_FOCUS = unsafeCastStringToDOMTopLevelType("focus");
  var TOP_GOT_POINTER_CAPTURE = unsafeCastStringToDOMTopLevelType("gotpointercapture");
  var TOP_INPUT = unsafeCastStringToDOMTopLevelType("input");
  var TOP_INVALID = unsafeCastStringToDOMTopLevelType("invalid");
  var TOP_KEY_DOWN = unsafeCastStringToDOMTopLevelType("keydown");
  var TOP_KEY_PRESS = unsafeCastStringToDOMTopLevelType("keypress");
  var TOP_KEY_UP = unsafeCastStringToDOMTopLevelType("keyup");
  var TOP_LOAD = unsafeCastStringToDOMTopLevelType("load");
  var TOP_LOAD_START = unsafeCastStringToDOMTopLevelType("loadstart");
  var TOP_LOADED_DATA = unsafeCastStringToDOMTopLevelType("loadeddata");
  var TOP_LOADED_METADATA = unsafeCastStringToDOMTopLevelType("loadedmetadata");
  var TOP_LOST_POINTER_CAPTURE = unsafeCastStringToDOMTopLevelType("lostpointercapture");
  var TOP_MOUSE_DOWN = unsafeCastStringToDOMTopLevelType("mousedown");
  var TOP_MOUSE_MOVE = unsafeCastStringToDOMTopLevelType("mousemove");
  var TOP_MOUSE_OUT = unsafeCastStringToDOMTopLevelType("mouseout");
  var TOP_MOUSE_OVER = unsafeCastStringToDOMTopLevelType("mouseover");
  var TOP_MOUSE_UP = unsafeCastStringToDOMTopLevelType("mouseup");
  var TOP_PASTE = unsafeCastStringToDOMTopLevelType("paste");
  var TOP_PAUSE = unsafeCastStringToDOMTopLevelType("pause");
  var TOP_PLAY = unsafeCastStringToDOMTopLevelType("play");
  var TOP_PLAYING = unsafeCastStringToDOMTopLevelType("playing");
  var TOP_POINTER_CANCEL = unsafeCastStringToDOMTopLevelType("pointercancel");
  var TOP_POINTER_DOWN = unsafeCastStringToDOMTopLevelType("pointerdown");
  var TOP_POINTER_MOVE = unsafeCastStringToDOMTopLevelType("pointermove");
  var TOP_POINTER_OUT = unsafeCastStringToDOMTopLevelType("pointerout");
  var TOP_POINTER_OVER = unsafeCastStringToDOMTopLevelType("pointerover");
  var TOP_POINTER_UP = unsafeCastStringToDOMTopLevelType("pointerup");
  var TOP_PROGRESS = unsafeCastStringToDOMTopLevelType("progress");
  var TOP_RATE_CHANGE = unsafeCastStringToDOMTopLevelType("ratechange");
  var TOP_RESET = unsafeCastStringToDOMTopLevelType("reset");
  var TOP_SCROLL = unsafeCastStringToDOMTopLevelType("scroll");
  var TOP_SEEKED = unsafeCastStringToDOMTopLevelType("seeked");
  var TOP_SEEKING = unsafeCastStringToDOMTopLevelType("seeking");
  var TOP_SELECTION_CHANGE = unsafeCastStringToDOMTopLevelType("selectionchange");
  var TOP_STALLED = unsafeCastStringToDOMTopLevelType("stalled");
  var TOP_SUBMIT = unsafeCastStringToDOMTopLevelType("submit");
  var TOP_SUSPEND = unsafeCastStringToDOMTopLevelType("suspend");
  var TOP_TEXT_INPUT = unsafeCastStringToDOMTopLevelType("textInput");
  var TOP_TIME_UPDATE = unsafeCastStringToDOMTopLevelType("timeupdate");
  var TOP_TOGGLE = unsafeCastStringToDOMTopLevelType("toggle");
  var TOP_TOUCH_CANCEL = unsafeCastStringToDOMTopLevelType("touchcancel");
  var TOP_TOUCH_END = unsafeCastStringToDOMTopLevelType("touchend");
  var TOP_TOUCH_MOVE = unsafeCastStringToDOMTopLevelType("touchmove");
  var TOP_TOUCH_START = unsafeCastStringToDOMTopLevelType("touchstart");
  var TOP_TRANSITION_END = unsafeCastStringToDOMTopLevelType(getVendorPrefixedEventName("transitionend"));
  var TOP_VOLUME_CHANGE = unsafeCastStringToDOMTopLevelType("volumechange");
  var TOP_WAITING = unsafeCastStringToDOMTopLevelType("waiting");
  var TOP_WHEEL = unsafeCastStringToDOMTopLevelType("wheel");
  var mediaEventTypes = [TOP_ABORT, TOP_CAN_PLAY, TOP_CAN_PLAY_THROUGH, TOP_DURATION_CHANGE, TOP_EMPTIED, TOP_ENCRYPTED, TOP_ENDED, TOP_ERROR, TOP_LOADED_DATA, TOP_LOADED_METADATA, TOP_LOAD_START, TOP_PAUSE, TOP_PLAY, TOP_PLAYING, TOP_PROGRESS, TOP_RATE_CHANGE, TOP_SEEKED, TOP_SEEKING, TOP_STALLED, TOP_SUSPEND, TOP_TIME_UPDATE, TOP_VOLUME_CHANGE, TOP_WAITING];
  function getRawEventName(topLevelType) {
    return unsafeCastDOMTopLevelTypeToString(topLevelType);
  }
  var root = null;
  var startText = null;
  var fallbackText = null;
  function initialize(nativeEventTarget) {
    root = nativeEventTarget;
    startText = getText();
    return true;
  }
  function reset() {
    root = null;
    startText = null;
    fallbackText = null;
  }
  function getData() {
    if (fallbackText) {
      return fallbackText;
    }
    var start = void 0;
    var startValue = startText;
    var startLength = startValue.length;
    var end = void 0;
    var endValue = getText();
    var endLength = endValue.length;
    for (start = 0; start < startLength; start++) {
      if (startValue[start] !== endValue[start]) {
        break;
      }
    }
    var minEnd = startLength - start;
    for (end = 1; end <= minEnd; end++) {
      if (startValue[startLength - end] !== endValue[endLength - end]) {
        break;
      }
    }
    var sliceTail = end > 1 ? 1 - end : void 0;
    fallbackText = endValue.slice(start, sliceTail);
    return fallbackText;
  }
  function getText() {
    if ("value" in root) {
      return root.value;
    }
    return root.textContent;
  }
  var ReactInternals = React2.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED;
  var _assign = ReactInternals.assign;
  var EVENT_POOL_SIZE = 10;
  var EventInterface = {
    type: null,
    target: null,
    // currentTarget is set when dispatching; no use in copying it here
    currentTarget: function() {
      return null;
    },
    eventPhase: null,
    bubbles: null,
    cancelable: null,
    timeStamp: function(event) {
      return event.timeStamp || Date.now();
    },
    defaultPrevented: null,
    isTrusted: null
  };
  function functionThatReturnsTrue() {
    return true;
  }
  function functionThatReturnsFalse() {
    return false;
  }
  function SyntheticEvent(dispatchConfig, targetInst, nativeEvent, nativeEventTarget) {
    {
      delete this.nativeEvent;
      delete this.preventDefault;
      delete this.stopPropagation;
      delete this.isDefaultPrevented;
      delete this.isPropagationStopped;
    }
    this.dispatchConfig = dispatchConfig;
    this._targetInst = targetInst;
    this.nativeEvent = nativeEvent;
    var Interface = this.constructor.Interface;
    for (var propName in Interface) {
      if (!Interface.hasOwnProperty(propName)) {
        continue;
      }
      {
        delete this[propName];
      }
      var normalize = Interface[propName];
      if (normalize) {
        this[propName] = normalize(nativeEvent);
      } else {
        if (propName === "target") {
          this.target = nativeEventTarget;
        } else {
          this[propName] = nativeEvent[propName];
        }
      }
    }
    var defaultPrevented = nativeEvent.defaultPrevented != null ? nativeEvent.defaultPrevented : nativeEvent.returnValue === false;
    if (defaultPrevented) {
      this.isDefaultPrevented = functionThatReturnsTrue;
    } else {
      this.isDefaultPrevented = functionThatReturnsFalse;
    }
    this.isPropagationStopped = functionThatReturnsFalse;
    return this;
  }
  _assign(SyntheticEvent.prototype, {
    preventDefault: function() {
      this.defaultPrevented = true;
      var event = this.nativeEvent;
      if (!event) {
        return;
      }
      if (event.preventDefault) {
        event.preventDefault();
      } else if (typeof event.returnValue !== "unknown") {
        event.returnValue = false;
      }
      this.isDefaultPrevented = functionThatReturnsTrue;
    },
    stopPropagation: function() {
      var event = this.nativeEvent;
      if (!event) {
        return;
      }
      if (event.stopPropagation) {
        event.stopPropagation();
      } else if (typeof event.cancelBubble !== "unknown") {
        event.cancelBubble = true;
      }
      this.isPropagationStopped = functionThatReturnsTrue;
    },
    /**
     * We release all dispatched `SyntheticEvent`s after each event loop, adding
     * them back into the pool. This allows a way to hold onto a reference that
     * won't be added back into the pool.
     */
    persist: function() {
      this.isPersistent = functionThatReturnsTrue;
    },
    /**
     * Checks if this event should be released back into the pool.
     *
     * @return {boolean} True if this should not be released, false otherwise.
     */
    isPersistent: functionThatReturnsFalse,
    /**
     * `PooledClass` looks for `destructor` on each instance it releases.
     */
    destructor: function() {
      var Interface = this.constructor.Interface;
      for (var propName in Interface) {
        {
          Object.defineProperty(this, propName, getPooledWarningPropertyDefinition(propName, Interface[propName]));
        }
      }
      this.dispatchConfig = null;
      this._targetInst = null;
      this.nativeEvent = null;
      this.isDefaultPrevented = functionThatReturnsFalse;
      this.isPropagationStopped = functionThatReturnsFalse;
      this._dispatchListeners = null;
      this._dispatchInstances = null;
      {
        Object.defineProperty(this, "nativeEvent", getPooledWarningPropertyDefinition("nativeEvent", null));
        Object.defineProperty(this, "isDefaultPrevented", getPooledWarningPropertyDefinition("isDefaultPrevented", functionThatReturnsFalse));
        Object.defineProperty(this, "isPropagationStopped", getPooledWarningPropertyDefinition("isPropagationStopped", functionThatReturnsFalse));
        Object.defineProperty(this, "preventDefault", getPooledWarningPropertyDefinition("preventDefault", function() {
        }));
        Object.defineProperty(this, "stopPropagation", getPooledWarningPropertyDefinition("stopPropagation", function() {
        }));
      }
    }
  });
  SyntheticEvent.Interface = EventInterface;
  SyntheticEvent.extend = function(Interface) {
    var Super = this;
    var E = function() {
    };
    E.prototype = Super.prototype;
    var prototype = new E();
    function Class() {
      return Super.apply(this, arguments);
    }
    _assign(prototype, Class.prototype);
    Class.prototype = prototype;
    Class.prototype.constructor = Class;
    Class.Interface = _assign({}, Super.Interface, Interface);
    Class.extend = Super.extend;
    addEventPoolingTo(Class);
    return Class;
  };
  addEventPoolingTo(SyntheticEvent);
  function getPooledWarningPropertyDefinition(propName, getVal) {
    var isFunction = typeof getVal === "function";
    return {
      configurable: true,
      set: set2,
      get: get2
    };
    function set2(val) {
      var action = isFunction ? "setting the method" : "setting the property";
      warn(action, "This is effectively a no-op");
      return val;
    }
    function get2() {
      var action = isFunction ? "accessing the method" : "accessing the property";
      var result = isFunction ? "This is a no-op function" : "This is set to null";
      warn(action, result);
      return getVal;
    }
    function warn(action, result) {
      var warningCondition = false;
      !warningCondition ? warningWithoutStack$1(false, "This synthetic event is reused for performance reasons. If you're seeing this, you're %s `%s` on a released/nullified synthetic event. %s. If you must keep the original synthetic event around, use event.persist(). See https://fb.me/react-event-pooling for more information.", action, propName, result) : void 0;
    }
  }
  function getPooledEvent(dispatchConfig, targetInst, nativeEvent, nativeInst) {
    var EventConstructor = this;
    if (EventConstructor.eventPool.length) {
      var instance = EventConstructor.eventPool.pop();
      EventConstructor.call(instance, dispatchConfig, targetInst, nativeEvent, nativeInst);
      return instance;
    }
    return new EventConstructor(dispatchConfig, targetInst, nativeEvent, nativeInst);
  }
  function releasePooledEvent(event) {
    var EventConstructor = this;
    !(event instanceof EventConstructor) ? invariant(false, "Trying to release an event instance into a pool of a different type.") : void 0;
    event.destructor();
    if (EventConstructor.eventPool.length < EVENT_POOL_SIZE) {
      EventConstructor.eventPool.push(event);
    }
  }
  function addEventPoolingTo(EventConstructor) {
    EventConstructor.eventPool = [];
    EventConstructor.getPooled = getPooledEvent;
    EventConstructor.release = releasePooledEvent;
  }
  var SyntheticCompositionEvent = SyntheticEvent.extend({
    data: null
  });
  var SyntheticInputEvent = SyntheticEvent.extend({
    data: null
  });
  var END_KEYCODES = [9, 13, 27, 32];
  var START_KEYCODE = 229;
  var canUseCompositionEvent = canUseDOM && "CompositionEvent" in window;
  var documentMode = null;
  if (canUseDOM && "documentMode" in document) {
    documentMode = document.documentMode;
  }
  var canUseTextInputEvent = canUseDOM && "TextEvent" in window && !documentMode;
  var useFallbackCompositionData = canUseDOM && (!canUseCompositionEvent || documentMode && documentMode > 8 && documentMode <= 11);
  var SPACEBAR_CODE = 32;
  var SPACEBAR_CHAR = String.fromCharCode(SPACEBAR_CODE);
  var eventTypes = {
    beforeInput: {
      phasedRegistrationNames: {
        bubbled: "onBeforeInput",
        captured: "onBeforeInputCapture"
      },
      dependencies: [TOP_COMPOSITION_END, TOP_KEY_PRESS, TOP_TEXT_INPUT, TOP_PASTE]
    },
    compositionEnd: {
      phasedRegistrationNames: {
        bubbled: "onCompositionEnd",
        captured: "onCompositionEndCapture"
      },
      dependencies: [TOP_BLUR, TOP_COMPOSITION_END, TOP_KEY_DOWN, TOP_KEY_PRESS, TOP_KEY_UP, TOP_MOUSE_DOWN]
    },
    compositionStart: {
      phasedRegistrationNames: {
        bubbled: "onCompositionStart",
        captured: "onCompositionStartCapture"
      },
      dependencies: [TOP_BLUR, TOP_COMPOSITION_START, TOP_KEY_DOWN, TOP_KEY_PRESS, TOP_KEY_UP, TOP_MOUSE_DOWN]
    },
    compositionUpdate: {
      phasedRegistrationNames: {
        bubbled: "onCompositionUpdate",
        captured: "onCompositionUpdateCapture"
      },
      dependencies: [TOP_BLUR, TOP_COMPOSITION_UPDATE, TOP_KEY_DOWN, TOP_KEY_PRESS, TOP_KEY_UP, TOP_MOUSE_DOWN]
    }
  };
  var hasSpaceKeypress = false;
  function isKeypressCommand(nativeEvent) {
    return (nativeEvent.ctrlKey || nativeEvent.altKey || nativeEvent.metaKey) && // ctrlKey && altKey is equivalent to AltGr, and is not a command.
    !(nativeEvent.ctrlKey && nativeEvent.altKey);
  }
  function getCompositionEventType(topLevelType) {
    switch (topLevelType) {
      case TOP_COMPOSITION_START:
        return eventTypes.compositionStart;
      case TOP_COMPOSITION_END:
        return eventTypes.compositionEnd;
      case TOP_COMPOSITION_UPDATE:
        return eventTypes.compositionUpdate;
    }
  }
  function isFallbackCompositionStart(topLevelType, nativeEvent) {
    return topLevelType === TOP_KEY_DOWN && nativeEvent.keyCode === START_KEYCODE;
  }
  function isFallbackCompositionEnd(topLevelType, nativeEvent) {
    switch (topLevelType) {
      case TOP_KEY_UP:
        return END_KEYCODES.indexOf(nativeEvent.keyCode) !== -1;
      case TOP_KEY_DOWN:
        return nativeEvent.keyCode !== START_KEYCODE;
      case TOP_KEY_PRESS:
      case TOP_MOUSE_DOWN:
      case TOP_BLUR:
        return true;
      default:
        return false;
    }
  }
  function getDataFromCustomEvent(nativeEvent) {
    var detail = nativeEvent.detail;
    if (typeof detail === "object" && "data" in detail) {
      return detail.data;
    }
    return null;
  }
  function isUsingKoreanIME(nativeEvent) {
    return nativeEvent.locale === "ko";
  }
  var isComposing = false;
  function extractCompositionEvent(topLevelType, targetInst, nativeEvent, nativeEventTarget) {
    var eventType = void 0;
    var fallbackData = void 0;
    if (canUseCompositionEvent) {
      eventType = getCompositionEventType(topLevelType);
    } else if (!isComposing) {
      if (isFallbackCompositionStart(topLevelType, nativeEvent)) {
        eventType = eventTypes.compositionStart;
      }
    } else if (isFallbackCompositionEnd(topLevelType, nativeEvent)) {
      eventType = eventTypes.compositionEnd;
    }
    if (!eventType) {
      return null;
    }
    if (useFallbackCompositionData && !isUsingKoreanIME(nativeEvent)) {
      if (!isComposing && eventType === eventTypes.compositionStart) {
        isComposing = initialize(nativeEventTarget);
      } else if (eventType === eventTypes.compositionEnd) {
        if (isComposing) {
          fallbackData = getData();
        }
      }
    }
    var event = SyntheticCompositionEvent.getPooled(eventType, targetInst, nativeEvent, nativeEventTarget);
    if (fallbackData) {
      event.data = fallbackData;
    } else {
      var customData = getDataFromCustomEvent(nativeEvent);
      if (customData !== null) {
        event.data = customData;
      }
    }
    accumulateTwoPhaseDispatches(event);
    return event;
  }
  function getNativeBeforeInputChars(topLevelType, nativeEvent) {
    switch (topLevelType) {
      case TOP_COMPOSITION_END:
        return getDataFromCustomEvent(nativeEvent);
      case TOP_KEY_PRESS:
        var which = nativeEvent.which;
        if (which !== SPACEBAR_CODE) {
          return null;
        }
        hasSpaceKeypress = true;
        return SPACEBAR_CHAR;
      case TOP_TEXT_INPUT:
        var chars = nativeEvent.data;
        if (chars === SPACEBAR_CHAR && hasSpaceKeypress) {
          return null;
        }
        return chars;
      default:
        return null;
    }
  }
  function getFallbackBeforeInputChars(topLevelType, nativeEvent) {
    if (isComposing) {
      if (topLevelType === TOP_COMPOSITION_END || !canUseCompositionEvent && isFallbackCompositionEnd(topLevelType, nativeEvent)) {
        var chars = getData();
        reset();
        isComposing = false;
        return chars;
      }
      return null;
    }
    switch (topLevelType) {
      case TOP_PASTE:
        return null;
      case TOP_KEY_PRESS:
        if (!isKeypressCommand(nativeEvent)) {
          if (nativeEvent.char && nativeEvent.char.length > 1) {
            return nativeEvent.char;
          } else if (nativeEvent.which) {
            return String.fromCharCode(nativeEvent.which);
          }
        }
        return null;
      case TOP_COMPOSITION_END:
        return useFallbackCompositionData && !isUsingKoreanIME(nativeEvent) ? null : nativeEvent.data;
      default:
        return null;
    }
  }
  function extractBeforeInputEvent(topLevelType, targetInst, nativeEvent, nativeEventTarget) {
    var chars = void 0;
    if (canUseTextInputEvent) {
      chars = getNativeBeforeInputChars(topLevelType, nativeEvent);
    } else {
      chars = getFallbackBeforeInputChars(topLevelType, nativeEvent);
    }
    if (!chars) {
      return null;
    }
    var event = SyntheticInputEvent.getPooled(eventTypes.beforeInput, targetInst, nativeEvent, nativeEventTarget);
    event.data = chars;
    accumulateTwoPhaseDispatches(event);
    return event;
  }
  var BeforeInputEventPlugin = {
    eventTypes,
    extractEvents: function(topLevelType, targetInst, nativeEvent, nativeEventTarget) {
      var composition = extractCompositionEvent(topLevelType, targetInst, nativeEvent, nativeEventTarget);
      var beforeInput = extractBeforeInputEvent(topLevelType, targetInst, nativeEvent, nativeEventTarget);
      if (composition === null) {
        return beforeInput;
      }
      if (beforeInput === null) {
        return composition;
      }
      return [composition, beforeInput];
    }
  };
  var restoreImpl = null;
  var restoreTarget = null;
  var restoreQueue = null;
  function restoreStateOfTarget(target) {
    var internalInstance = getInstanceFromNode(target);
    if (!internalInstance) {
      return;
    }
    !(typeof restoreImpl === "function") ? invariant(false, "setRestoreImplementation() needs to be called to handle a target for controlled events. This error is likely caused by a bug in React. Please file an issue.") : void 0;
    var props = getFiberCurrentPropsFromNode(internalInstance.stateNode);
    restoreImpl(internalInstance.stateNode, internalInstance.type, props);
  }
  function setRestoreImplementation(impl) {
    restoreImpl = impl;
  }
  function enqueueStateRestore(target) {
    if (restoreTarget) {
      if (restoreQueue) {
        restoreQueue.push(target);
      } else {
        restoreQueue = [target];
      }
    } else {
      restoreTarget = target;
    }
  }
  function needsStateRestore() {
    return restoreTarget !== null || restoreQueue !== null;
  }
  function restoreStateIfNeeded() {
    if (!restoreTarget) {
      return;
    }
    var target = restoreTarget;
    var queuedTargets = restoreQueue;
    restoreTarget = null;
    restoreQueue = null;
    restoreStateOfTarget(target);
    if (queuedTargets) {
      for (var i = 0; i < queuedTargets.length; i++) {
        restoreStateOfTarget(queuedTargets[i]);
      }
    }
  }
  var _batchedUpdatesImpl = function(fn, bookkeeping) {
    return fn(bookkeeping);
  };
  var _interactiveUpdatesImpl = function(fn, a, b) {
    return fn(a, b);
  };
  var _flushInteractiveUpdatesImpl = function() {
  };
  var isBatching = false;
  function batchedUpdates(fn, bookkeeping) {
    if (isBatching) {
      return fn(bookkeeping);
    }
    isBatching = true;
    try {
      return _batchedUpdatesImpl(fn, bookkeeping);
    } finally {
      isBatching = false;
      var controlledComponentsHavePendingUpdates = needsStateRestore();
      if (controlledComponentsHavePendingUpdates) {
        _flushInteractiveUpdatesImpl();
        restoreStateIfNeeded();
      }
    }
  }
  function interactiveUpdates(fn, a, b) {
    return _interactiveUpdatesImpl(fn, a, b);
  }
  function setBatchingImplementation(batchedUpdatesImpl, interactiveUpdatesImpl, flushInteractiveUpdatesImpl) {
    _batchedUpdatesImpl = batchedUpdatesImpl;
    _interactiveUpdatesImpl = interactiveUpdatesImpl;
    _flushInteractiveUpdatesImpl = flushInteractiveUpdatesImpl;
  }
  var supportedInputTypes = {
    color: true,
    date: true,
    datetime: true,
    "datetime-local": true,
    email: true,
    month: true,
    number: true,
    password: true,
    range: true,
    search: true,
    tel: true,
    text: true,
    time: true,
    url: true,
    week: true
  };
  function isTextInputElement(elem) {
    var nodeName = elem && elem.nodeName && elem.nodeName.toLowerCase();
    if (nodeName === "input") {
      return !!supportedInputTypes[elem.type];
    }
    if (nodeName === "textarea") {
      return true;
    }
    return false;
  }
  var ELEMENT_NODE = 1;
  var TEXT_NODE = 3;
  var COMMENT_NODE = 8;
  var DOCUMENT_NODE = 9;
  var DOCUMENT_FRAGMENT_NODE = 11;
  function getEventTarget(nativeEvent) {
    var target = nativeEvent.target || nativeEvent.srcElement || window;
    if (target.correspondingUseElement) {
      target = target.correspondingUseElement;
    }
    return target.nodeType === TEXT_NODE ? target.parentNode : target;
  }
  /**
   * Checks if an event is supported in the current execution environment.
   *
   * NOTE: This will not work correctly for non-generic events such as `change`,
   * `reset`, `load`, `error`, and `select`.
   *
   * Borrows from Modernizr.
   *
   * @param {string} eventNameSuffix Event name, e.g. "click".
   * @return {boolean} True if the event is supported.
   * @internal
   * @license Modernizr 3.0.0pre (Custom Build) | MIT
   */
  function isEventSupported(eventNameSuffix) {
    if (!canUseDOM) {
      return false;
    }
    var eventName = "on" + eventNameSuffix;
    var isSupported = eventName in document;
    if (!isSupported) {
      var element = document.createElement("div");
      element.setAttribute(eventName, "return;");
      isSupported = typeof element[eventName] === "function";
    }
    return isSupported;
  }
  function isCheckable(elem) {
    var type = elem.type;
    var nodeName = elem.nodeName;
    return nodeName && nodeName.toLowerCase() === "input" && (type === "checkbox" || type === "radio");
  }
  function getTracker(node) {
    return node._valueTracker;
  }
  function detachTracker(node) {
    node._valueTracker = null;
  }
  function getValueFromNode(node) {
    var value = "";
    if (!node) {
      return value;
    }
    if (isCheckable(node)) {
      value = node.checked ? "true" : "false";
    } else {
      value = node.value;
    }
    return value;
  }
  function trackValueOnNode(node) {
    var valueField = isCheckable(node) ? "checked" : "value";
    var descriptor = Object.getOwnPropertyDescriptor(node.constructor.prototype, valueField);
    var currentValue = "" + node[valueField];
    if (node.hasOwnProperty(valueField) || typeof descriptor === "undefined" || typeof descriptor.get !== "function" || typeof descriptor.set !== "function") {
      return;
    }
    var get2 = descriptor.get, set2 = descriptor.set;
    Object.defineProperty(node, valueField, {
      configurable: true,
      get: function() {
        return get2.call(this);
      },
      set: function(value) {
        currentValue = "" + value;
        set2.call(this, value);
      }
    });
    Object.defineProperty(node, valueField, {
      enumerable: descriptor.enumerable
    });
    var tracker = {
      getValue: function() {
        return currentValue;
      },
      setValue: function(value) {
        currentValue = "" + value;
      },
      stopTracking: function() {
        detachTracker(node);
        delete node[valueField];
      }
    };
    return tracker;
  }
  function track(node) {
    if (getTracker(node)) {
      return;
    }
    node._valueTracker = trackValueOnNode(node);
  }
  function updateValueIfChanged(node) {
    if (!node) {
      return false;
    }
    var tracker = getTracker(node);
    if (!tracker) {
      return true;
    }
    var lastValue = tracker.getValue();
    var nextValue = getValueFromNode(node);
    if (nextValue !== lastValue) {
      tracker.setValue(nextValue);
      return true;
    }
    return false;
  }
  var ReactSharedInternals = React2.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED;
  var BEFORE_SLASH_RE = /^(.*)[\\\/]/;
  var describeComponentFrame = function(name, source, ownerName) {
    var sourceInfo = "";
    if (source) {
      var path = source.fileName;
      var fileName = path.replace(BEFORE_SLASH_RE, "");
      {
        if (/^index\./.test(fileName)) {
          var match = path.match(BEFORE_SLASH_RE);
          if (match) {
            var pathBeforeSlash = match[1];
            if (pathBeforeSlash) {
              var folderName = pathBeforeSlash.replace(BEFORE_SLASH_RE, "");
              fileName = folderName + "/" + fileName;
            }
          }
        }
      }
      sourceInfo = " (at " + fileName + ":" + source.lineNumber + ")";
    } else if (ownerName) {
      sourceInfo = " (created by " + ownerName + ")";
    }
    return "\n    in " + (name || "Unknown") + sourceInfo;
  };
  var hasSymbol = typeof Symbol === "function" && Symbol.for;
  var REACT_ELEMENT_TYPE = hasSymbol ? Symbol.for("react.element") : 60103;
  var REACT_PORTAL_TYPE = hasSymbol ? Symbol.for("react.portal") : 60106;
  var REACT_FRAGMENT_TYPE = hasSymbol ? Symbol.for("react.fragment") : 60107;
  var REACT_STRICT_MODE_TYPE = hasSymbol ? Symbol.for("react.strict_mode") : 60108;
  var REACT_PROFILER_TYPE = hasSymbol ? Symbol.for("react.profiler") : 60114;
  var REACT_PROVIDER_TYPE = hasSymbol ? Symbol.for("react.provider") : 60109;
  var REACT_CONTEXT_TYPE = hasSymbol ? Symbol.for("react.context") : 60110;
  var REACT_CONCURRENT_MODE_TYPE = hasSymbol ? Symbol.for("react.concurrent_mode") : 60111;
  var REACT_FORWARD_REF_TYPE = hasSymbol ? Symbol.for("react.forward_ref") : 60112;
  var REACT_SUSPENSE_TYPE = hasSymbol ? Symbol.for("react.suspense") : 60113;
  var REACT_MEMO_TYPE = hasSymbol ? Symbol.for("react.memo") : 60115;
  var REACT_LAZY_TYPE = hasSymbol ? Symbol.for("react.lazy") : 60116;
  var MAYBE_ITERATOR_SYMBOL = typeof Symbol === "function" && Symbol.iterator;
  var FAUX_ITERATOR_SYMBOL = "@@iterator";
  function getIteratorFn(maybeIterable) {
    if (maybeIterable === null || typeof maybeIterable !== "object") {
      return null;
    }
    var maybeIterator = MAYBE_ITERATOR_SYMBOL && maybeIterable[MAYBE_ITERATOR_SYMBOL] || maybeIterable[FAUX_ITERATOR_SYMBOL];
    if (typeof maybeIterator === "function") {
      return maybeIterator;
    }
    return null;
  }
  var Pending = 0;
  var Resolved = 1;
  var Rejected = 2;
  function refineResolvedLazyComponent(lazyComponent) {
    return lazyComponent._status === Resolved ? lazyComponent._result : null;
  }
  function getWrappedName(outerType, innerType, wrapperName) {
    var functionName = innerType.displayName || innerType.name || "";
    return outerType.displayName || (functionName !== "" ? wrapperName + "(" + functionName + ")" : wrapperName);
  }
  function getComponentName(type) {
    if (type == null) {
      return null;
    }
    {
      if (typeof type.tag === "number") {
        warningWithoutStack$1(false, "Received an unexpected object in getComponentName(). This is likely a bug in React. Please file an issue.");
      }
    }
    if (typeof type === "function") {
      return type.displayName || type.name || null;
    }
    if (typeof type === "string") {
      return type;
    }
    switch (type) {
      case REACT_CONCURRENT_MODE_TYPE:
        return "ConcurrentMode";
      case REACT_FRAGMENT_TYPE:
        return "Fragment";
      case REACT_PORTAL_TYPE:
        return "Portal";
      case REACT_PROFILER_TYPE:
        return "Profiler";
      case REACT_STRICT_MODE_TYPE:
        return "StrictMode";
      case REACT_SUSPENSE_TYPE:
        return "Suspense";
    }
    if (typeof type === "object") {
      switch (type.$$typeof) {
        case REACT_CONTEXT_TYPE:
          return "Context.Consumer";
        case REACT_PROVIDER_TYPE:
          return "Context.Provider";
        case REACT_FORWARD_REF_TYPE:
          return getWrappedName(type, type.render, "ForwardRef");
        case REACT_MEMO_TYPE:
          return getComponentName(type.type);
        case REACT_LAZY_TYPE: {
          var thenable = type;
          var resolvedThenable = refineResolvedLazyComponent(thenable);
          if (resolvedThenable) {
            return getComponentName(resolvedThenable);
          }
        }
      }
    }
    return null;
  }
  var ReactDebugCurrentFrame = ReactSharedInternals.ReactDebugCurrentFrame;
  function describeFiber(fiber) {
    switch (fiber.tag) {
      case IndeterminateComponent:
      case LazyComponent:
      case FunctionComponent:
      case ClassComponent:
      case HostComponent:
      case Mode:
      case SuspenseComponent:
        var owner = fiber._debugOwner;
        var source = fiber._debugSource;
        var name = getComponentName(fiber.type);
        var ownerName = null;
        if (owner) {
          ownerName = getComponentName(owner.type);
        }
        return describeComponentFrame(name, source, ownerName);
      default:
        return "";
    }
  }
  function getStackByFiberInDevAndProd(workInProgress) {
    var info = "";
    var node = workInProgress;
    do {
      info += describeFiber(node);
      node = node.return;
    } while (node);
    return info;
  }
  var current = null;
  var phase = null;
  function getCurrentFiberOwnerNameInDevOrNull() {
    {
      if (current === null) {
        return null;
      }
      var owner = current._debugOwner;
      if (owner !== null && typeof owner !== "undefined") {
        return getComponentName(owner.type);
      }
    }
    return null;
  }
  function getCurrentFiberStackInDev() {
    {
      if (current === null) {
        return "";
      }
      return getStackByFiberInDevAndProd(current);
    }
    return "";
  }
  function resetCurrentFiber() {
    {
      ReactDebugCurrentFrame.getCurrentStack = null;
      current = null;
      phase = null;
    }
  }
  function setCurrentFiber(fiber) {
    {
      ReactDebugCurrentFrame.getCurrentStack = getCurrentFiberStackInDev;
      current = fiber;
      phase = null;
    }
  }
  function setCurrentPhase(lifeCyclePhase) {
    {
      phase = lifeCyclePhase;
    }
  }
  var warning = warningWithoutStack$1;
  {
    warning = function(condition, format) {
      if (condition) {
        return;
      }
      var ReactDebugCurrentFrame2 = ReactSharedInternals.ReactDebugCurrentFrame;
      var stack = ReactDebugCurrentFrame2.getStackAddendum();
      for (var _len = arguments.length, args = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
        args[_key - 2] = arguments[_key];
      }
      warningWithoutStack$1.apply(void 0, [false, format + "%s"].concat(args, [stack]));
    };
  }
  var warning$1 = warning;
  var RESERVED = 0;
  var STRING = 1;
  var BOOLEANISH_STRING = 2;
  var BOOLEAN = 3;
  var OVERLOADED_BOOLEAN = 4;
  var NUMERIC = 5;
  var POSITIVE_NUMERIC = 6;
  var ATTRIBUTE_NAME_START_CHAR = ":A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD";
  var ATTRIBUTE_NAME_CHAR = ATTRIBUTE_NAME_START_CHAR + "\\-.0-9\\u00B7\\u0300-\\u036F\\u203F-\\u2040";
  var ROOT_ATTRIBUTE_NAME = "data-reactroot";
  var VALID_ATTRIBUTE_NAME_REGEX = new RegExp("^[" + ATTRIBUTE_NAME_START_CHAR + "][" + ATTRIBUTE_NAME_CHAR + "]*$");
  var hasOwnProperty = Object.prototype.hasOwnProperty;
  var illegalAttributeNameCache = {};
  var validatedAttributeNameCache = {};
  function isAttributeNameSafe(attributeName) {
    if (hasOwnProperty.call(validatedAttributeNameCache, attributeName)) {
      return true;
    }
    if (hasOwnProperty.call(illegalAttributeNameCache, attributeName)) {
      return false;
    }
    if (VALID_ATTRIBUTE_NAME_REGEX.test(attributeName)) {
      validatedAttributeNameCache[attributeName] = true;
      return true;
    }
    illegalAttributeNameCache[attributeName] = true;
    {
      warning$1(false, "Invalid attribute name: `%s`", attributeName);
    }
    return false;
  }
  function shouldIgnoreAttribute(name, propertyInfo, isCustomComponentTag) {
    if (propertyInfo !== null) {
      return propertyInfo.type === RESERVED;
    }
    if (isCustomComponentTag) {
      return false;
    }
    if (name.length > 2 && (name[0] === "o" || name[0] === "O") && (name[1] === "n" || name[1] === "N")) {
      return true;
    }
    return false;
  }
  function shouldRemoveAttributeWithWarning(name, value, propertyInfo, isCustomComponentTag) {
    if (propertyInfo !== null && propertyInfo.type === RESERVED) {
      return false;
    }
    switch (typeof value) {
      case "function":
      // $FlowIssue symbol is perfectly valid here
      case "symbol":
        return true;
      case "boolean": {
        if (isCustomComponentTag) {
          return false;
        }
        if (propertyInfo !== null) {
          return !propertyInfo.acceptsBooleans;
        } else {
          var prefix = name.toLowerCase().slice(0, 5);
          return prefix !== "data-" && prefix !== "aria-";
        }
      }
      default:
        return false;
    }
  }
  function shouldRemoveAttribute(name, value, propertyInfo, isCustomComponentTag) {
    if (value === null || typeof value === "undefined") {
      return true;
    }
    if (shouldRemoveAttributeWithWarning(name, value, propertyInfo, isCustomComponentTag)) {
      return true;
    }
    if (isCustomComponentTag) {
      return false;
    }
    if (propertyInfo !== null) {
      switch (propertyInfo.type) {
        case BOOLEAN:
          return !value;
        case OVERLOADED_BOOLEAN:
          return value === false;
        case NUMERIC:
          return isNaN(value);
        case POSITIVE_NUMERIC:
          return isNaN(value) || value < 1;
      }
    }
    return false;
  }
  function getPropertyInfo(name) {
    return properties.hasOwnProperty(name) ? properties[name] : null;
  }
  function PropertyInfoRecord(name, type, mustUseProperty, attributeName, attributeNamespace) {
    this.acceptsBooleans = type === BOOLEANISH_STRING || type === BOOLEAN || type === OVERLOADED_BOOLEAN;
    this.attributeName = attributeName;
    this.attributeNamespace = attributeNamespace;
    this.mustUseProperty = mustUseProperty;
    this.propertyName = name;
    this.type = type;
  }
  var properties = {};
  [
    "children",
    "dangerouslySetInnerHTML",
    // TODO: This prevents the assignment of defaultValue to regular
    // elements (not just inputs). Now that ReactDOMInput assigns to the
    // defaultValue property -- do we need this?
    "defaultValue",
    "defaultChecked",
    "innerHTML",
    "suppressContentEditableWarning",
    "suppressHydrationWarning",
    "style"
  ].forEach(
    function(name) {
      properties[name] = new PropertyInfoRecord(
        name,
        RESERVED,
        false,
        // mustUseProperty
        name,
        // attributeName
        null
      );
    }
    // attributeNamespace
  );
  [["acceptCharset", "accept-charset"], ["className", "class"], ["htmlFor", "for"], ["httpEquiv", "http-equiv"]].forEach(
    function(_ref) {
      var name = _ref[0], attributeName = _ref[1];
      properties[name] = new PropertyInfoRecord(
        name,
        STRING,
        false,
        // mustUseProperty
        attributeName,
        // attributeName
        null
      );
    }
    // attributeNamespace
  );
  ["contentEditable", "draggable", "spellCheck", "value"].forEach(
    function(name) {
      properties[name] = new PropertyInfoRecord(
        name,
        BOOLEANISH_STRING,
        false,
        // mustUseProperty
        name.toLowerCase(),
        // attributeName
        null
      );
    }
    // attributeNamespace
  );
  ["autoReverse", "externalResourcesRequired", "focusable", "preserveAlpha"].forEach(
    function(name) {
      properties[name] = new PropertyInfoRecord(
        name,
        BOOLEANISH_STRING,
        false,
        // mustUseProperty
        name,
        // attributeName
        null
      );
    }
    // attributeNamespace
  );
  [
    "allowFullScreen",
    "async",
    // Note: there is a special case that prevents it from being written to the DOM
    // on the client side because the browsers are inconsistent. Instead we call focus().
    "autoFocus",
    "autoPlay",
    "controls",
    "default",
    "defer",
    "disabled",
    "formNoValidate",
    "hidden",
    "loop",
    "noModule",
    "noValidate",
    "open",
    "playsInline",
    "readOnly",
    "required",
    "reversed",
    "scoped",
    "seamless",
    // Microdata
    "itemScope"
  ].forEach(
    function(name) {
      properties[name] = new PropertyInfoRecord(
        name,
        BOOLEAN,
        false,
        // mustUseProperty
        name.toLowerCase(),
        // attributeName
        null
      );
    }
    // attributeNamespace
  );
  [
    "checked",
    // Note: `option.selected` is not updated if `select.multiple` is
    // disabled with `removeAttribute`. We have special logic for handling this.
    "multiple",
    "muted",
    "selected"
  ].forEach(
    function(name) {
      properties[name] = new PropertyInfoRecord(
        name,
        BOOLEAN,
        true,
        // mustUseProperty
        name,
        // attributeName
        null
      );
    }
    // attributeNamespace
  );
  ["capture", "download"].forEach(
    function(name) {
      properties[name] = new PropertyInfoRecord(
        name,
        OVERLOADED_BOOLEAN,
        false,
        // mustUseProperty
        name,
        // attributeName
        null
      );
    }
    // attributeNamespace
  );
  ["cols", "rows", "size", "span"].forEach(
    function(name) {
      properties[name] = new PropertyInfoRecord(
        name,
        POSITIVE_NUMERIC,
        false,
        // mustUseProperty
        name,
        // attributeName
        null
      );
    }
    // attributeNamespace
  );
  ["rowSpan", "start"].forEach(
    function(name) {
      properties[name] = new PropertyInfoRecord(
        name,
        NUMERIC,
        false,
        // mustUseProperty
        name.toLowerCase(),
        // attributeName
        null
      );
    }
    // attributeNamespace
  );
  var CAMELIZE = /[\-\:]([a-z])/g;
  var capitalize = function(token) {
    return token[1].toUpperCase();
  };
  ["accent-height", "alignment-baseline", "arabic-form", "baseline-shift", "cap-height", "clip-path", "clip-rule", "color-interpolation", "color-interpolation-filters", "color-profile", "color-rendering", "dominant-baseline", "enable-background", "fill-opacity", "fill-rule", "flood-color", "flood-opacity", "font-family", "font-size", "font-size-adjust", "font-stretch", "font-style", "font-variant", "font-weight", "glyph-name", "glyph-orientation-horizontal", "glyph-orientation-vertical", "horiz-adv-x", "horiz-origin-x", "image-rendering", "letter-spacing", "lighting-color", "marker-end", "marker-mid", "marker-start", "overline-position", "overline-thickness", "paint-order", "panose-1", "pointer-events", "rendering-intent", "shape-rendering", "stop-color", "stop-opacity", "strikethrough-position", "strikethrough-thickness", "stroke-dasharray", "stroke-dashoffset", "stroke-linecap", "stroke-linejoin", "stroke-miterlimit", "stroke-opacity", "stroke-width", "text-anchor", "text-decoration", "text-rendering", "underline-position", "underline-thickness", "unicode-bidi", "unicode-range", "units-per-em", "v-alphabetic", "v-hanging", "v-ideographic", "v-mathematical", "vector-effect", "vert-adv-y", "vert-origin-x", "vert-origin-y", "word-spacing", "writing-mode", "xmlns:xlink", "x-height"].forEach(
    function(attributeName) {
      var name = attributeName.replace(CAMELIZE, capitalize);
      properties[name] = new PropertyInfoRecord(
        name,
        STRING,
        false,
        // mustUseProperty
        attributeName,
        null
      );
    }
    // attributeNamespace
  );
  ["xlink:actuate", "xlink:arcrole", "xlink:href", "xlink:role", "xlink:show", "xlink:title", "xlink:type"].forEach(function(attributeName) {
    var name = attributeName.replace(CAMELIZE, capitalize);
    properties[name] = new PropertyInfoRecord(
      name,
      STRING,
      false,
      // mustUseProperty
      attributeName,
      "http://www.w3.org/1999/xlink"
    );
  });
  ["xml:base", "xml:lang", "xml:space"].forEach(function(attributeName) {
    var name = attributeName.replace(CAMELIZE, capitalize);
    properties[name] = new PropertyInfoRecord(
      name,
      STRING,
      false,
      // mustUseProperty
      attributeName,
      "http://www.w3.org/XML/1998/namespace"
    );
  });
  properties.tabIndex = new PropertyInfoRecord(
    "tabIndex",
    STRING,
    false,
    // mustUseProperty
    "tabindex",
    // attributeName
    null
  );
  function getValueForProperty(node, name, expected, propertyInfo) {
    {
      if (propertyInfo.mustUseProperty) {
        var propertyName = propertyInfo.propertyName;
        return node[propertyName];
      } else {
        var attributeName = propertyInfo.attributeName;
        var stringValue = null;
        if (propertyInfo.type === OVERLOADED_BOOLEAN) {
          if (node.hasAttribute(attributeName)) {
            var value = node.getAttribute(attributeName);
            if (value === "") {
              return true;
            }
            if (shouldRemoveAttribute(name, expected, propertyInfo, false)) {
              return value;
            }
            if (value === "" + expected) {
              return expected;
            }
            return value;
          }
        } else if (node.hasAttribute(attributeName)) {
          if (shouldRemoveAttribute(name, expected, propertyInfo, false)) {
            return node.getAttribute(attributeName);
          }
          if (propertyInfo.type === BOOLEAN) {
            return expected;
          }
          stringValue = node.getAttribute(attributeName);
        }
        if (shouldRemoveAttribute(name, expected, propertyInfo, false)) {
          return stringValue === null ? expected : stringValue;
        } else if (stringValue === "" + expected) {
          return expected;
        } else {
          return stringValue;
        }
      }
    }
  }
  function getValueForAttribute(node, name, expected) {
    {
      if (!isAttributeNameSafe(name)) {
        return;
      }
      if (!node.hasAttribute(name)) {
        return expected === void 0 ? void 0 : null;
      }
      var value = node.getAttribute(name);
      if (value === "" + expected) {
        return expected;
      }
      return value;
    }
  }
  function setValueForProperty(node, name, value, isCustomComponentTag) {
    var propertyInfo = getPropertyInfo(name);
    if (shouldIgnoreAttribute(name, propertyInfo, isCustomComponentTag)) {
      return;
    }
    if (shouldRemoveAttribute(name, value, propertyInfo, isCustomComponentTag)) {
      value = null;
    }
    if (isCustomComponentTag || propertyInfo === null) {
      if (isAttributeNameSafe(name)) {
        var _attributeName = name;
        if (value === null) {
          node.removeAttribute(_attributeName);
        } else {
          node.setAttribute(_attributeName, "" + value);
        }
      }
      return;
    }
    var mustUseProperty = propertyInfo.mustUseProperty;
    if (mustUseProperty) {
      var propertyName = propertyInfo.propertyName;
      if (value === null) {
        var type = propertyInfo.type;
        node[propertyName] = type === BOOLEAN ? false : "";
      } else {
        node[propertyName] = value;
      }
      return;
    }
    var attributeName = propertyInfo.attributeName, attributeNamespace = propertyInfo.attributeNamespace;
    if (value === null) {
      node.removeAttribute(attributeName);
    } else {
      var _type = propertyInfo.type;
      var attributeValue = void 0;
      if (_type === BOOLEAN || _type === OVERLOADED_BOOLEAN && value === true) {
        attributeValue = "";
      } else {
        attributeValue = "" + value;
      }
      if (attributeNamespace) {
        node.setAttributeNS(attributeNamespace, attributeName, attributeValue);
      } else {
        node.setAttribute(attributeName, attributeValue);
      }
    }
  }
  function toString(value) {
    return "" + value;
  }
  function getToStringValue(value) {
    switch (typeof value) {
      case "boolean":
      case "number":
      case "object":
      case "string":
      case "undefined":
        return value;
      default:
        return "";
    }
  }
  var ReactPropTypesSecret$1 = "SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED";
  var ReactPropTypesSecret_1 = ReactPropTypesSecret$1;
  var printWarning = function() {
  };
  {
    var ReactPropTypesSecret = ReactPropTypesSecret_1;
    var loggedTypeFailures = {};
    printWarning = function(text) {
      var message = "Warning: " + text;
      if (typeof console !== "undefined") {
        console.error(message);
      }
      try {
        throw new Error(message);
      } catch (x) {
      }
    };
  }
  function checkPropTypes(typeSpecs, values, location, componentName, getStack) {
    {
      for (var typeSpecName in typeSpecs) {
        if (typeSpecs.hasOwnProperty(typeSpecName)) {
          var error;
          try {
            if (typeof typeSpecs[typeSpecName] !== "function") {
              var err = Error(
                (componentName || "React class") + ": " + location + " type `" + typeSpecName + "` is invalid; it must be a function, usually from the `prop-types` package, but received `" + typeof typeSpecs[typeSpecName] + "`."
              );
              err.name = "Invariant Violation";
              throw err;
            }
            error = typeSpecs[typeSpecName](values, typeSpecName, componentName, location, null, ReactPropTypesSecret);
          } catch (ex) {
            error = ex;
          }
          if (error && !(error instanceof Error)) {
            printWarning(
              (componentName || "React class") + ": type specification of " + location + " `" + typeSpecName + "` is invalid; the type checker function must return `null` or an `Error` but returned a " + typeof error + ". You may have forgotten to pass an argument to the type checker creator (arrayOf, instanceOf, objectOf, oneOf, oneOfType, and shape all require an argument)."
            );
          }
          if (error instanceof Error && !(error.message in loggedTypeFailures)) {
            loggedTypeFailures[error.message] = true;
            var stack = getStack ? getStack() : "";
            printWarning(
              "Failed " + location + " type: " + error.message + (stack != null ? stack : "")
            );
          }
        }
      }
    }
  }
  var checkPropTypes_1 = checkPropTypes;
  var ReactDebugCurrentFrame$1 = null;
  var ReactControlledValuePropTypes = {
    checkPropTypes: null
  };
  {
    ReactDebugCurrentFrame$1 = ReactSharedInternals.ReactDebugCurrentFrame;
    var hasReadOnlyValue = {
      button: true,
      checkbox: true,
      image: true,
      hidden: true,
      radio: true,
      reset: true,
      submit: true
    };
    var propTypes = {
      value: function(props, propName, componentName) {
        if (hasReadOnlyValue[props.type] || props.onChange || props.readOnly || props.disabled || props[propName] == null) {
          return null;
        }
        return new Error("You provided a `value` prop to a form field without an `onChange` handler. This will render a read-only field. If the field should be mutable use `defaultValue`. Otherwise, set either `onChange` or `readOnly`.");
      },
      checked: function(props, propName, componentName) {
        if (props.onChange || props.readOnly || props.disabled || props[propName] == null) {
          return null;
        }
        return new Error("You provided a `checked` prop to a form field without an `onChange` handler. This will render a read-only field. If the field should be mutable use `defaultChecked`. Otherwise, set either `onChange` or `readOnly`.");
      }
    };
    ReactControlledValuePropTypes.checkPropTypes = function(tagName, props) {
      checkPropTypes_1(propTypes, props, "prop", tagName, ReactDebugCurrentFrame$1.getStackAddendum);
    };
  }
  var enableUserTimingAPI = true;
  var enableHooks = false;
  var debugRenderPhaseSideEffects = false;
  var debugRenderPhaseSideEffectsForStrictMode = true;
  var replayFailedUnitOfWorkWithInvokeGuardedCallback = true;
  var warnAboutDeprecatedLifecycles = false;
  var enableProfilerTimer = true;
  var enableSchedulerTracing = true;
  var disableInputAttributeSyncing = false;
  var enableStableConcurrentModeAPIs = false;
  var didWarnValueDefaultValue = false;
  var didWarnCheckedDefaultChecked = false;
  var didWarnControlledToUncontrolled = false;
  var didWarnUncontrolledToControlled = false;
  function isControlled(props) {
    var usesChecked = props.type === "checkbox" || props.type === "radio";
    return usesChecked ? props.checked != null : props.value != null;
  }
  function getHostProps(element, props) {
    var node = element;
    var checked = props.checked;
    var hostProps = _assign({}, props, {
      defaultChecked: void 0,
      defaultValue: void 0,
      value: void 0,
      checked: checked != null ? checked : node._wrapperState.initialChecked
    });
    return hostProps;
  }
  function initWrapperState(element, props) {
    {
      ReactControlledValuePropTypes.checkPropTypes("input", props);
      if (props.checked !== void 0 && props.defaultChecked !== void 0 && !didWarnCheckedDefaultChecked) {
        warning$1(false, "%s contains an input of type %s with both checked and defaultChecked props. Input elements must be either controlled or uncontrolled (specify either the checked prop, or the defaultChecked prop, but not both). Decide between using a controlled or uncontrolled input element and remove one of these props. More info: https://fb.me/react-controlled-components", getCurrentFiberOwnerNameInDevOrNull() || "A component", props.type);
        didWarnCheckedDefaultChecked = true;
      }
      if (props.value !== void 0 && props.defaultValue !== void 0 && !didWarnValueDefaultValue) {
        warning$1(false, "%s contains an input of type %s with both value and defaultValue props. Input elements must be either controlled or uncontrolled (specify either the value prop, or the defaultValue prop, but not both). Decide between using a controlled or uncontrolled input element and remove one of these props. More info: https://fb.me/react-controlled-components", getCurrentFiberOwnerNameInDevOrNull() || "A component", props.type);
        didWarnValueDefaultValue = true;
      }
    }
    var node = element;
    var defaultValue = props.defaultValue == null ? "" : props.defaultValue;
    node._wrapperState = {
      initialChecked: props.checked != null ? props.checked : props.defaultChecked,
      initialValue: getToStringValue(props.value != null ? props.value : defaultValue),
      controlled: isControlled(props)
    };
  }
  function updateChecked(element, props) {
    var node = element;
    var checked = props.checked;
    if (checked != null) {
      setValueForProperty(node, "checked", checked, false);
    }
  }
  function updateWrapper(element, props) {
    var node = element;
    {
      var _controlled = isControlled(props);
      if (!node._wrapperState.controlled && _controlled && !didWarnUncontrolledToControlled) {
        warning$1(false, "A component is changing an uncontrolled input of type %s to be controlled. Input elements should not switch from uncontrolled to controlled (or vice versa). Decide between using a controlled or uncontrolled input element for the lifetime of the component. More info: https://fb.me/react-controlled-components", props.type);
        didWarnUncontrolledToControlled = true;
      }
      if (node._wrapperState.controlled && !_controlled && !didWarnControlledToUncontrolled) {
        warning$1(false, "A component is changing a controlled input of type %s to be uncontrolled. Input elements should not switch from controlled to uncontrolled (or vice versa). Decide between using a controlled or uncontrolled input element for the lifetime of the component. More info: https://fb.me/react-controlled-components", props.type);
        didWarnControlledToUncontrolled = true;
      }
    }
    updateChecked(element, props);
    var value = getToStringValue(props.value);
    var type = props.type;
    if (value != null) {
      if (type === "number") {
        if (value === 0 && node.value === "" || // We explicitly want to coerce to number here if possible.
        // eslint-disable-next-line
        node.value != value) {
          node.value = toString(value);
        }
      } else if (node.value !== toString(value)) {
        node.value = toString(value);
      }
    } else if (type === "submit" || type === "reset") {
      node.removeAttribute("value");
      return;
    }
    if (disableInputAttributeSyncing) {
      if (props.hasOwnProperty("defaultValue")) {
        setDefaultValue(node, props.type, getToStringValue(props.defaultValue));
      }
    } else {
      if (props.hasOwnProperty("value")) {
        setDefaultValue(node, props.type, value);
      } else if (props.hasOwnProperty("defaultValue")) {
        setDefaultValue(node, props.type, getToStringValue(props.defaultValue));
      }
    }
    if (disableInputAttributeSyncing) {
      if (props.defaultChecked == null) {
        node.removeAttribute("checked");
      } else {
        node.defaultChecked = !!props.defaultChecked;
      }
    } else {
      if (props.checked == null && props.defaultChecked != null) {
        node.defaultChecked = !!props.defaultChecked;
      }
    }
  }
  function postMountWrapper(element, props, isHydrating2) {
    var node = element;
    if (props.hasOwnProperty("value") || props.hasOwnProperty("defaultValue")) {
      var type = props.type;
      var isButton = type === "submit" || type === "reset";
      if (isButton && (props.value === void 0 || props.value === null)) {
        return;
      }
      var _initialValue = toString(node._wrapperState.initialValue);
      if (!isHydrating2) {
        if (disableInputAttributeSyncing) {
          var value = getToStringValue(props.value);
          if (value != null) {
            if (isButton || value !== node.value) {
              node.value = toString(value);
            }
          }
        } else {
          if (_initialValue !== node.value) {
            node.value = _initialValue;
          }
        }
      }
      if (disableInputAttributeSyncing) {
        var defaultValue = getToStringValue(props.defaultValue);
        if (defaultValue != null) {
          node.defaultValue = toString(defaultValue);
        }
      } else {
        node.defaultValue = _initialValue;
      }
    }
    var name = node.name;
    if (name !== "") {
      node.name = "";
    }
    if (disableInputAttributeSyncing) {
      if (!isHydrating2) {
        updateChecked(element, props);
      }
      if (props.hasOwnProperty("defaultChecked")) {
        node.defaultChecked = !node.defaultChecked;
        node.defaultChecked = !!props.defaultChecked;
      }
    } else {
      node.defaultChecked = !node.defaultChecked;
      node.defaultChecked = !!node._wrapperState.initialChecked;
    }
    if (name !== "") {
      node.name = name;
    }
  }
  function restoreControlledState(element, props) {
    var node = element;
    updateWrapper(node, props);
    updateNamedCousins(node, props);
  }
  function updateNamedCousins(rootNode, props) {
    var name = props.name;
    if (props.type === "radio" && name != null) {
      var queryRoot = rootNode;
      while (queryRoot.parentNode) {
        queryRoot = queryRoot.parentNode;
      }
      var group = queryRoot.querySelectorAll("input[name=" + JSON.stringify("" + name) + '][type="radio"]');
      for (var i = 0; i < group.length; i++) {
        var otherNode = group[i];
        if (otherNode === rootNode || otherNode.form !== rootNode.form) {
          continue;
        }
        var otherProps = getFiberCurrentPropsFromNode$1(otherNode);
        !otherProps ? invariant(false, "ReactDOMInput: Mixing React and non-React radio inputs with the same `name` is not supported.") : void 0;
        updateValueIfChanged(otherNode);
        updateWrapper(otherNode, otherProps);
      }
    }
  }
  function setDefaultValue(node, type, value) {
    if (
      // Focused number inputs synchronize on blur. See ChangeEventPlugin.js
      type !== "number" || node.ownerDocument.activeElement !== node
    ) {
      if (value == null) {
        node.defaultValue = toString(node._wrapperState.initialValue);
      } else if (node.defaultValue !== toString(value)) {
        node.defaultValue = toString(value);
      }
    }
  }
  var eventTypes$1 = {
    change: {
      phasedRegistrationNames: {
        bubbled: "onChange",
        captured: "onChangeCapture"
      },
      dependencies: [TOP_BLUR, TOP_CHANGE, TOP_CLICK, TOP_FOCUS, TOP_INPUT, TOP_KEY_DOWN, TOP_KEY_UP, TOP_SELECTION_CHANGE]
    }
  };
  function createAndAccumulateChangeEvent(inst, nativeEvent, target) {
    var event = SyntheticEvent.getPooled(eventTypes$1.change, inst, nativeEvent, target);
    event.type = "change";
    enqueueStateRestore(target);
    accumulateTwoPhaseDispatches(event);
    return event;
  }
  var activeElement = null;
  var activeElementInst = null;
  function shouldUseChangeEvent(elem) {
    var nodeName = elem.nodeName && elem.nodeName.toLowerCase();
    return nodeName === "select" || nodeName === "input" && elem.type === "file";
  }
  function manualDispatchChangeEvent(nativeEvent) {
    var event = createAndAccumulateChangeEvent(activeElementInst, nativeEvent, getEventTarget(nativeEvent));
    batchedUpdates(runEventInBatch, event);
  }
  function runEventInBatch(event) {
    runEventsInBatch(event);
  }
  function getInstIfValueChanged(targetInst) {
    var targetNode = getNodeFromInstance$1(targetInst);
    if (updateValueIfChanged(targetNode)) {
      return targetInst;
    }
  }
  function getTargetInstForChangeEvent(topLevelType, targetInst) {
    if (topLevelType === TOP_CHANGE) {
      return targetInst;
    }
  }
  var isInputEventSupported = false;
  if (canUseDOM) {
    isInputEventSupported = isEventSupported("input") && (!document.documentMode || document.documentMode > 9);
  }
  function startWatchingForValueChange(target, targetInst) {
    activeElement = target;
    activeElementInst = targetInst;
    activeElement.attachEvent("onpropertychange", handlePropertyChange);
  }
  function stopWatchingForValueChange() {
    if (!activeElement) {
      return;
    }
    activeElement.detachEvent("onpropertychange", handlePropertyChange);
    activeElement = null;
    activeElementInst = null;
  }
  function handlePropertyChange(nativeEvent) {
    if (nativeEvent.propertyName !== "value") {
      return;
    }
    if (getInstIfValueChanged(activeElementInst)) {
      manualDispatchChangeEvent(nativeEvent);
    }
  }
  function handleEventsForInputEventPolyfill(topLevelType, target, targetInst) {
    if (topLevelType === TOP_FOCUS) {
      stopWatchingForValueChange();
      startWatchingForValueChange(target, targetInst);
    } else if (topLevelType === TOP_BLUR) {
      stopWatchingForValueChange();
    }
  }
  function getTargetInstForInputEventPolyfill(topLevelType, targetInst) {
    if (topLevelType === TOP_SELECTION_CHANGE || topLevelType === TOP_KEY_UP || topLevelType === TOP_KEY_DOWN) {
      return getInstIfValueChanged(activeElementInst);
    }
  }
  function shouldUseClickEvent(elem) {
    var nodeName = elem.nodeName;
    return nodeName && nodeName.toLowerCase() === "input" && (elem.type === "checkbox" || elem.type === "radio");
  }
  function getTargetInstForClickEvent(topLevelType, targetInst) {
    if (topLevelType === TOP_CLICK) {
      return getInstIfValueChanged(targetInst);
    }
  }
  function getTargetInstForInputOrChangeEvent(topLevelType, targetInst) {
    if (topLevelType === TOP_INPUT || topLevelType === TOP_CHANGE) {
      return getInstIfValueChanged(targetInst);
    }
  }
  function handleControlledInputBlur(node) {
    var state = node._wrapperState;
    if (!state || !state.controlled || node.type !== "number") {
      return;
    }
    if (!disableInputAttributeSyncing) {
      setDefaultValue(node, "number", node.value);
    }
  }
  var ChangeEventPlugin = {
    eventTypes: eventTypes$1,
    _isInputEventSupported: isInputEventSupported,
    extractEvents: function(topLevelType, targetInst, nativeEvent, nativeEventTarget) {
      var targetNode = targetInst ? getNodeFromInstance$1(targetInst) : window;
      var getTargetInstFunc = void 0, handleEventFunc = void 0;
      if (shouldUseChangeEvent(targetNode)) {
        getTargetInstFunc = getTargetInstForChangeEvent;
      } else if (isTextInputElement(targetNode)) {
        if (isInputEventSupported) {
          getTargetInstFunc = getTargetInstForInputOrChangeEvent;
        } else {
          getTargetInstFunc = getTargetInstForInputEventPolyfill;
          handleEventFunc = handleEventsForInputEventPolyfill;
        }
      } else if (shouldUseClickEvent(targetNode)) {
        getTargetInstFunc = getTargetInstForClickEvent;
      }
      if (getTargetInstFunc) {
        var inst = getTargetInstFunc(topLevelType, targetInst);
        if (inst) {
          var event = createAndAccumulateChangeEvent(inst, nativeEvent, nativeEventTarget);
          return event;
        }
      }
      if (handleEventFunc) {
        handleEventFunc(topLevelType, targetNode, targetInst);
      }
      if (topLevelType === TOP_BLUR) {
        handleControlledInputBlur(targetNode);
      }
    }
  };
  var DOMEventPluginOrder = ["ResponderEventPlugin", "SimpleEventPlugin", "EnterLeaveEventPlugin", "ChangeEventPlugin", "SelectEventPlugin", "BeforeInputEventPlugin"];
  var SyntheticUIEvent = SyntheticEvent.extend({
    view: null,
    detail: null
  });
  var modifierKeyToProp = {
    Alt: "altKey",
    Control: "ctrlKey",
    Meta: "metaKey",
    Shift: "shiftKey"
  };
  function modifierStateGetter(keyArg) {
    var syntheticEvent = this;
    var nativeEvent = syntheticEvent.nativeEvent;
    if (nativeEvent.getModifierState) {
      return nativeEvent.getModifierState(keyArg);
    }
    var keyProp = modifierKeyToProp[keyArg];
    return keyProp ? !!nativeEvent[keyProp] : false;
  }
  function getEventModifierState(nativeEvent) {
    return modifierStateGetter;
  }
  var previousScreenX = 0;
  var previousScreenY = 0;
  var isMovementXSet = false;
  var isMovementYSet = false;
  var SyntheticMouseEvent = SyntheticUIEvent.extend({
    screenX: null,
    screenY: null,
    clientX: null,
    clientY: null,
    pageX: null,
    pageY: null,
    ctrlKey: null,
    shiftKey: null,
    altKey: null,
    metaKey: null,
    getModifierState: getEventModifierState,
    button: null,
    buttons: null,
    relatedTarget: function(event) {
      return event.relatedTarget || (event.fromElement === event.srcElement ? event.toElement : event.fromElement);
    },
    movementX: function(event) {
      if ("movementX" in event) {
        return event.movementX;
      }
      var screenX = previousScreenX;
      previousScreenX = event.screenX;
      if (!isMovementXSet) {
        isMovementXSet = true;
        return 0;
      }
      return event.type === "mousemove" ? event.screenX - screenX : 0;
    },
    movementY: function(event) {
      if ("movementY" in event) {
        return event.movementY;
      }
      var screenY = previousScreenY;
      previousScreenY = event.screenY;
      if (!isMovementYSet) {
        isMovementYSet = true;
        return 0;
      }
      return event.type === "mousemove" ? event.screenY - screenY : 0;
    }
  });
  var SyntheticPointerEvent = SyntheticMouseEvent.extend({
    pointerId: null,
    width: null,
    height: null,
    pressure: null,
    tangentialPressure: null,
    tiltX: null,
    tiltY: null,
    twist: null,
    pointerType: null,
    isPrimary: null
  });
  var eventTypes$2 = {
    mouseEnter: {
      registrationName: "onMouseEnter",
      dependencies: [TOP_MOUSE_OUT, TOP_MOUSE_OVER]
    },
    mouseLeave: {
      registrationName: "onMouseLeave",
      dependencies: [TOP_MOUSE_OUT, TOP_MOUSE_OVER]
    },
    pointerEnter: {
      registrationName: "onPointerEnter",
      dependencies: [TOP_POINTER_OUT, TOP_POINTER_OVER]
    },
    pointerLeave: {
      registrationName: "onPointerLeave",
      dependencies: [TOP_POINTER_OUT, TOP_POINTER_OVER]
    }
  };
  var EnterLeaveEventPlugin = {
    eventTypes: eventTypes$2,
    /**
     * For almost every interaction we care about, there will be both a top-level
     * `mouseover` and `mouseout` event that occurs. Only use `mouseout` so that
     * we do not extract duplicate events. However, moving the mouse into the
     * browser from outside will not fire a `mouseout` event. In this case, we use
     * the `mouseover` top-level event.
     */
    extractEvents: function(topLevelType, targetInst, nativeEvent, nativeEventTarget) {
      var isOverEvent = topLevelType === TOP_MOUSE_OVER || topLevelType === TOP_POINTER_OVER;
      var isOutEvent = topLevelType === TOP_MOUSE_OUT || topLevelType === TOP_POINTER_OUT;
      if (isOverEvent && (nativeEvent.relatedTarget || nativeEvent.fromElement)) {
        return null;
      }
      if (!isOutEvent && !isOverEvent) {
        return null;
      }
      var win = void 0;
      if (nativeEventTarget.window === nativeEventTarget) {
        win = nativeEventTarget;
      } else {
        var doc = nativeEventTarget.ownerDocument;
        if (doc) {
          win = doc.defaultView || doc.parentWindow;
        } else {
          win = window;
        }
      }
      var from = void 0;
      var to = void 0;
      if (isOutEvent) {
        from = targetInst;
        var related = nativeEvent.relatedTarget || nativeEvent.toElement;
        to = related ? getClosestInstanceFromNode(related) : null;
      } else {
        from = null;
        to = targetInst;
      }
      if (from === to) {
        return null;
      }
      var eventInterface = void 0, leaveEventType = void 0, enterEventType = void 0, eventTypePrefix = void 0;
      if (topLevelType === TOP_MOUSE_OUT || topLevelType === TOP_MOUSE_OVER) {
        eventInterface = SyntheticMouseEvent;
        leaveEventType = eventTypes$2.mouseLeave;
        enterEventType = eventTypes$2.mouseEnter;
        eventTypePrefix = "mouse";
      } else if (topLevelType === TOP_POINTER_OUT || topLevelType === TOP_POINTER_OVER) {
        eventInterface = SyntheticPointerEvent;
        leaveEventType = eventTypes$2.pointerLeave;
        enterEventType = eventTypes$2.pointerEnter;
        eventTypePrefix = "pointer";
      }
      var fromNode = from == null ? win : getNodeFromInstance$1(from);
      var toNode = to == null ? win : getNodeFromInstance$1(to);
      var leave = eventInterface.getPooled(leaveEventType, from, nativeEvent, nativeEventTarget);
      leave.type = eventTypePrefix + "leave";
      leave.target = fromNode;
      leave.relatedTarget = toNode;
      var enter = eventInterface.getPooled(enterEventType, to, nativeEvent, nativeEventTarget);
      enter.type = eventTypePrefix + "enter";
      enter.target = toNode;
      enter.relatedTarget = fromNode;
      accumulateEnterLeaveDispatches(leave, enter, from, to);
      return [leave, enter];
    }
  };
  var hasOwnProperty$1 = Object.prototype.hasOwnProperty;
  function is(x, y) {
    if (x === y) {
      return x !== 0 || y !== 0 || 1 / x === 1 / y;
    } else {
      return x !== x && y !== y;
    }
  }
  function shallowEqual(objA, objB) {
    if (is(objA, objB)) {
      return true;
    }
    if (typeof objA !== "object" || objA === null || typeof objB !== "object" || objB === null) {
      return false;
    }
    var keysA = Object.keys(objA);
    var keysB = Object.keys(objB);
    if (keysA.length !== keysB.length) {
      return false;
    }
    for (var i = 0; i < keysA.length; i++) {
      if (!hasOwnProperty$1.call(objB, keysA[i]) || !is(objA[keysA[i]], objB[keysA[i]])) {
        return false;
      }
    }
    return true;
  }
  function get(key) {
    return key._reactInternalFiber;
  }
  function has(key) {
    return key._reactInternalFiber !== void 0;
  }
  function set(key, value) {
    key._reactInternalFiber = value;
  }
  var NoEffect = (
    /*              */
    0
  );
  var PerformedWork = (
    /*         */
    1
  );
  var Placement = (
    /*             */
    2
  );
  var Update = (
    /*                */
    4
  );
  var PlacementAndUpdate = (
    /*    */
    6
  );
  var Deletion = (
    /*              */
    8
  );
  var ContentReset = (
    /*          */
    16
  );
  var Callback = (
    /*              */
    32
  );
  var DidCapture = (
    /*            */
    64
  );
  var Ref = (
    /*                   */
    128
  );
  var Snapshot = (
    /*              */
    256
  );
  var Passive = (
    /*               */
    512
  );
  var LifecycleEffectMask = (
    /*   */
    932
  );
  var HostEffectMask = (
    /*        */
    1023
  );
  var Incomplete = (
    /*            */
    1024
  );
  var ShouldCapture = (
    /*         */
    2048
  );
  var ReactCurrentOwner$1 = ReactSharedInternals.ReactCurrentOwner;
  var MOUNTING = 1;
  var MOUNTED = 2;
  var UNMOUNTED = 3;
  function isFiberMountedImpl(fiber) {
    var node = fiber;
    if (!fiber.alternate) {
      if ((node.effectTag & Placement) !== NoEffect) {
        return MOUNTING;
      }
      while (node.return) {
        node = node.return;
        if ((node.effectTag & Placement) !== NoEffect) {
          return MOUNTING;
        }
      }
    } else {
      while (node.return) {
        node = node.return;
      }
    }
    if (node.tag === HostRoot) {
      return MOUNTED;
    }
    return UNMOUNTED;
  }
  function isFiberMounted(fiber) {
    return isFiberMountedImpl(fiber) === MOUNTED;
  }
  function isMounted(component) {
    {
      var owner = ReactCurrentOwner$1.current;
      if (owner !== null && owner.tag === ClassComponent) {
        var ownerFiber = owner;
        var instance = ownerFiber.stateNode;
        !instance._warnedAboutRefsInRender ? warningWithoutStack$1(false, "%s is accessing isMounted inside its render() function. render() should be a pure function of props and state. It should never access something that requires stale data from the previous render, such as refs. Move this logic to componentDidMount and componentDidUpdate instead.", getComponentName(ownerFiber.type) || "A component") : void 0;
        instance._warnedAboutRefsInRender = true;
      }
    }
    var fiber = get(component);
    if (!fiber) {
      return false;
    }
    return isFiberMountedImpl(fiber) === MOUNTED;
  }
  function assertIsMounted(fiber) {
    !(isFiberMountedImpl(fiber) === MOUNTED) ? invariant(false, "Unable to find node on an unmounted component.") : void 0;
  }
  function findCurrentFiberUsingSlowPath(fiber) {
    var alternate = fiber.alternate;
    if (!alternate) {
      var state = isFiberMountedImpl(fiber);
      !(state !== UNMOUNTED) ? invariant(false, "Unable to find node on an unmounted component.") : void 0;
      if (state === MOUNTING) {
        return null;
      }
      return fiber;
    }
    var a = fiber;
    var b = alternate;
    while (true) {
      var parentA = a.return;
      var parentB = parentA ? parentA.alternate : null;
      if (!parentA || !parentB) {
        break;
      }
      if (parentA.child === parentB.child) {
        var child = parentA.child;
        while (child) {
          if (child === a) {
            assertIsMounted(parentA);
            return fiber;
          }
          if (child === b) {
            assertIsMounted(parentA);
            return alternate;
          }
          child = child.sibling;
        }
        invariant(false, "Unable to find node on an unmounted component.");
      }
      if (a.return !== b.return) {
        a = parentA;
        b = parentB;
      } else {
        var didFindChild = false;
        var _child = parentA.child;
        while (_child) {
          if (_child === a) {
            didFindChild = true;
            a = parentA;
            b = parentB;
            break;
          }
          if (_child === b) {
            didFindChild = true;
            b = parentA;
            a = parentB;
            break;
          }
          _child = _child.sibling;
        }
        if (!didFindChild) {
          _child = parentB.child;
          while (_child) {
            if (_child === a) {
              didFindChild = true;
              a = parentB;
              b = parentA;
              break;
            }
            if (_child === b) {
              didFindChild = true;
              b = parentB;
              a = parentA;
              break;
            }
            _child = _child.sibling;
          }
          !didFindChild ? invariant(false, "Child was not found in either parent set. This indicates a bug in React related to the return pointer. Please file an issue.") : void 0;
        }
      }
      !(a.alternate === b) ? invariant(false, "Return fibers should always be each others' alternates. This error is likely caused by a bug in React. Please file an issue.") : void 0;
    }
    !(a.tag === HostRoot) ? invariant(false, "Unable to find node on an unmounted component.") : void 0;
    if (a.stateNode.current === a) {
      return fiber;
    }
    return alternate;
  }
  function findCurrentHostFiber(parent) {
    var currentParent = findCurrentFiberUsingSlowPath(parent);
    if (!currentParent) {
      return null;
    }
    var node = currentParent;
    while (true) {
      if (node.tag === HostComponent || node.tag === HostText) {
        return node;
      } else if (node.child) {
        node.child.return = node;
        node = node.child;
        continue;
      }
      if (node === currentParent) {
        return null;
      }
      while (!node.sibling) {
        if (!node.return || node.return === currentParent) {
          return null;
        }
        node = node.return;
      }
      node.sibling.return = node.return;
      node = node.sibling;
    }
    return null;
  }
  function findCurrentHostFiberWithNoPortals(parent) {
    var currentParent = findCurrentFiberUsingSlowPath(parent);
    if (!currentParent) {
      return null;
    }
    var node = currentParent;
    while (true) {
      if (node.tag === HostComponent || node.tag === HostText) {
        return node;
      } else if (node.child && node.tag !== HostPortal) {
        node.child.return = node;
        node = node.child;
        continue;
      }
      if (node === currentParent) {
        return null;
      }
      while (!node.sibling) {
        if (!node.return || node.return === currentParent) {
          return null;
        }
        node = node.return;
      }
      node.sibling.return = node.return;
      node = node.sibling;
    }
    return null;
  }
  function addEventBubbleListener(element, eventType, listener) {
    element.addEventListener(eventType, listener, false);
  }
  function addEventCaptureListener(element, eventType, listener) {
    element.addEventListener(eventType, listener, true);
  }
  var SyntheticAnimationEvent = SyntheticEvent.extend({
    animationName: null,
    elapsedTime: null,
    pseudoElement: null
  });
  var SyntheticClipboardEvent = SyntheticEvent.extend({
    clipboardData: function(event) {
      return "clipboardData" in event ? event.clipboardData : window.clipboardData;
    }
  });
  var SyntheticFocusEvent = SyntheticUIEvent.extend({
    relatedTarget: null
  });
  function getEventCharCode(nativeEvent) {
    var charCode = void 0;
    var keyCode = nativeEvent.keyCode;
    if ("charCode" in nativeEvent) {
      charCode = nativeEvent.charCode;
      if (charCode === 0 && keyCode === 13) {
        charCode = 13;
      }
    } else {
      charCode = keyCode;
    }
    if (charCode === 10) {
      charCode = 13;
    }
    if (charCode >= 32 || charCode === 13) {
      return charCode;
    }
    return 0;
  }
  var normalizeKey = {
    Esc: "Escape",
    Spacebar: " ",
    Left: "ArrowLeft",
    Up: "ArrowUp",
    Right: "ArrowRight",
    Down: "ArrowDown",
    Del: "Delete",
    Win: "OS",
    Menu: "ContextMenu",
    Apps: "ContextMenu",
    Scroll: "ScrollLock",
    MozPrintableKey: "Unidentified"
  };
  var translateToKey = {
    "8": "Backspace",
    "9": "Tab",
    "12": "Clear",
    "13": "Enter",
    "16": "Shift",
    "17": "Control",
    "18": "Alt",
    "19": "Pause",
    "20": "CapsLock",
    "27": "Escape",
    "32": " ",
    "33": "PageUp",
    "34": "PageDown",
    "35": "End",
    "36": "Home",
    "37": "ArrowLeft",
    "38": "ArrowUp",
    "39": "ArrowRight",
    "40": "ArrowDown",
    "45": "Insert",
    "46": "Delete",
    "112": "F1",
    "113": "F2",
    "114": "F3",
    "115": "F4",
    "116": "F5",
    "117": "F6",
    "118": "F7",
    "119": "F8",
    "120": "F9",
    "121": "F10",
    "122": "F11",
    "123": "F12",
    "144": "NumLock",
    "145": "ScrollLock",
    "224": "Meta"
  };
  function getEventKey(nativeEvent) {
    if (nativeEvent.key) {
      var key = normalizeKey[nativeEvent.key] || nativeEvent.key;
      if (key !== "Unidentified") {
        return key;
      }
    }
    if (nativeEvent.type === "keypress") {
      var charCode = getEventCharCode(nativeEvent);
      return charCode === 13 ? "Enter" : String.fromCharCode(charCode);
    }
    if (nativeEvent.type === "keydown" || nativeEvent.type === "keyup") {
      return translateToKey[nativeEvent.keyCode] || "Unidentified";
    }
    return "";
  }
  var SyntheticKeyboardEvent = SyntheticUIEvent.extend({
    key: getEventKey,
    location: null,
    ctrlKey: null,
    shiftKey: null,
    altKey: null,
    metaKey: null,
    repeat: null,
    locale: null,
    getModifierState: getEventModifierState,
    // Legacy Interface
    charCode: function(event) {
      if (event.type === "keypress") {
        return getEventCharCode(event);
      }
      return 0;
    },
    keyCode: function(event) {
      if (event.type === "keydown" || event.type === "keyup") {
        return event.keyCode;
      }
      return 0;
    },
    which: function(event) {
      if (event.type === "keypress") {
        return getEventCharCode(event);
      }
      if (event.type === "keydown" || event.type === "keyup") {
        return event.keyCode;
      }
      return 0;
    }
  });
  var SyntheticDragEvent = SyntheticMouseEvent.extend({
    dataTransfer: null
  });
  var SyntheticTouchEvent = SyntheticUIEvent.extend({
    touches: null,
    targetTouches: null,
    changedTouches: null,
    altKey: null,
    metaKey: null,
    ctrlKey: null,
    shiftKey: null,
    getModifierState: getEventModifierState
  });
  var SyntheticTransitionEvent = SyntheticEvent.extend({
    propertyName: null,
    elapsedTime: null,
    pseudoElement: null
  });
  var SyntheticWheelEvent = SyntheticMouseEvent.extend({
    deltaX: function(event) {
      return "deltaX" in event ? event.deltaX : (
        // Fallback to `wheelDeltaX` for Webkit and normalize (right is positive).
        "wheelDeltaX" in event ? -event.wheelDeltaX : 0
      );
    },
    deltaY: function(event) {
      return "deltaY" in event ? event.deltaY : (
        // Fallback to `wheelDeltaY` for Webkit and normalize (down is positive).
        "wheelDeltaY" in event ? -event.wheelDeltaY : (
          // Fallback to `wheelDelta` for IE<9 and normalize (down is positive).
          "wheelDelta" in event ? -event.wheelDelta : 0
        )
      );
    },
    deltaZ: null,
    // Browsers without "deltaMode" is reporting in raw wheel delta where one
    // notch on the scroll is always +/- 120, roughly equivalent to pixels.
    // A good approximation of DOM_DELTA_LINE (1) is 5% of viewport size or
    // ~40 pixels, for DOM_DELTA_SCREEN (2) it is 87.5% of viewport size.
    deltaMode: null
  });
  var interactiveEventTypeNames = [[TOP_BLUR, "blur"], [TOP_CANCEL, "cancel"], [TOP_CLICK, "click"], [TOP_CLOSE, "close"], [TOP_CONTEXT_MENU, "contextMenu"], [TOP_COPY, "copy"], [TOP_CUT, "cut"], [TOP_AUX_CLICK, "auxClick"], [TOP_DOUBLE_CLICK, "doubleClick"], [TOP_DRAG_END, "dragEnd"], [TOP_DRAG_START, "dragStart"], [TOP_DROP, "drop"], [TOP_FOCUS, "focus"], [TOP_INPUT, "input"], [TOP_INVALID, "invalid"], [TOP_KEY_DOWN, "keyDown"], [TOP_KEY_PRESS, "keyPress"], [TOP_KEY_UP, "keyUp"], [TOP_MOUSE_DOWN, "mouseDown"], [TOP_MOUSE_UP, "mouseUp"], [TOP_PASTE, "paste"], [TOP_PAUSE, "pause"], [TOP_PLAY, "play"], [TOP_POINTER_CANCEL, "pointerCancel"], [TOP_POINTER_DOWN, "pointerDown"], [TOP_POINTER_UP, "pointerUp"], [TOP_RATE_CHANGE, "rateChange"], [TOP_RESET, "reset"], [TOP_SEEKED, "seeked"], [TOP_SUBMIT, "submit"], [TOP_TOUCH_CANCEL, "touchCancel"], [TOP_TOUCH_END, "touchEnd"], [TOP_TOUCH_START, "touchStart"], [TOP_VOLUME_CHANGE, "volumeChange"]];
  var nonInteractiveEventTypeNames = [[TOP_ABORT, "abort"], [TOP_ANIMATION_END, "animationEnd"], [TOP_ANIMATION_ITERATION, "animationIteration"], [TOP_ANIMATION_START, "animationStart"], [TOP_CAN_PLAY, "canPlay"], [TOP_CAN_PLAY_THROUGH, "canPlayThrough"], [TOP_DRAG, "drag"], [TOP_DRAG_ENTER, "dragEnter"], [TOP_DRAG_EXIT, "dragExit"], [TOP_DRAG_LEAVE, "dragLeave"], [TOP_DRAG_OVER, "dragOver"], [TOP_DURATION_CHANGE, "durationChange"], [TOP_EMPTIED, "emptied"], [TOP_ENCRYPTED, "encrypted"], [TOP_ENDED, "ended"], [TOP_ERROR, "error"], [TOP_GOT_POINTER_CAPTURE, "gotPointerCapture"], [TOP_LOAD, "load"], [TOP_LOADED_DATA, "loadedData"], [TOP_LOADED_METADATA, "loadedMetadata"], [TOP_LOAD_START, "loadStart"], [TOP_LOST_POINTER_CAPTURE, "lostPointerCapture"], [TOP_MOUSE_MOVE, "mouseMove"], [TOP_MOUSE_OUT, "mouseOut"], [TOP_MOUSE_OVER, "mouseOver"], [TOP_PLAYING, "playing"], [TOP_POINTER_MOVE, "pointerMove"], [TOP_POINTER_OUT, "pointerOut"], [TOP_POINTER_OVER, "pointerOver"], [TOP_PROGRESS, "progress"], [TOP_SCROLL, "scroll"], [TOP_SEEKING, "seeking"], [TOP_STALLED, "stalled"], [TOP_SUSPEND, "suspend"], [TOP_TIME_UPDATE, "timeUpdate"], [TOP_TOGGLE, "toggle"], [TOP_TOUCH_MOVE, "touchMove"], [TOP_TRANSITION_END, "transitionEnd"], [TOP_WAITING, "waiting"], [TOP_WHEEL, "wheel"]];
  var eventTypes$4 = {};
  var topLevelEventsToDispatchConfig = {};
  function addEventTypeNameToConfig(_ref, isInteractive2) {
    var topEvent = _ref[0], event = _ref[1];
    var capitalizedEvent = event[0].toUpperCase() + event.slice(1);
    var onEvent = "on" + capitalizedEvent;
    var type = {
      phasedRegistrationNames: {
        bubbled: onEvent,
        captured: onEvent + "Capture"
      },
      dependencies: [topEvent],
      isInteractive: isInteractive2
    };
    eventTypes$4[event] = type;
    topLevelEventsToDispatchConfig[topEvent] = type;
  }
  interactiveEventTypeNames.forEach(function(eventTuple) {
    addEventTypeNameToConfig(eventTuple, true);
  });
  nonInteractiveEventTypeNames.forEach(function(eventTuple) {
    addEventTypeNameToConfig(eventTuple, false);
  });
  var knownHTMLTopLevelTypes = [TOP_ABORT, TOP_CANCEL, TOP_CAN_PLAY, TOP_CAN_PLAY_THROUGH, TOP_CLOSE, TOP_DURATION_CHANGE, TOP_EMPTIED, TOP_ENCRYPTED, TOP_ENDED, TOP_ERROR, TOP_INPUT, TOP_INVALID, TOP_LOAD, TOP_LOADED_DATA, TOP_LOADED_METADATA, TOP_LOAD_START, TOP_PAUSE, TOP_PLAY, TOP_PLAYING, TOP_PROGRESS, TOP_RATE_CHANGE, TOP_RESET, TOP_SEEKED, TOP_SEEKING, TOP_STALLED, TOP_SUBMIT, TOP_SUSPEND, TOP_TIME_UPDATE, TOP_TOGGLE, TOP_VOLUME_CHANGE, TOP_WAITING];
  var SimpleEventPlugin = {
    eventTypes: eventTypes$4,
    isInteractiveTopLevelEventType: function(topLevelType) {
      var config = topLevelEventsToDispatchConfig[topLevelType];
      return config !== void 0 && config.isInteractive === true;
    },
    extractEvents: function(topLevelType, targetInst, nativeEvent, nativeEventTarget) {
      var dispatchConfig = topLevelEventsToDispatchConfig[topLevelType];
      if (!dispatchConfig) {
        return null;
      }
      var EventConstructor = void 0;
      switch (topLevelType) {
        case TOP_KEY_PRESS:
          if (getEventCharCode(nativeEvent) === 0) {
            return null;
          }
        /* falls through */
        case TOP_KEY_DOWN:
        case TOP_KEY_UP:
          EventConstructor = SyntheticKeyboardEvent;
          break;
        case TOP_BLUR:
        case TOP_FOCUS:
          EventConstructor = SyntheticFocusEvent;
          break;
        case TOP_CLICK:
          if (nativeEvent.button === 2) {
            return null;
          }
        /* falls through */
        case TOP_AUX_CLICK:
        case TOP_DOUBLE_CLICK:
        case TOP_MOUSE_DOWN:
        case TOP_MOUSE_MOVE:
        case TOP_MOUSE_UP:
        // TODO: Disabled elements should not respond to mouse events
        /* falls through */
        case TOP_MOUSE_OUT:
        case TOP_MOUSE_OVER:
        case TOP_CONTEXT_MENU:
          EventConstructor = SyntheticMouseEvent;
          break;
        case TOP_DRAG:
        case TOP_DRAG_END:
        case TOP_DRAG_ENTER:
        case TOP_DRAG_EXIT:
        case TOP_DRAG_LEAVE:
        case TOP_DRAG_OVER:
        case TOP_DRAG_START:
        case TOP_DROP:
          EventConstructor = SyntheticDragEvent;
          break;
        case TOP_TOUCH_CANCEL:
        case TOP_TOUCH_END:
        case TOP_TOUCH_MOVE:
        case TOP_TOUCH_START:
          EventConstructor = SyntheticTouchEvent;
          break;
        case TOP_ANIMATION_END:
        case TOP_ANIMATION_ITERATION:
        case TOP_ANIMATION_START:
          EventConstructor = SyntheticAnimationEvent;
          break;
        case TOP_TRANSITION_END:
          EventConstructor = SyntheticTransitionEvent;
          break;
        case TOP_SCROLL:
          EventConstructor = SyntheticUIEvent;
          break;
        case TOP_WHEEL:
          EventConstructor = SyntheticWheelEvent;
          break;
        case TOP_COPY:
        case TOP_CUT:
        case TOP_PASTE:
          EventConstructor = SyntheticClipboardEvent;
          break;
        case TOP_GOT_POINTER_CAPTURE:
        case TOP_LOST_POINTER_CAPTURE:
        case TOP_POINTER_CANCEL:
        case TOP_POINTER_DOWN:
        case TOP_POINTER_MOVE:
        case TOP_POINTER_OUT:
        case TOP_POINTER_OVER:
        case TOP_POINTER_UP:
          EventConstructor = SyntheticPointerEvent;
          break;
        default:
          {
            if (knownHTMLTopLevelTypes.indexOf(topLevelType) === -1) {
              warningWithoutStack$1(false, "SimpleEventPlugin: Unhandled event type, `%s`. This warning is likely caused by a bug in React. Please file an issue.", topLevelType);
            }
          }
          EventConstructor = SyntheticEvent;
          break;
      }
      var event = EventConstructor.getPooled(dispatchConfig, targetInst, nativeEvent, nativeEventTarget);
      accumulateTwoPhaseDispatches(event);
      return event;
    }
  };
  var isInteractiveTopLevelEventType = SimpleEventPlugin.isInteractiveTopLevelEventType;
  var CALLBACK_BOOKKEEPING_POOL_SIZE = 10;
  var callbackBookkeepingPool = [];
  function findRootContainerNode(inst) {
    while (inst.return) {
      inst = inst.return;
    }
    if (inst.tag !== HostRoot) {
      return null;
    }
    return inst.stateNode.containerInfo;
  }
  function getTopLevelCallbackBookKeeping(topLevelType, nativeEvent, targetInst) {
    if (callbackBookkeepingPool.length) {
      var instance = callbackBookkeepingPool.pop();
      instance.topLevelType = topLevelType;
      instance.nativeEvent = nativeEvent;
      instance.targetInst = targetInst;
      return instance;
    }
    return {
      topLevelType,
      nativeEvent,
      targetInst,
      ancestors: []
    };
  }
  function releaseTopLevelCallbackBookKeeping(instance) {
    instance.topLevelType = null;
    instance.nativeEvent = null;
    instance.targetInst = null;
    instance.ancestors.length = 0;
    if (callbackBookkeepingPool.length < CALLBACK_BOOKKEEPING_POOL_SIZE) {
      callbackBookkeepingPool.push(instance);
    }
  }
  function handleTopLevel(bookKeeping) {
    var targetInst = bookKeeping.targetInst;
    var ancestor = targetInst;
    do {
      if (!ancestor) {
        bookKeeping.ancestors.push(ancestor);
        break;
      }
      var root2 = findRootContainerNode(ancestor);
      if (!root2) {
        break;
      }
      bookKeeping.ancestors.push(ancestor);
      ancestor = getClosestInstanceFromNode(root2);
    } while (ancestor);
    for (var i = 0; i < bookKeeping.ancestors.length; i++) {
      targetInst = bookKeeping.ancestors[i];
      runExtractedEventsInBatch(bookKeeping.topLevelType, targetInst, bookKeeping.nativeEvent, getEventTarget(bookKeeping.nativeEvent));
    }
  }
  var _enabled = true;
  function setEnabled(enabled) {
    _enabled = !!enabled;
  }
  function isEnabled() {
    return _enabled;
  }
  function trapBubbledEvent(topLevelType, element) {
    if (!element) {
      return null;
    }
    var dispatch = isInteractiveTopLevelEventType(topLevelType) ? dispatchInteractiveEvent : dispatchEvent;
    addEventBubbleListener(
      element,
      getRawEventName(topLevelType),
      // Check if interactive and wrap in interactiveUpdates
      dispatch.bind(null, topLevelType)
    );
  }
  function trapCapturedEvent(topLevelType, element) {
    if (!element) {
      return null;
    }
    var dispatch = isInteractiveTopLevelEventType(topLevelType) ? dispatchInteractiveEvent : dispatchEvent;
    addEventCaptureListener(
      element,
      getRawEventName(topLevelType),
      // Check if interactive and wrap in interactiveUpdates
      dispatch.bind(null, topLevelType)
    );
  }
  function dispatchInteractiveEvent(topLevelType, nativeEvent) {
    interactiveUpdates(dispatchEvent, topLevelType, nativeEvent);
  }
  function dispatchEvent(topLevelType, nativeEvent) {
    if (!_enabled) {
      return;
    }
    var nativeEventTarget = getEventTarget(nativeEvent);
    var targetInst = getClosestInstanceFromNode(nativeEventTarget);
    if (targetInst !== null && typeof targetInst.tag === "number" && !isFiberMounted(targetInst)) {
      targetInst = null;
    }
    var bookKeeping = getTopLevelCallbackBookKeeping(topLevelType, nativeEvent, targetInst);
    try {
      batchedUpdates(handleTopLevel, bookKeeping);
    } finally {
      releaseTopLevelCallbackBookKeeping(bookKeeping);
    }
  }
  var alreadyListeningTo = {};
  var reactTopListenersCounter = 0;
  var topListenersIDKey = "_reactListenersID" + ("" + Math.random()).slice(2);
  function getListeningForDocument(mountAt) {
    if (!Object.prototype.hasOwnProperty.call(mountAt, topListenersIDKey)) {
      mountAt[topListenersIDKey] = reactTopListenersCounter++;
      alreadyListeningTo[mountAt[topListenersIDKey]] = {};
    }
    return alreadyListeningTo[mountAt[topListenersIDKey]];
  }
  function listenTo(registrationName, mountAt) {
    var isListening = getListeningForDocument(mountAt);
    var dependencies = registrationNameDependencies[registrationName];
    for (var i = 0; i < dependencies.length; i++) {
      var dependency = dependencies[i];
      if (!(isListening.hasOwnProperty(dependency) && isListening[dependency])) {
        switch (dependency) {
          case TOP_SCROLL:
            trapCapturedEvent(TOP_SCROLL, mountAt);
            break;
          case TOP_FOCUS:
          case TOP_BLUR:
            trapCapturedEvent(TOP_FOCUS, mountAt);
            trapCapturedEvent(TOP_BLUR, mountAt);
            isListening[TOP_BLUR] = true;
            isListening[TOP_FOCUS] = true;
            break;
          case TOP_CANCEL:
          case TOP_CLOSE:
            if (isEventSupported(getRawEventName(dependency))) {
              trapCapturedEvent(dependency, mountAt);
            }
            break;
          case TOP_INVALID:
          case TOP_SUBMIT:
          case TOP_RESET:
            break;
          default:
            var isMediaEvent = mediaEventTypes.indexOf(dependency) !== -1;
            if (!isMediaEvent) {
              trapBubbledEvent(dependency, mountAt);
            }
            break;
        }
        isListening[dependency] = true;
      }
    }
  }
  function isListeningToAllDependencies(registrationName, mountAt) {
    var isListening = getListeningForDocument(mountAt);
    var dependencies = registrationNameDependencies[registrationName];
    for (var i = 0; i < dependencies.length; i++) {
      var dependency = dependencies[i];
      if (!(isListening.hasOwnProperty(dependency) && isListening[dependency])) {
        return false;
      }
    }
    return true;
  }
  function getActiveElement(doc) {
    doc = doc || (typeof document !== "undefined" ? document : void 0);
    if (typeof doc === "undefined") {
      return null;
    }
    try {
      return doc.activeElement || doc.body;
    } catch (e) {
      return doc.body;
    }
  }
  function getLeafNode(node) {
    while (node && node.firstChild) {
      node = node.firstChild;
    }
    return node;
  }
  function getSiblingNode(node) {
    while (node) {
      if (node.nextSibling) {
        return node.nextSibling;
      }
      node = node.parentNode;
    }
  }
  function getNodeForCharacterOffset(root2, offset) {
    var node = getLeafNode(root2);
    var nodeStart = 0;
    var nodeEnd = 0;
    while (node) {
      if (node.nodeType === TEXT_NODE) {
        nodeEnd = nodeStart + node.textContent.length;
        if (nodeStart <= offset && nodeEnd >= offset) {
          return {
            node,
            offset: offset - nodeStart
          };
        }
        nodeStart = nodeEnd;
      }
      node = getLeafNode(getSiblingNode(node));
    }
  }
  function getOffsets(outerNode) {
    var ownerDocument = outerNode.ownerDocument;
    var win = ownerDocument && ownerDocument.defaultView || window;
    var selection = win.getSelection && win.getSelection();
    if (!selection || selection.rangeCount === 0) {
      return null;
    }
    var anchorNode = selection.anchorNode, anchorOffset = selection.anchorOffset, focusNode = selection.focusNode, focusOffset = selection.focusOffset;
    try {
      anchorNode.nodeType;
      focusNode.nodeType;
    } catch (e) {
      return null;
    }
    return getModernOffsetsFromPoints(outerNode, anchorNode, anchorOffset, focusNode, focusOffset);
  }
  function getModernOffsetsFromPoints(outerNode, anchorNode, anchorOffset, focusNode, focusOffset) {
    var length = 0;
    var start = -1;
    var end = -1;
    var indexWithinAnchor = 0;
    var indexWithinFocus = 0;
    var node = outerNode;
    var parentNode = null;
    outer: while (true) {
      var next = null;
      while (true) {
        if (node === anchorNode && (anchorOffset === 0 || node.nodeType === TEXT_NODE)) {
          start = length + anchorOffset;
        }
        if (node === focusNode && (focusOffset === 0 || node.nodeType === TEXT_NODE)) {
          end = length + focusOffset;
        }
        if (node.nodeType === TEXT_NODE) {
          length += node.nodeValue.length;
        }
        if ((next = node.firstChild) === null) {
          break;
        }
        parentNode = node;
        node = next;
      }
      while (true) {
        if (node === outerNode) {
          break outer;
        }
        if (parentNode === anchorNode && ++indexWithinAnchor === anchorOffset) {
          start = length;
        }
        if (parentNode === focusNode && ++indexWithinFocus === focusOffset) {
          end = length;
        }
        if ((next = node.nextSibling) !== null) {
          break;
        }
        node = parentNode;
        parentNode = node.parentNode;
      }
      node = next;
    }
    if (start === -1 || end === -1) {
      return null;
    }
    return {
      start,
      end
    };
  }
  function setOffsets(node, offsets) {
    var doc = node.ownerDocument || document;
    var win = doc && doc.defaultView || window;
    if (!win.getSelection) {
      return;
    }
    var selection = win.getSelection();
    var length = node.textContent.length;
    var start = Math.min(offsets.start, length);
    var end = offsets.end === void 0 ? start : Math.min(offsets.end, length);
    if (!selection.extend && start > end) {
      var temp = end;
      end = start;
      start = temp;
    }
    var startMarker = getNodeForCharacterOffset(node, start);
    var endMarker = getNodeForCharacterOffset(node, end);
    if (startMarker && endMarker) {
      if (selection.rangeCount === 1 && selection.anchorNode === startMarker.node && selection.anchorOffset === startMarker.offset && selection.focusNode === endMarker.node && selection.focusOffset === endMarker.offset) {
        return;
      }
      var range = doc.createRange();
      range.setStart(startMarker.node, startMarker.offset);
      selection.removeAllRanges();
      if (start > end) {
        selection.addRange(range);
        selection.extend(endMarker.node, endMarker.offset);
      } else {
        range.setEnd(endMarker.node, endMarker.offset);
        selection.addRange(range);
      }
    }
  }
  function isTextNode(node) {
    return node && node.nodeType === TEXT_NODE;
  }
  function containsNode(outerNode, innerNode) {
    if (!outerNode || !innerNode) {
      return false;
    } else if (outerNode === innerNode) {
      return true;
    } else if (isTextNode(outerNode)) {
      return false;
    } else if (isTextNode(innerNode)) {
      return containsNode(outerNode, innerNode.parentNode);
    } else if ("contains" in outerNode) {
      return outerNode.contains(innerNode);
    } else if (outerNode.compareDocumentPosition) {
      return !!(outerNode.compareDocumentPosition(innerNode) & 16);
    } else {
      return false;
    }
  }
  function isInDocument(node) {
    return node && node.ownerDocument && containsNode(node.ownerDocument.documentElement, node);
  }
  function getActiveElementDeep() {
    var win = window;
    var element = getActiveElement();
    while (element instanceof win.HTMLIFrameElement) {
      try {
        win = element.contentDocument.defaultView;
      } catch (e) {
        return element;
      }
      element = getActiveElement(win.document);
    }
    return element;
  }
  function hasSelectionCapabilities(elem) {
    var nodeName = elem && elem.nodeName && elem.nodeName.toLowerCase();
    return nodeName && (nodeName === "input" && (elem.type === "text" || elem.type === "search" || elem.type === "tel" || elem.type === "url" || elem.type === "password") || nodeName === "textarea" || elem.contentEditable === "true");
  }
  function getSelectionInformation() {
    var focusedElem = getActiveElementDeep();
    return {
      focusedElem,
      selectionRange: hasSelectionCapabilities(focusedElem) ? getSelection$1(focusedElem) : null
    };
  }
  function restoreSelection(priorSelectionInformation) {
    var curFocusedElem = getActiveElementDeep();
    var priorFocusedElem = priorSelectionInformation.focusedElem;
    var priorSelectionRange = priorSelectionInformation.selectionRange;
    if (curFocusedElem !== priorFocusedElem && isInDocument(priorFocusedElem)) {
      if (priorSelectionRange !== null && hasSelectionCapabilities(priorFocusedElem)) {
        setSelection(priorFocusedElem, priorSelectionRange);
      }
      var ancestors = [];
      var ancestor = priorFocusedElem;
      while (ancestor = ancestor.parentNode) {
        if (ancestor.nodeType === ELEMENT_NODE) {
          ancestors.push({
            element: ancestor,
            left: ancestor.scrollLeft,
            top: ancestor.scrollTop
          });
        }
      }
      if (typeof priorFocusedElem.focus === "function") {
        priorFocusedElem.focus();
      }
      for (var i = 0; i < ancestors.length; i++) {
        var info = ancestors[i];
        info.element.scrollLeft = info.left;
        info.element.scrollTop = info.top;
      }
    }
  }
  function getSelection$1(input) {
    var selection = void 0;
    if ("selectionStart" in input) {
      selection = {
        start: input.selectionStart,
        end: input.selectionEnd
      };
    } else {
      selection = getOffsets(input);
    }
    return selection || { start: 0, end: 0 };
  }
  function setSelection(input, offsets) {
    var start = offsets.start, end = offsets.end;
    if (end === void 0) {
      end = start;
    }
    if ("selectionStart" in input) {
      input.selectionStart = start;
      input.selectionEnd = Math.min(end, input.value.length);
    } else {
      setOffsets(input, offsets);
    }
  }
  var skipSelectionChangeEvent = canUseDOM && "documentMode" in document && document.documentMode <= 11;
  var eventTypes$3 = {
    select: {
      phasedRegistrationNames: {
        bubbled: "onSelect",
        captured: "onSelectCapture"
      },
      dependencies: [TOP_BLUR, TOP_CONTEXT_MENU, TOP_DRAG_END, TOP_FOCUS, TOP_KEY_DOWN, TOP_KEY_UP, TOP_MOUSE_DOWN, TOP_MOUSE_UP, TOP_SELECTION_CHANGE]
    }
  };
  var activeElement$1 = null;
  var activeElementInst$1 = null;
  var lastSelection = null;
  var mouseDown = false;
  function getSelection(node) {
    if ("selectionStart" in node && hasSelectionCapabilities(node)) {
      return {
        start: node.selectionStart,
        end: node.selectionEnd
      };
    } else {
      var win = node.ownerDocument && node.ownerDocument.defaultView || window;
      var selection = win.getSelection();
      return {
        anchorNode: selection.anchorNode,
        anchorOffset: selection.anchorOffset,
        focusNode: selection.focusNode,
        focusOffset: selection.focusOffset
      };
    }
  }
  function getEventTargetDocument(eventTarget) {
    return eventTarget.window === eventTarget ? eventTarget.document : eventTarget.nodeType === DOCUMENT_NODE ? eventTarget : eventTarget.ownerDocument;
  }
  function constructSelectEvent(nativeEvent, nativeEventTarget) {
    var doc = getEventTargetDocument(nativeEventTarget);
    if (mouseDown || activeElement$1 == null || activeElement$1 !== getActiveElement(doc)) {
      return null;
    }
    var currentSelection = getSelection(activeElement$1);
    if (!lastSelection || !shallowEqual(lastSelection, currentSelection)) {
      lastSelection = currentSelection;
      var syntheticEvent = SyntheticEvent.getPooled(eventTypes$3.select, activeElementInst$1, nativeEvent, nativeEventTarget);
      syntheticEvent.type = "select";
      syntheticEvent.target = activeElement$1;
      accumulateTwoPhaseDispatches(syntheticEvent);
      return syntheticEvent;
    }
    return null;
  }
  var SelectEventPlugin = {
    eventTypes: eventTypes$3,
    extractEvents: function(topLevelType, targetInst, nativeEvent, nativeEventTarget) {
      var doc = getEventTargetDocument(nativeEventTarget);
      if (!doc || !isListeningToAllDependencies("onSelect", doc)) {
        return null;
      }
      var targetNode = targetInst ? getNodeFromInstance$1(targetInst) : window;
      switch (topLevelType) {
        // Track the input node that has focus.
        case TOP_FOCUS:
          if (isTextInputElement(targetNode) || targetNode.contentEditable === "true") {
            activeElement$1 = targetNode;
            activeElementInst$1 = targetInst;
            lastSelection = null;
          }
          break;
        case TOP_BLUR:
          activeElement$1 = null;
          activeElementInst$1 = null;
          lastSelection = null;
          break;
        // Don't fire the event while the user is dragging. This matches the
        // semantics of the native select event.
        case TOP_MOUSE_DOWN:
          mouseDown = true;
          break;
        case TOP_CONTEXT_MENU:
        case TOP_MOUSE_UP:
        case TOP_DRAG_END:
          mouseDown = false;
          return constructSelectEvent(nativeEvent, nativeEventTarget);
        // Chrome and IE fire non-standard event when selection is changed (and
        // sometimes when it hasn't). IE's event fires out of order with respect
        // to key and input events on deletion, so we discard it.
        //
        // Firefox doesn't support selectionchange, so check selection status
        // after each key entry. The selection changes after keydown and before
        // keyup, but we check on keydown as well in the case of holding down a
        // key, when multiple keydown events are fired but only one keyup is.
        // This is also our approach for IE handling, for the reason above.
        case TOP_SELECTION_CHANGE:
          if (skipSelectionChangeEvent) {
            break;
          }
        // falls through
        case TOP_KEY_DOWN:
        case TOP_KEY_UP:
          return constructSelectEvent(nativeEvent, nativeEventTarget);
      }
      return null;
    }
  };
  injection.injectEventPluginOrder(DOMEventPluginOrder);
  setComponentTree(getFiberCurrentPropsFromNode$1, getInstanceFromNode$1, getNodeFromInstance$1);
  injection.injectEventPluginsByName({
    SimpleEventPlugin,
    EnterLeaveEventPlugin,
    ChangeEventPlugin,
    SelectEventPlugin,
    BeforeInputEventPlugin
  });
  var didWarnSelectedSetOnOption = false;
  var didWarnInvalidChild = false;
  function flattenChildren(children) {
    var content = "";
    React2.Children.forEach(children, function(child) {
      if (child == null) {
        return;
      }
      content += child;
    });
    return content;
  }
  function validateProps(element, props) {
    {
      if (typeof props.children === "object" && props.children !== null) {
        React2.Children.forEach(props.children, function(child) {
          if (child == null) {
            return;
          }
          if (typeof child === "string" || typeof child === "number") {
            return;
          }
          if (typeof child.type !== "string") {
            return;
          }
          if (!didWarnInvalidChild) {
            didWarnInvalidChild = true;
            warning$1(false, "Only strings and numbers are supported as <option> children.");
          }
        });
      }
      if (props.selected != null && !didWarnSelectedSetOnOption) {
        warning$1(false, "Use the `defaultValue` or `value` props on <select> instead of setting `selected` on <option>.");
        didWarnSelectedSetOnOption = true;
      }
    }
  }
  function postMountWrapper$1(element, props) {
    if (props.value != null) {
      element.setAttribute("value", toString(getToStringValue(props.value)));
    }
  }
  function getHostProps$1(element, props) {
    var hostProps = _assign({ children: void 0 }, props);
    var content = flattenChildren(props.children);
    if (content) {
      hostProps.children = content;
    }
    return hostProps;
  }
  var didWarnValueDefaultValue$1 = void 0;
  {
    didWarnValueDefaultValue$1 = false;
  }
  function getDeclarationErrorAddendum() {
    var ownerName = getCurrentFiberOwnerNameInDevOrNull();
    if (ownerName) {
      return "\n\nCheck the render method of `" + ownerName + "`.";
    }
    return "";
  }
  var valuePropNames = ["value", "defaultValue"];
  function checkSelectPropTypes(props) {
    ReactControlledValuePropTypes.checkPropTypes("select", props);
    for (var i = 0; i < valuePropNames.length; i++) {
      var propName = valuePropNames[i];
      if (props[propName] == null) {
        continue;
      }
      var isArray2 = Array.isArray(props[propName]);
      if (props.multiple && !isArray2) {
        warning$1(false, "The `%s` prop supplied to <select> must be an array if `multiple` is true.%s", propName, getDeclarationErrorAddendum());
      } else if (!props.multiple && isArray2) {
        warning$1(false, "The `%s` prop supplied to <select> must be a scalar value if `multiple` is false.%s", propName, getDeclarationErrorAddendum());
      }
    }
  }
  function updateOptions(node, multiple, propValue, setDefaultSelected) {
    var options = node.options;
    if (multiple) {
      var selectedValues = propValue;
      var selectedValue = {};
      for (var i = 0; i < selectedValues.length; i++) {
        selectedValue["$" + selectedValues[i]] = true;
      }
      for (var _i = 0; _i < options.length; _i++) {
        var selected = selectedValue.hasOwnProperty("$" + options[_i].value);
        if (options[_i].selected !== selected) {
          options[_i].selected = selected;
        }
        if (selected && setDefaultSelected) {
          options[_i].defaultSelected = true;
        }
      }
    } else {
      var _selectedValue = toString(getToStringValue(propValue));
      var defaultSelected = null;
      for (var _i2 = 0; _i2 < options.length; _i2++) {
        if (options[_i2].value === _selectedValue) {
          options[_i2].selected = true;
          if (setDefaultSelected) {
            options[_i2].defaultSelected = true;
          }
          return;
        }
        if (defaultSelected === null && !options[_i2].disabled) {
          defaultSelected = options[_i2];
        }
      }
      if (defaultSelected !== null) {
        defaultSelected.selected = true;
      }
    }
  }
  function getHostProps$2(element, props) {
    return _assign({}, props, {
      value: void 0
    });
  }
  function initWrapperState$1(element, props) {
    var node = element;
    {
      checkSelectPropTypes(props);
    }
    node._wrapperState = {
      wasMultiple: !!props.multiple
    };
    {
      if (props.value !== void 0 && props.defaultValue !== void 0 && !didWarnValueDefaultValue$1) {
        warning$1(false, "Select elements must be either controlled or uncontrolled (specify either the value prop, or the defaultValue prop, but not both). Decide between using a controlled or uncontrolled select element and remove one of these props. More info: https://fb.me/react-controlled-components");
        didWarnValueDefaultValue$1 = true;
      }
    }
  }
  function postMountWrapper$2(element, props) {
    var node = element;
    node.multiple = !!props.multiple;
    var value = props.value;
    if (value != null) {
      updateOptions(node, !!props.multiple, value, false);
    } else if (props.defaultValue != null) {
      updateOptions(node, !!props.multiple, props.defaultValue, true);
    }
  }
  function postUpdateWrapper(element, props) {
    var node = element;
    var wasMultiple = node._wrapperState.wasMultiple;
    node._wrapperState.wasMultiple = !!props.multiple;
    var value = props.value;
    if (value != null) {
      updateOptions(node, !!props.multiple, value, false);
    } else if (wasMultiple !== !!props.multiple) {
      if (props.defaultValue != null) {
        updateOptions(node, !!props.multiple, props.defaultValue, true);
      } else {
        updateOptions(node, !!props.multiple, props.multiple ? [] : "", false);
      }
    }
  }
  function restoreControlledState$2(element, props) {
    var node = element;
    var value = props.value;
    if (value != null) {
      updateOptions(node, !!props.multiple, value, false);
    }
  }
  var didWarnValDefaultVal = false;
  function getHostProps$3(element, props) {
    var node = element;
    !(props.dangerouslySetInnerHTML == null) ? invariant(false, "`dangerouslySetInnerHTML` does not make sense on <textarea>.") : void 0;
    var hostProps = _assign({}, props, {
      value: void 0,
      defaultValue: void 0,
      children: toString(node._wrapperState.initialValue)
    });
    return hostProps;
  }
  function initWrapperState$2(element, props) {
    var node = element;
    {
      ReactControlledValuePropTypes.checkPropTypes("textarea", props);
      if (props.value !== void 0 && props.defaultValue !== void 0 && !didWarnValDefaultVal) {
        warning$1(false, "%s contains a textarea with both value and defaultValue props. Textarea elements must be either controlled or uncontrolled (specify either the value prop, or the defaultValue prop, but not both). Decide between using a controlled or uncontrolled textarea and remove one of these props. More info: https://fb.me/react-controlled-components", getCurrentFiberOwnerNameInDevOrNull() || "A component");
        didWarnValDefaultVal = true;
      }
    }
    var initialValue = props.value;
    if (initialValue == null) {
      var defaultValue = props.defaultValue;
      var children = props.children;
      if (children != null) {
        {
          warning$1(false, "Use the `defaultValue` or `value` props instead of setting children on <textarea>.");
        }
        !(defaultValue == null) ? invariant(false, "If you supply `defaultValue` on a <textarea>, do not pass children.") : void 0;
        if (Array.isArray(children)) {
          !(children.length <= 1) ? invariant(false, "<textarea> can only have at most one child.") : void 0;
          children = children[0];
        }
        defaultValue = children;
      }
      if (defaultValue == null) {
        defaultValue = "";
      }
      initialValue = defaultValue;
    }
    node._wrapperState = {
      initialValue: getToStringValue(initialValue)
    };
  }
  function updateWrapper$1(element, props) {
    var node = element;
    var value = getToStringValue(props.value);
    var defaultValue = getToStringValue(props.defaultValue);
    if (value != null) {
      var newValue = toString(value);
      if (newValue !== node.value) {
        node.value = newValue;
      }
      if (props.defaultValue == null && node.defaultValue !== newValue) {
        node.defaultValue = newValue;
      }
    }
    if (defaultValue != null) {
      node.defaultValue = toString(defaultValue);
    }
  }
  function postMountWrapper$3(element, props) {
    var node = element;
    var textContent = node.textContent;
    if (textContent === node._wrapperState.initialValue) {
      node.value = textContent;
    }
  }
  function restoreControlledState$3(element, props) {
    updateWrapper$1(element, props);
  }
  var HTML_NAMESPACE$1 = "http://www.w3.org/1999/xhtml";
  var MATH_NAMESPACE = "http://www.w3.org/1998/Math/MathML";
  var SVG_NAMESPACE = "http://www.w3.org/2000/svg";
  var Namespaces = {
    html: HTML_NAMESPACE$1,
    mathml: MATH_NAMESPACE,
    svg: SVG_NAMESPACE
  };
  function getIntrinsicNamespace(type) {
    switch (type) {
      case "svg":
        return SVG_NAMESPACE;
      case "math":
        return MATH_NAMESPACE;
      default:
        return HTML_NAMESPACE$1;
    }
  }
  function getChildNamespace(parentNamespace, type) {
    if (parentNamespace == null || parentNamespace === HTML_NAMESPACE$1) {
      return getIntrinsicNamespace(type);
    }
    if (parentNamespace === SVG_NAMESPACE && type === "foreignObject") {
      return HTML_NAMESPACE$1;
    }
    return parentNamespace;
  }
  var createMicrosoftUnsafeLocalFunction = function(func) {
    if (typeof MSApp !== "undefined" && MSApp.execUnsafeLocalFunction) {
      return function(arg0, arg1, arg2, arg3) {
        MSApp.execUnsafeLocalFunction(function() {
          return func(arg0, arg1, arg2, arg3);
        });
      };
    } else {
      return func;
    }
  };
  var reusableSVGContainer = void 0;
  var setInnerHTML = createMicrosoftUnsafeLocalFunction(function(node, html) {
    if (node.namespaceURI === Namespaces.svg && !("innerHTML" in node)) {
      reusableSVGContainer = reusableSVGContainer || document.createElement("div");
      reusableSVGContainer.innerHTML = "<svg>" + html + "</svg>";
      var svgNode = reusableSVGContainer.firstChild;
      while (node.firstChild) {
        node.removeChild(node.firstChild);
      }
      while (svgNode.firstChild) {
        node.appendChild(svgNode.firstChild);
      }
    } else {
      node.innerHTML = html;
    }
  });
  var setTextContent = function(node, text) {
    if (text) {
      var firstChild = node.firstChild;
      if (firstChild && firstChild === node.lastChild && firstChild.nodeType === TEXT_NODE) {
        firstChild.nodeValue = text;
        return;
      }
    }
    node.textContent = text;
  };
  var isUnitlessNumber = {
    animationIterationCount: true,
    borderImageOutset: true,
    borderImageSlice: true,
    borderImageWidth: true,
    boxFlex: true,
    boxFlexGroup: true,
    boxOrdinalGroup: true,
    columnCount: true,
    columns: true,
    flex: true,
    flexGrow: true,
    flexPositive: true,
    flexShrink: true,
    flexNegative: true,
    flexOrder: true,
    gridArea: true,
    gridRow: true,
    gridRowEnd: true,
    gridRowSpan: true,
    gridRowStart: true,
    gridColumn: true,
    gridColumnEnd: true,
    gridColumnSpan: true,
    gridColumnStart: true,
    fontWeight: true,
    lineClamp: true,
    lineHeight: true,
    opacity: true,
    order: true,
    orphans: true,
    tabSize: true,
    widows: true,
    zIndex: true,
    zoom: true,
    // SVG-related properties
    fillOpacity: true,
    floodOpacity: true,
    stopOpacity: true,
    strokeDasharray: true,
    strokeDashoffset: true,
    strokeMiterlimit: true,
    strokeOpacity: true,
    strokeWidth: true
  };
  function prefixKey(prefix, key) {
    return prefix + key.charAt(0).toUpperCase() + key.substring(1);
  }
  var prefixes = ["Webkit", "ms", "Moz", "O"];
  Object.keys(isUnitlessNumber).forEach(function(prop) {
    prefixes.forEach(function(prefix) {
      isUnitlessNumber[prefixKey(prefix, prop)] = isUnitlessNumber[prop];
    });
  });
  function dangerousStyleValue(name, value, isCustomProperty) {
    var isEmpty = value == null || typeof value === "boolean" || value === "";
    if (isEmpty) {
      return "";
    }
    if (!isCustomProperty && typeof value === "number" && value !== 0 && !(isUnitlessNumber.hasOwnProperty(name) && isUnitlessNumber[name])) {
      return value + "px";
    }
    return ("" + value).trim();
  }
  var uppercasePattern = /([A-Z])/g;
  var msPattern = /^ms-/;
  function hyphenateStyleName(name) {
    return name.replace(uppercasePattern, "-$1").toLowerCase().replace(msPattern, "-ms-");
  }
  var warnValidStyle = function() {
  };
  {
    var badVendoredStyleNamePattern = /^(?:webkit|moz|o)[A-Z]/;
    var msPattern$1 = /^-ms-/;
    var hyphenPattern = /-(.)/g;
    var badStyleValueWithSemicolonPattern = /;\s*$/;
    var warnedStyleNames = {};
    var warnedStyleValues = {};
    var warnedForNaNValue = false;
    var warnedForInfinityValue = false;
    var camelize = function(string) {
      return string.replace(hyphenPattern, function(_, character) {
        return character.toUpperCase();
      });
    };
    var warnHyphenatedStyleName = function(name) {
      if (warnedStyleNames.hasOwnProperty(name) && warnedStyleNames[name]) {
        return;
      }
      warnedStyleNames[name] = true;
      warning$1(
        false,
        "Unsupported style property %s. Did you mean %s?",
        name,
        // As Andi Smith suggests
        // (http://www.andismith.com/blog/2012/02/modernizr-prefixed/), an `-ms` prefix
        // is converted to lowercase `ms`.
        camelize(name.replace(msPattern$1, "ms-"))
      );
    };
    var warnBadVendoredStyleName = function(name) {
      if (warnedStyleNames.hasOwnProperty(name) && warnedStyleNames[name]) {
        return;
      }
      warnedStyleNames[name] = true;
      warning$1(false, "Unsupported vendor-prefixed style property %s. Did you mean %s?", name, name.charAt(0).toUpperCase() + name.slice(1));
    };
    var warnStyleValueWithSemicolon = function(name, value) {
      if (warnedStyleValues.hasOwnProperty(value) && warnedStyleValues[value]) {
        return;
      }
      warnedStyleValues[value] = true;
      warning$1(false, `Style property values shouldn't contain a semicolon. Try "%s: %s" instead.`, name, value.replace(badStyleValueWithSemicolonPattern, ""));
    };
    var warnStyleValueIsNaN = function(name, value) {
      if (warnedForNaNValue) {
        return;
      }
      warnedForNaNValue = true;
      warning$1(false, "`NaN` is an invalid value for the `%s` css style property.", name);
    };
    var warnStyleValueIsInfinity = function(name, value) {
      if (warnedForInfinityValue) {
        return;
      }
      warnedForInfinityValue = true;
      warning$1(false, "`Infinity` is an invalid value for the `%s` css style property.", name);
    };
    warnValidStyle = function(name, value) {
      if (name.indexOf("-") > -1) {
        warnHyphenatedStyleName(name);
      } else if (badVendoredStyleNamePattern.test(name)) {
        warnBadVendoredStyleName(name);
      } else if (badStyleValueWithSemicolonPattern.test(value)) {
        warnStyleValueWithSemicolon(name, value);
      }
      if (typeof value === "number") {
        if (isNaN(value)) {
          warnStyleValueIsNaN(name, value);
        } else if (!isFinite(value)) {
          warnStyleValueIsInfinity(name, value);
        }
      }
    };
  }
  var warnValidStyle$1 = warnValidStyle;
  function createDangerousStringForStyles(styles) {
    {
      var serialized = "";
      var delimiter = "";
      for (var styleName in styles) {
        if (!styles.hasOwnProperty(styleName)) {
          continue;
        }
        var styleValue = styles[styleName];
        if (styleValue != null) {
          var isCustomProperty = styleName.indexOf("--") === 0;
          serialized += delimiter + hyphenateStyleName(styleName) + ":";
          serialized += dangerousStyleValue(styleName, styleValue, isCustomProperty);
          delimiter = ";";
        }
      }
      return serialized || null;
    }
  }
  function setValueForStyles(node, styles) {
    var style2 = node.style;
    for (var styleName in styles) {
      if (!styles.hasOwnProperty(styleName)) {
        continue;
      }
      var isCustomProperty = styleName.indexOf("--") === 0;
      {
        if (!isCustomProperty) {
          warnValidStyle$1(styleName, styles[styleName]);
        }
      }
      var styleValue = dangerousStyleValue(styleName, styles[styleName], isCustomProperty);
      if (styleName === "float") {
        styleName = "cssFloat";
      }
      if (isCustomProperty) {
        style2.setProperty(styleName, styleValue);
      } else {
        style2[styleName] = styleValue;
      }
    }
  }
  var omittedCloseTags = {
    area: true,
    base: true,
    br: true,
    col: true,
    embed: true,
    hr: true,
    img: true,
    input: true,
    keygen: true,
    link: true,
    meta: true,
    param: true,
    source: true,
    track: true,
    wbr: true
    // NOTE: menuitem's close tag should be omitted, but that causes problems.
  };
  var voidElementTags = _assign({
    menuitem: true
  }, omittedCloseTags);
  var HTML$1 = "__html";
  var ReactDebugCurrentFrame$2 = null;
  {
    ReactDebugCurrentFrame$2 = ReactSharedInternals.ReactDebugCurrentFrame;
  }
  function assertValidProps(tag, props) {
    if (!props) {
      return;
    }
    if (voidElementTags[tag]) {
      !(props.children == null && props.dangerouslySetInnerHTML == null) ? invariant(false, "%s is a void element tag and must neither have `children` nor use `dangerouslySetInnerHTML`.%s", tag, ReactDebugCurrentFrame$2.getStackAddendum()) : void 0;
    }
    if (props.dangerouslySetInnerHTML != null) {
      !(props.children == null) ? invariant(false, "Can only set one of `children` or `props.dangerouslySetInnerHTML`.") : void 0;
      !(typeof props.dangerouslySetInnerHTML === "object" && HTML$1 in props.dangerouslySetInnerHTML) ? invariant(false, "`props.dangerouslySetInnerHTML` must be in the form `{__html: ...}`. Please visit https://fb.me/react-invariant-dangerously-set-inner-html for more information.") : void 0;
    }
    {
      !(props.suppressContentEditableWarning || !props.contentEditable || props.children == null) ? warning$1(false, "A component is `contentEditable` and contains `children` managed by React. It is now your responsibility to guarantee that none of those nodes are unexpectedly modified or duplicated. This is probably not intentional.") : void 0;
    }
    !(props.style == null || typeof props.style === "object") ? invariant(false, "The `style` prop expects a mapping from style properties to values, not a string. For example, style={{marginRight: spacing + 'em'}} when using JSX.%s", ReactDebugCurrentFrame$2.getStackAddendum()) : void 0;
  }
  function isCustomComponent(tagName, props) {
    if (tagName.indexOf("-") === -1) {
      return typeof props.is === "string";
    }
    switch (tagName) {
      // These are reserved SVG and MathML elements.
      // We don't mind this whitelist too much because we expect it to never grow.
      // The alternative is to track the namespace in a few places which is convoluted.
      // https://w3c.github.io/webcomponents/spec/custom/#custom-elements-core-concepts
      case "annotation-xml":
      case "color-profile":
      case "font-face":
      case "font-face-src":
      case "font-face-uri":
      case "font-face-format":
      case "font-face-name":
      case "missing-glyph":
        return false;
      default:
        return true;
    }
  }
  var possibleStandardNames = {
    // HTML
    accept: "accept",
    acceptcharset: "acceptCharset",
    "accept-charset": "acceptCharset",
    accesskey: "accessKey",
    action: "action",
    allowfullscreen: "allowFullScreen",
    alt: "alt",
    as: "as",
    async: "async",
    autocapitalize: "autoCapitalize",
    autocomplete: "autoComplete",
    autocorrect: "autoCorrect",
    autofocus: "autoFocus",
    autoplay: "autoPlay",
    autosave: "autoSave",
    capture: "capture",
    cellpadding: "cellPadding",
    cellspacing: "cellSpacing",
    challenge: "challenge",
    charset: "charSet",
    checked: "checked",
    children: "children",
    cite: "cite",
    class: "className",
    classid: "classID",
    classname: "className",
    cols: "cols",
    colspan: "colSpan",
    content: "content",
    contenteditable: "contentEditable",
    contextmenu: "contextMenu",
    controls: "controls",
    controlslist: "controlsList",
    coords: "coords",
    crossorigin: "crossOrigin",
    dangerouslysetinnerhtml: "dangerouslySetInnerHTML",
    data: "data",
    datetime: "dateTime",
    default: "default",
    defaultchecked: "defaultChecked",
    defaultvalue: "defaultValue",
    defer: "defer",
    dir: "dir",
    disabled: "disabled",
    download: "download",
    draggable: "draggable",
    enctype: "encType",
    for: "htmlFor",
    form: "form",
    formmethod: "formMethod",
    formaction: "formAction",
    formenctype: "formEncType",
    formnovalidate: "formNoValidate",
    formtarget: "formTarget",
    frameborder: "frameBorder",
    headers: "headers",
    height: "height",
    hidden: "hidden",
    high: "high",
    href: "href",
    hreflang: "hrefLang",
    htmlfor: "htmlFor",
    httpequiv: "httpEquiv",
    "http-equiv": "httpEquiv",
    icon: "icon",
    id: "id",
    innerhtml: "innerHTML",
    inputmode: "inputMode",
    integrity: "integrity",
    is: "is",
    itemid: "itemID",
    itemprop: "itemProp",
    itemref: "itemRef",
    itemscope: "itemScope",
    itemtype: "itemType",
    keyparams: "keyParams",
    keytype: "keyType",
    kind: "kind",
    label: "label",
    lang: "lang",
    list: "list",
    loop: "loop",
    low: "low",
    manifest: "manifest",
    marginwidth: "marginWidth",
    marginheight: "marginHeight",
    max: "max",
    maxlength: "maxLength",
    media: "media",
    mediagroup: "mediaGroup",
    method: "method",
    min: "min",
    minlength: "minLength",
    multiple: "multiple",
    muted: "muted",
    name: "name",
    nomodule: "noModule",
    nonce: "nonce",
    novalidate: "noValidate",
    open: "open",
    optimum: "optimum",
    pattern: "pattern",
    placeholder: "placeholder",
    playsinline: "playsInline",
    poster: "poster",
    preload: "preload",
    profile: "profile",
    radiogroup: "radioGroup",
    readonly: "readOnly",
    referrerpolicy: "referrerPolicy",
    rel: "rel",
    required: "required",
    reversed: "reversed",
    role: "role",
    rows: "rows",
    rowspan: "rowSpan",
    sandbox: "sandbox",
    scope: "scope",
    scoped: "scoped",
    scrolling: "scrolling",
    seamless: "seamless",
    selected: "selected",
    shape: "shape",
    size: "size",
    sizes: "sizes",
    span: "span",
    spellcheck: "spellCheck",
    src: "src",
    srcdoc: "srcDoc",
    srclang: "srcLang",
    srcset: "srcSet",
    start: "start",
    step: "step",
    style: "style",
    summary: "summary",
    tabindex: "tabIndex",
    target: "target",
    title: "title",
    type: "type",
    usemap: "useMap",
    value: "value",
    width: "width",
    wmode: "wmode",
    wrap: "wrap",
    // SVG
    about: "about",
    accentheight: "accentHeight",
    "accent-height": "accentHeight",
    accumulate: "accumulate",
    additive: "additive",
    alignmentbaseline: "alignmentBaseline",
    "alignment-baseline": "alignmentBaseline",
    allowreorder: "allowReorder",
    alphabetic: "alphabetic",
    amplitude: "amplitude",
    arabicform: "arabicForm",
    "arabic-form": "arabicForm",
    ascent: "ascent",
    attributename: "attributeName",
    attributetype: "attributeType",
    autoreverse: "autoReverse",
    azimuth: "azimuth",
    basefrequency: "baseFrequency",
    baselineshift: "baselineShift",
    "baseline-shift": "baselineShift",
    baseprofile: "baseProfile",
    bbox: "bbox",
    begin: "begin",
    bias: "bias",
    by: "by",
    calcmode: "calcMode",
    capheight: "capHeight",
    "cap-height": "capHeight",
    clip: "clip",
    clippath: "clipPath",
    "clip-path": "clipPath",
    clippathunits: "clipPathUnits",
    cliprule: "clipRule",
    "clip-rule": "clipRule",
    color: "color",
    colorinterpolation: "colorInterpolation",
    "color-interpolation": "colorInterpolation",
    colorinterpolationfilters: "colorInterpolationFilters",
    "color-interpolation-filters": "colorInterpolationFilters",
    colorprofile: "colorProfile",
    "color-profile": "colorProfile",
    colorrendering: "colorRendering",
    "color-rendering": "colorRendering",
    contentscripttype: "contentScriptType",
    contentstyletype: "contentStyleType",
    cursor: "cursor",
    cx: "cx",
    cy: "cy",
    d: "d",
    datatype: "datatype",
    decelerate: "decelerate",
    descent: "descent",
    diffuseconstant: "diffuseConstant",
    direction: "direction",
    display: "display",
    divisor: "divisor",
    dominantbaseline: "dominantBaseline",
    "dominant-baseline": "dominantBaseline",
    dur: "dur",
    dx: "dx",
    dy: "dy",
    edgemode: "edgeMode",
    elevation: "elevation",
    enablebackground: "enableBackground",
    "enable-background": "enableBackground",
    end: "end",
    exponent: "exponent",
    externalresourcesrequired: "externalResourcesRequired",
    fill: "fill",
    fillopacity: "fillOpacity",
    "fill-opacity": "fillOpacity",
    fillrule: "fillRule",
    "fill-rule": "fillRule",
    filter: "filter",
    filterres: "filterRes",
    filterunits: "filterUnits",
    floodopacity: "floodOpacity",
    "flood-opacity": "floodOpacity",
    floodcolor: "floodColor",
    "flood-color": "floodColor",
    focusable: "focusable",
    fontfamily: "fontFamily",
    "font-family": "fontFamily",
    fontsize: "fontSize",
    "font-size": "fontSize",
    fontsizeadjust: "fontSizeAdjust",
    "font-size-adjust": "fontSizeAdjust",
    fontstretch: "fontStretch",
    "font-stretch": "fontStretch",
    fontstyle: "fontStyle",
    "font-style": "fontStyle",
    fontvariant: "fontVariant",
    "font-variant": "fontVariant",
    fontweight: "fontWeight",
    "font-weight": "fontWeight",
    format: "format",
    from: "from",
    fx: "fx",
    fy: "fy",
    g1: "g1",
    g2: "g2",
    glyphname: "glyphName",
    "glyph-name": "glyphName",
    glyphorientationhorizontal: "glyphOrientationHorizontal",
    "glyph-orientation-horizontal": "glyphOrientationHorizontal",
    glyphorientationvertical: "glyphOrientationVertical",
    "glyph-orientation-vertical": "glyphOrientationVertical",
    glyphref: "glyphRef",
    gradienttransform: "gradientTransform",
    gradientunits: "gradientUnits",
    hanging: "hanging",
    horizadvx: "horizAdvX",
    "horiz-adv-x": "horizAdvX",
    horizoriginx: "horizOriginX",
    "horiz-origin-x": "horizOriginX",
    ideographic: "ideographic",
    imagerendering: "imageRendering",
    "image-rendering": "imageRendering",
    in2: "in2",
    in: "in",
    inlist: "inlist",
    intercept: "intercept",
    k1: "k1",
    k2: "k2",
    k3: "k3",
    k4: "k4",
    k: "k",
    kernelmatrix: "kernelMatrix",
    kernelunitlength: "kernelUnitLength",
    kerning: "kerning",
    keypoints: "keyPoints",
    keysplines: "keySplines",
    keytimes: "keyTimes",
    lengthadjust: "lengthAdjust",
    letterspacing: "letterSpacing",
    "letter-spacing": "letterSpacing",
    lightingcolor: "lightingColor",
    "lighting-color": "lightingColor",
    limitingconeangle: "limitingConeAngle",
    local: "local",
    markerend: "markerEnd",
    "marker-end": "markerEnd",
    markerheight: "markerHeight",
    markermid: "markerMid",
    "marker-mid": "markerMid",
    markerstart: "markerStart",
    "marker-start": "markerStart",
    markerunits: "markerUnits",
    markerwidth: "markerWidth",
    mask: "mask",
    maskcontentunits: "maskContentUnits",
    maskunits: "maskUnits",
    mathematical: "mathematical",
    mode: "mode",
    numoctaves: "numOctaves",
    offset: "offset",
    opacity: "opacity",
    operator: "operator",
    order: "order",
    orient: "orient",
    orientation: "orientation",
    origin: "origin",
    overflow: "overflow",
    overlineposition: "overlinePosition",
    "overline-position": "overlinePosition",
    overlinethickness: "overlineThickness",
    "overline-thickness": "overlineThickness",
    paintorder: "paintOrder",
    "paint-order": "paintOrder",
    panose1: "panose1",
    "panose-1": "panose1",
    pathlength: "pathLength",
    patterncontentunits: "patternContentUnits",
    patterntransform: "patternTransform",
    patternunits: "patternUnits",
    pointerevents: "pointerEvents",
    "pointer-events": "pointerEvents",
    points: "points",
    pointsatx: "pointsAtX",
    pointsaty: "pointsAtY",
    pointsatz: "pointsAtZ",
    prefix: "prefix",
    preservealpha: "preserveAlpha",
    preserveaspectratio: "preserveAspectRatio",
    primitiveunits: "primitiveUnits",
    property: "property",
    r: "r",
    radius: "radius",
    refx: "refX",
    refy: "refY",
    renderingintent: "renderingIntent",
    "rendering-intent": "renderingIntent",
    repeatcount: "repeatCount",
    repeatdur: "repeatDur",
    requiredextensions: "requiredExtensions",
    requiredfeatures: "requiredFeatures",
    resource: "resource",
    restart: "restart",
    result: "result",
    results: "results",
    rotate: "rotate",
    rx: "rx",
    ry: "ry",
    scale: "scale",
    security: "security",
    seed: "seed",
    shaperendering: "shapeRendering",
    "shape-rendering": "shapeRendering",
    slope: "slope",
    spacing: "spacing",
    specularconstant: "specularConstant",
    specularexponent: "specularExponent",
    speed: "speed",
    spreadmethod: "spreadMethod",
    startoffset: "startOffset",
    stddeviation: "stdDeviation",
    stemh: "stemh",
    stemv: "stemv",
    stitchtiles: "stitchTiles",
    stopcolor: "stopColor",
    "stop-color": "stopColor",
    stopopacity: "stopOpacity",
    "stop-opacity": "stopOpacity",
    strikethroughposition: "strikethroughPosition",
    "strikethrough-position": "strikethroughPosition",
    strikethroughthickness: "strikethroughThickness",
    "strikethrough-thickness": "strikethroughThickness",
    string: "string",
    stroke: "stroke",
    strokedasharray: "strokeDasharray",
    "stroke-dasharray": "strokeDasharray",
    strokedashoffset: "strokeDashoffset",
    "stroke-dashoffset": "strokeDashoffset",
    strokelinecap: "strokeLinecap",
    "stroke-linecap": "strokeLinecap",
    strokelinejoin: "strokeLinejoin",
    "stroke-linejoin": "strokeLinejoin",
    strokemiterlimit: "strokeMiterlimit",
    "stroke-miterlimit": "strokeMiterlimit",
    strokewidth: "strokeWidth",
    "stroke-width": "strokeWidth",
    strokeopacity: "strokeOpacity",
    "stroke-opacity": "strokeOpacity",
    suppresscontenteditablewarning: "suppressContentEditableWarning",
    suppresshydrationwarning: "suppressHydrationWarning",
    surfacescale: "surfaceScale",
    systemlanguage: "systemLanguage",
    tablevalues: "tableValues",
    targetx: "targetX",
    targety: "targetY",
    textanchor: "textAnchor",
    "text-anchor": "textAnchor",
    textdecoration: "textDecoration",
    "text-decoration": "textDecoration",
    textlength: "textLength",
    textrendering: "textRendering",
    "text-rendering": "textRendering",
    to: "to",
    transform: "transform",
    typeof: "typeof",
    u1: "u1",
    u2: "u2",
    underlineposition: "underlinePosition",
    "underline-position": "underlinePosition",
    underlinethickness: "underlineThickness",
    "underline-thickness": "underlineThickness",
    unicode: "unicode",
    unicodebidi: "unicodeBidi",
    "unicode-bidi": "unicodeBidi",
    unicoderange: "unicodeRange",
    "unicode-range": "unicodeRange",
    unitsperem: "unitsPerEm",
    "units-per-em": "unitsPerEm",
    unselectable: "unselectable",
    valphabetic: "vAlphabetic",
    "v-alphabetic": "vAlphabetic",
    values: "values",
    vectoreffect: "vectorEffect",
    "vector-effect": "vectorEffect",
    version: "version",
    vertadvy: "vertAdvY",
    "vert-adv-y": "vertAdvY",
    vertoriginx: "vertOriginX",
    "vert-origin-x": "vertOriginX",
    vertoriginy: "vertOriginY",
    "vert-origin-y": "vertOriginY",
    vhanging: "vHanging",
    "v-hanging": "vHanging",
    videographic: "vIdeographic",
    "v-ideographic": "vIdeographic",
    viewbox: "viewBox",
    viewtarget: "viewTarget",
    visibility: "visibility",
    vmathematical: "vMathematical",
    "v-mathematical": "vMathematical",
    vocab: "vocab",
    widths: "widths",
    wordspacing: "wordSpacing",
    "word-spacing": "wordSpacing",
    writingmode: "writingMode",
    "writing-mode": "writingMode",
    x1: "x1",
    x2: "x2",
    x: "x",
    xchannelselector: "xChannelSelector",
    xheight: "xHeight",
    "x-height": "xHeight",
    xlinkactuate: "xlinkActuate",
    "xlink:actuate": "xlinkActuate",
    xlinkarcrole: "xlinkArcrole",
    "xlink:arcrole": "xlinkArcrole",
    xlinkhref: "xlinkHref",
    "xlink:href": "xlinkHref",
    xlinkrole: "xlinkRole",
    "xlink:role": "xlinkRole",
    xlinkshow: "xlinkShow",
    "xlink:show": "xlinkShow",
    xlinktitle: "xlinkTitle",
    "xlink:title": "xlinkTitle",
    xlinktype: "xlinkType",
    "xlink:type": "xlinkType",
    xmlbase: "xmlBase",
    "xml:base": "xmlBase",
    xmllang: "xmlLang",
    "xml:lang": "xmlLang",
    xmlns: "xmlns",
    "xml:space": "xmlSpace",
    xmlnsxlink: "xmlnsXlink",
    "xmlns:xlink": "xmlnsXlink",
    xmlspace: "xmlSpace",
    y1: "y1",
    y2: "y2",
    y: "y",
    ychannelselector: "yChannelSelector",
    z: "z",
    zoomandpan: "zoomAndPan"
  };
  var ariaProperties = {
    "aria-current": 0,
    // state
    "aria-details": 0,
    "aria-disabled": 0,
    // state
    "aria-hidden": 0,
    // state
    "aria-invalid": 0,
    // state
    "aria-keyshortcuts": 0,
    "aria-label": 0,
    "aria-roledescription": 0,
    // Widget Attributes
    "aria-autocomplete": 0,
    "aria-checked": 0,
    "aria-expanded": 0,
    "aria-haspopup": 0,
    "aria-level": 0,
    "aria-modal": 0,
    "aria-multiline": 0,
    "aria-multiselectable": 0,
    "aria-orientation": 0,
    "aria-placeholder": 0,
    "aria-pressed": 0,
    "aria-readonly": 0,
    "aria-required": 0,
    "aria-selected": 0,
    "aria-sort": 0,
    "aria-valuemax": 0,
    "aria-valuemin": 0,
    "aria-valuenow": 0,
    "aria-valuetext": 0,
    // Live Region Attributes
    "aria-atomic": 0,
    "aria-busy": 0,
    "aria-live": 0,
    "aria-relevant": 0,
    // Drag-and-Drop Attributes
    "aria-dropeffect": 0,
    "aria-grabbed": 0,
    // Relationship Attributes
    "aria-activedescendant": 0,
    "aria-colcount": 0,
    "aria-colindex": 0,
    "aria-colspan": 0,
    "aria-controls": 0,
    "aria-describedby": 0,
    "aria-errormessage": 0,
    "aria-flowto": 0,
    "aria-labelledby": 0,
    "aria-owns": 0,
    "aria-posinset": 0,
    "aria-rowcount": 0,
    "aria-rowindex": 0,
    "aria-rowspan": 0,
    "aria-setsize": 0
  };
  var warnedProperties = {};
  var rARIA = new RegExp("^(aria)-[" + ATTRIBUTE_NAME_CHAR + "]*$");
  var rARIACamel = new RegExp("^(aria)[A-Z][" + ATTRIBUTE_NAME_CHAR + "]*$");
  var hasOwnProperty$2 = Object.prototype.hasOwnProperty;
  function validateProperty(tagName, name) {
    if (hasOwnProperty$2.call(warnedProperties, name) && warnedProperties[name]) {
      return true;
    }
    if (rARIACamel.test(name)) {
      var ariaName = "aria-" + name.slice(4).toLowerCase();
      var correctName = ariaProperties.hasOwnProperty(ariaName) ? ariaName : null;
      if (correctName == null) {
        warning$1(false, "Invalid ARIA attribute `%s`. ARIA attributes follow the pattern aria-* and must be lowercase.", name);
        warnedProperties[name] = true;
        return true;
      }
      if (name !== correctName) {
        warning$1(false, "Invalid ARIA attribute `%s`. Did you mean `%s`?", name, correctName);
        warnedProperties[name] = true;
        return true;
      }
    }
    if (rARIA.test(name)) {
      var lowerCasedName = name.toLowerCase();
      var standardName = ariaProperties.hasOwnProperty(lowerCasedName) ? lowerCasedName : null;
      if (standardName == null) {
        warnedProperties[name] = true;
        return false;
      }
      if (name !== standardName) {
        warning$1(false, "Unknown ARIA attribute `%s`. Did you mean `%s`?", name, standardName);
        warnedProperties[name] = true;
        return true;
      }
    }
    return true;
  }
  function warnInvalidARIAProps(type, props) {
    var invalidProps = [];
    for (var key in props) {
      var isValid = validateProperty(type, key);
      if (!isValid) {
        invalidProps.push(key);
      }
    }
    var unknownPropString = invalidProps.map(function(prop) {
      return "`" + prop + "`";
    }).join(", ");
    if (invalidProps.length === 1) {
      warning$1(false, "Invalid aria prop %s on <%s> tag. For details, see https://fb.me/invalid-aria-prop", unknownPropString, type);
    } else if (invalidProps.length > 1) {
      warning$1(false, "Invalid aria props %s on <%s> tag. For details, see https://fb.me/invalid-aria-prop", unknownPropString, type);
    }
  }
  function validateProperties(type, props) {
    if (isCustomComponent(type, props)) {
      return;
    }
    warnInvalidARIAProps(type, props);
  }
  var didWarnValueNull = false;
  function validateProperties$1(type, props) {
    if (type !== "input" && type !== "textarea" && type !== "select") {
      return;
    }
    if (props != null && props.value === null && !didWarnValueNull) {
      didWarnValueNull = true;
      if (type === "select" && props.multiple) {
        warning$1(false, "`value` prop on `%s` should not be null. Consider using an empty array when `multiple` is set to `true` to clear the component or `undefined` for uncontrolled components.", type);
      } else {
        warning$1(false, "`value` prop on `%s` should not be null. Consider using an empty string to clear the component or `undefined` for uncontrolled components.", type);
      }
    }
  }
  var validateProperty$1 = function() {
  };
  {
    var warnedProperties$1 = {};
    var _hasOwnProperty = Object.prototype.hasOwnProperty;
    var EVENT_NAME_REGEX = /^on./;
    var INVALID_EVENT_NAME_REGEX = /^on[^A-Z]/;
    var rARIA$1 = new RegExp("^(aria)-[" + ATTRIBUTE_NAME_CHAR + "]*$");
    var rARIACamel$1 = new RegExp("^(aria)[A-Z][" + ATTRIBUTE_NAME_CHAR + "]*$");
    validateProperty$1 = function(tagName, name, value, canUseEventSystem) {
      if (_hasOwnProperty.call(warnedProperties$1, name) && warnedProperties$1[name]) {
        return true;
      }
      var lowerCasedName = name.toLowerCase();
      if (lowerCasedName === "onfocusin" || lowerCasedName === "onfocusout") {
        warning$1(false, "React uses onFocus and onBlur instead of onFocusIn and onFocusOut. All React events are normalized to bubble, so onFocusIn and onFocusOut are not needed/supported by React.");
        warnedProperties$1[name] = true;
        return true;
      }
      if (canUseEventSystem) {
        if (registrationNameModules.hasOwnProperty(name)) {
          return true;
        }
        var registrationName = possibleRegistrationNames.hasOwnProperty(lowerCasedName) ? possibleRegistrationNames[lowerCasedName] : null;
        if (registrationName != null) {
          warning$1(false, "Invalid event handler property `%s`. Did you mean `%s`?", name, registrationName);
          warnedProperties$1[name] = true;
          return true;
        }
        if (EVENT_NAME_REGEX.test(name)) {
          warning$1(false, "Unknown event handler property `%s`. It will be ignored.", name);
          warnedProperties$1[name] = true;
          return true;
        }
      } else if (EVENT_NAME_REGEX.test(name)) {
        if (INVALID_EVENT_NAME_REGEX.test(name)) {
          warning$1(false, "Invalid event handler property `%s`. React events use the camelCase naming convention, for example `onClick`.", name);
        }
        warnedProperties$1[name] = true;
        return true;
      }
      if (rARIA$1.test(name) || rARIACamel$1.test(name)) {
        return true;
      }
      if (lowerCasedName === "innerhtml") {
        warning$1(false, "Directly setting property `innerHTML` is not permitted. For more information, lookup documentation on `dangerouslySetInnerHTML`.");
        warnedProperties$1[name] = true;
        return true;
      }
      if (lowerCasedName === "aria") {
        warning$1(false, "The `aria` attribute is reserved for future use in React. Pass individual `aria-` attributes instead.");
        warnedProperties$1[name] = true;
        return true;
      }
      if (lowerCasedName === "is" && value !== null && value !== void 0 && typeof value !== "string") {
        warning$1(false, "Received a `%s` for a string attribute `is`. If this is expected, cast the value to a string.", typeof value);
        warnedProperties$1[name] = true;
        return true;
      }
      if (typeof value === "number" && isNaN(value)) {
        warning$1(false, "Received NaN for the `%s` attribute. If this is expected, cast the value to a string.", name);
        warnedProperties$1[name] = true;
        return true;
      }
      var propertyInfo = getPropertyInfo(name);
      var isReserved = propertyInfo !== null && propertyInfo.type === RESERVED;
      if (possibleStandardNames.hasOwnProperty(lowerCasedName)) {
        var standardName = possibleStandardNames[lowerCasedName];
        if (standardName !== name) {
          warning$1(false, "Invalid DOM property `%s`. Did you mean `%s`?", name, standardName);
          warnedProperties$1[name] = true;
          return true;
        }
      } else if (!isReserved && name !== lowerCasedName) {
        warning$1(false, "React does not recognize the `%s` prop on a DOM element. If you intentionally want it to appear in the DOM as a custom attribute, spell it as lowercase `%s` instead. If you accidentally passed it from a parent component, remove it from the DOM element.", name, lowerCasedName);
        warnedProperties$1[name] = true;
        return true;
      }
      if (typeof value === "boolean" && shouldRemoveAttributeWithWarning(name, value, propertyInfo, false)) {
        if (value) {
          warning$1(false, 'Received `%s` for a non-boolean attribute `%s`.\n\nIf you want to write it to the DOM, pass a string instead: %s="%s" or %s={value.toString()}.', value, name, name, value, name);
        } else {
          warning$1(false, 'Received `%s` for a non-boolean attribute `%s`.\n\nIf you want to write it to the DOM, pass a string instead: %s="%s" or %s={value.toString()}.\n\nIf you used to conditionally omit it with %s={condition && value}, pass %s={condition ? value : undefined} instead.', value, name, name, value, name, name, name);
        }
        warnedProperties$1[name] = true;
        return true;
      }
      if (isReserved) {
        return true;
      }
      if (shouldRemoveAttributeWithWarning(name, value, propertyInfo, false)) {
        warnedProperties$1[name] = true;
        return false;
      }
      if ((value === "false" || value === "true") && propertyInfo !== null && propertyInfo.type === BOOLEAN) {
        warning$1(false, "Received the string `%s` for the boolean attribute `%s`. %s Did you mean %s={%s}?", value, name, value === "false" ? "The browser will interpret it as a truthy value." : 'Although this works, it will not work as expected if you pass the string "false".', name, value);
        warnedProperties$1[name] = true;
        return true;
      }
      return true;
    };
  }
  var warnUnknownProperties = function(type, props, canUseEventSystem) {
    var unknownProps = [];
    for (var key in props) {
      var isValid = validateProperty$1(type, key, props[key], canUseEventSystem);
      if (!isValid) {
        unknownProps.push(key);
      }
    }
    var unknownPropString = unknownProps.map(function(prop) {
      return "`" + prop + "`";
    }).join(", ");
    if (unknownProps.length === 1) {
      warning$1(false, "Invalid value for prop %s on <%s> tag. Either remove it from the element, or pass a string or number value to keep it in the DOM. For details, see https://fb.me/react-attribute-behavior", unknownPropString, type);
    } else if (unknownProps.length > 1) {
      warning$1(false, "Invalid values for props %s on <%s> tag. Either remove them from the element, or pass a string or number value to keep them in the DOM. For details, see https://fb.me/react-attribute-behavior", unknownPropString, type);
    }
  };
  function validateProperties$2(type, props, canUseEventSystem) {
    if (isCustomComponent(type, props)) {
      return;
    }
    warnUnknownProperties(type, props, canUseEventSystem);
  }
  var didWarnInvalidHydration = false;
  var didWarnShadyDOM = false;
  var DANGEROUSLY_SET_INNER_HTML = "dangerouslySetInnerHTML";
  var SUPPRESS_CONTENT_EDITABLE_WARNING = "suppressContentEditableWarning";
  var SUPPRESS_HYDRATION_WARNING$1 = "suppressHydrationWarning";
  var AUTOFOCUS = "autoFocus";
  var CHILDREN = "children";
  var STYLE$1 = "style";
  var HTML = "__html";
  var HTML_NAMESPACE = Namespaces.html;
  var warnedUnknownTags = void 0;
  var suppressHydrationWarning = void 0;
  var validatePropertiesInDevelopment = void 0;
  var warnForTextDifference = void 0;
  var warnForPropDifference = void 0;
  var warnForExtraAttributes = void 0;
  var warnForInvalidEventListener = void 0;
  var canDiffStyleForHydrationWarning = void 0;
  var normalizeMarkupForTextOrAttribute = void 0;
  var normalizeHTML = void 0;
  {
    warnedUnknownTags = {
      // Chrome is the only major browser not shipping <time>. But as of July
      // 2017 it intends to ship it due to widespread usage. We intentionally
      // *don't* warn for <time> even if it's unrecognized by Chrome because
      // it soon will be, and many apps have been using it anyway.
      time: true,
      // There are working polyfills for <dialog>. Let people use it.
      dialog: true,
      // Electron ships a custom <webview> tag to display external web content in
      // an isolated frame and process.
      // This tag is not present in non Electron environments such as JSDom which
      // is often used for testing purposes.
      // @see https://electronjs.org/docs/api/webview-tag
      webview: true
    };
    validatePropertiesInDevelopment = function(type, props) {
      validateProperties(type, props);
      validateProperties$1(type, props);
      validateProperties$2(
        type,
        props,
        /* canUseEventSystem */
        true
      );
    };
    canDiffStyleForHydrationWarning = canUseDOM && !document.documentMode;
    var NORMALIZE_NEWLINES_REGEX = /\r\n?/g;
    var NORMALIZE_NULL_AND_REPLACEMENT_REGEX = /\u0000|\uFFFD/g;
    normalizeMarkupForTextOrAttribute = function(markup) {
      var markupString = typeof markup === "string" ? markup : "" + markup;
      return markupString.replace(NORMALIZE_NEWLINES_REGEX, "\n").replace(NORMALIZE_NULL_AND_REPLACEMENT_REGEX, "");
    };
    warnForTextDifference = function(serverText, clientText) {
      if (didWarnInvalidHydration) {
        return;
      }
      var normalizedClientText = normalizeMarkupForTextOrAttribute(clientText);
      var normalizedServerText = normalizeMarkupForTextOrAttribute(serverText);
      if (normalizedServerText === normalizedClientText) {
        return;
      }
      didWarnInvalidHydration = true;
      warningWithoutStack$1(false, 'Text content did not match. Server: "%s" Client: "%s"', normalizedServerText, normalizedClientText);
    };
    warnForPropDifference = function(propName, serverValue, clientValue) {
      if (didWarnInvalidHydration) {
        return;
      }
      var normalizedClientValue = normalizeMarkupForTextOrAttribute(clientValue);
      var normalizedServerValue = normalizeMarkupForTextOrAttribute(serverValue);
      if (normalizedServerValue === normalizedClientValue) {
        return;
      }
      didWarnInvalidHydration = true;
      warningWithoutStack$1(false, "Prop `%s` did not match. Server: %s Client: %s", propName, JSON.stringify(normalizedServerValue), JSON.stringify(normalizedClientValue));
    };
    warnForExtraAttributes = function(attributeNames) {
      if (didWarnInvalidHydration) {
        return;
      }
      didWarnInvalidHydration = true;
      var names = [];
      attributeNames.forEach(function(name) {
        names.push(name);
      });
      warningWithoutStack$1(false, "Extra attributes from the server: %s", names);
    };
    warnForInvalidEventListener = function(registrationName, listener) {
      if (listener === false) {
        warning$1(false, "Expected `%s` listener to be a function, instead got `false`.\n\nIf you used to conditionally omit it with %s={condition && value}, pass %s={condition ? value : undefined} instead.", registrationName, registrationName, registrationName);
      } else {
        warning$1(false, "Expected `%s` listener to be a function, instead got a value of `%s` type.", registrationName, typeof listener);
      }
    };
    normalizeHTML = function(parent, html) {
      var testElement = parent.namespaceURI === HTML_NAMESPACE ? parent.ownerDocument.createElement(parent.tagName) : parent.ownerDocument.createElementNS(parent.namespaceURI, parent.tagName);
      testElement.innerHTML = html;
      return testElement.innerHTML;
    };
  }
  function ensureListeningTo(rootContainerElement, registrationName) {
    var isDocumentOrFragment = rootContainerElement.nodeType === DOCUMENT_NODE || rootContainerElement.nodeType === DOCUMENT_FRAGMENT_NODE;
    var doc = isDocumentOrFragment ? rootContainerElement : rootContainerElement.ownerDocument;
    listenTo(registrationName, doc);
  }
  function getOwnerDocumentFromRootContainer(rootContainerElement) {
    return rootContainerElement.nodeType === DOCUMENT_NODE ? rootContainerElement : rootContainerElement.ownerDocument;
  }
  function noop() {
  }
  function trapClickOnNonInteractiveElement(node) {
    node.onclick = noop;
  }
  function setInitialDOMProperties(tag, domElement, rootContainerElement, nextProps, isCustomComponentTag) {
    for (var propKey in nextProps) {
      if (!nextProps.hasOwnProperty(propKey)) {
        continue;
      }
      var nextProp = nextProps[propKey];
      if (propKey === STYLE$1) {
        {
          if (nextProp) {
            Object.freeze(nextProp);
          }
        }
        setValueForStyles(domElement, nextProp);
      } else if (propKey === DANGEROUSLY_SET_INNER_HTML) {
        var nextHtml = nextProp ? nextProp[HTML] : void 0;
        if (nextHtml != null) {
          setInnerHTML(domElement, nextHtml);
        }
      } else if (propKey === CHILDREN) {
        if (typeof nextProp === "string") {
          var canSetTextContent = tag !== "textarea" || nextProp !== "";
          if (canSetTextContent) {
            setTextContent(domElement, nextProp);
          }
        } else if (typeof nextProp === "number") {
          setTextContent(domElement, "" + nextProp);
        }
      } else if (propKey === SUPPRESS_CONTENT_EDITABLE_WARNING || propKey === SUPPRESS_HYDRATION_WARNING$1) {
      } else if (propKey === AUTOFOCUS) {
      } else if (registrationNameModules.hasOwnProperty(propKey)) {
        if (nextProp != null) {
          if (typeof nextProp !== "function") {
            warnForInvalidEventListener(propKey, nextProp);
          }
          ensureListeningTo(rootContainerElement, propKey);
        }
      } else if (nextProp != null) {
        setValueForProperty(domElement, propKey, nextProp, isCustomComponentTag);
      }
    }
  }
  function updateDOMProperties(domElement, updatePayload, wasCustomComponentTag, isCustomComponentTag) {
    for (var i = 0; i < updatePayload.length; i += 2) {
      var propKey = updatePayload[i];
      var propValue = updatePayload[i + 1];
      if (propKey === STYLE$1) {
        setValueForStyles(domElement, propValue);
      } else if (propKey === DANGEROUSLY_SET_INNER_HTML) {
        setInnerHTML(domElement, propValue);
      } else if (propKey === CHILDREN) {
        setTextContent(domElement, propValue);
      } else {
        setValueForProperty(domElement, propKey, propValue, isCustomComponentTag);
      }
    }
  }
  function createElement(type, props, rootContainerElement, parentNamespace) {
    var isCustomComponentTag = void 0;
    var ownerDocument = getOwnerDocumentFromRootContainer(rootContainerElement);
    var domElement = void 0;
    var namespaceURI = parentNamespace;
    if (namespaceURI === HTML_NAMESPACE) {
      namespaceURI = getIntrinsicNamespace(type);
    }
    if (namespaceURI === HTML_NAMESPACE) {
      {
        isCustomComponentTag = isCustomComponent(type, props);
        !(isCustomComponentTag || type === type.toLowerCase()) ? warning$1(false, "<%s /> is using incorrect casing. Use PascalCase for React components, or lowercase for HTML elements.", type) : void 0;
      }
      if (type === "script") {
        var div = ownerDocument.createElement("div");
        div.innerHTML = "<script><\/script>";
        var firstChild = div.firstChild;
        domElement = div.removeChild(firstChild);
      } else if (typeof props.is === "string") {
        domElement = ownerDocument.createElement(type, { is: props.is });
      } else {
        domElement = ownerDocument.createElement(type);
        if (type === "select" && props.multiple) {
          var node = domElement;
          node.multiple = true;
        }
      }
    } else {
      domElement = ownerDocument.createElementNS(namespaceURI, type);
    }
    {
      if (namespaceURI === HTML_NAMESPACE) {
        if (!isCustomComponentTag && Object.prototype.toString.call(domElement) === "[object HTMLUnknownElement]" && !Object.prototype.hasOwnProperty.call(warnedUnknownTags, type)) {
          warnedUnknownTags[type] = true;
          warning$1(false, "The tag <%s> is unrecognized in this browser. If you meant to render a React component, start its name with an uppercase letter.", type);
        }
      }
    }
    return domElement;
  }
  function createTextNode(text, rootContainerElement) {
    return getOwnerDocumentFromRootContainer(rootContainerElement).createTextNode(text);
  }
  function setInitialProperties(domElement, tag, rawProps, rootContainerElement) {
    var isCustomComponentTag = isCustomComponent(tag, rawProps);
    {
      validatePropertiesInDevelopment(tag, rawProps);
      if (isCustomComponentTag && !didWarnShadyDOM && domElement.shadyRoot) {
        warning$1(false, "%s is using shady DOM. Using shady DOM with React can cause things to break subtly.", getCurrentFiberOwnerNameInDevOrNull() || "A component");
        didWarnShadyDOM = true;
      }
    }
    var props = void 0;
    switch (tag) {
      case "iframe":
      case "object":
        trapBubbledEvent(TOP_LOAD, domElement);
        props = rawProps;
        break;
      case "video":
      case "audio":
        for (var i = 0; i < mediaEventTypes.length; i++) {
          trapBubbledEvent(mediaEventTypes[i], domElement);
        }
        props = rawProps;
        break;
      case "source":
        trapBubbledEvent(TOP_ERROR, domElement);
        props = rawProps;
        break;
      case "img":
      case "image":
      case "link":
        trapBubbledEvent(TOP_ERROR, domElement);
        trapBubbledEvent(TOP_LOAD, domElement);
        props = rawProps;
        break;
      case "form":
        trapBubbledEvent(TOP_RESET, domElement);
        trapBubbledEvent(TOP_SUBMIT, domElement);
        props = rawProps;
        break;
      case "details":
        trapBubbledEvent(TOP_TOGGLE, domElement);
        props = rawProps;
        break;
      case "input":
        initWrapperState(domElement, rawProps);
        props = getHostProps(domElement, rawProps);
        trapBubbledEvent(TOP_INVALID, domElement);
        ensureListeningTo(rootContainerElement, "onChange");
        break;
      case "option":
        validateProps(domElement, rawProps);
        props = getHostProps$1(domElement, rawProps);
        break;
      case "select":
        initWrapperState$1(domElement, rawProps);
        props = getHostProps$2(domElement, rawProps);
        trapBubbledEvent(TOP_INVALID, domElement);
        ensureListeningTo(rootContainerElement, "onChange");
        break;
      case "textarea":
        initWrapperState$2(domElement, rawProps);
        props = getHostProps$3(domElement, rawProps);
        trapBubbledEvent(TOP_INVALID, domElement);
        ensureListeningTo(rootContainerElement, "onChange");
        break;
      default:
        props = rawProps;
    }
    assertValidProps(tag, props);
    setInitialDOMProperties(tag, domElement, rootContainerElement, props, isCustomComponentTag);
    switch (tag) {
      case "input":
        track(domElement);
        postMountWrapper(domElement, rawProps, false);
        break;
      case "textarea":
        track(domElement);
        postMountWrapper$3(domElement, rawProps);
        break;
      case "option":
        postMountWrapper$1(domElement, rawProps);
        break;
      case "select":
        postMountWrapper$2(domElement, rawProps);
        break;
      default:
        if (typeof props.onClick === "function") {
          trapClickOnNonInteractiveElement(domElement);
        }
        break;
    }
  }
  function diffProperties(domElement, tag, lastRawProps, nextRawProps, rootContainerElement) {
    {
      validatePropertiesInDevelopment(tag, nextRawProps);
    }
    var updatePayload = null;
    var lastProps = void 0;
    var nextProps = void 0;
    switch (tag) {
      case "input":
        lastProps = getHostProps(domElement, lastRawProps);
        nextProps = getHostProps(domElement, nextRawProps);
        updatePayload = [];
        break;
      case "option":
        lastProps = getHostProps$1(domElement, lastRawProps);
        nextProps = getHostProps$1(domElement, nextRawProps);
        updatePayload = [];
        break;
      case "select":
        lastProps = getHostProps$2(domElement, lastRawProps);
        nextProps = getHostProps$2(domElement, nextRawProps);
        updatePayload = [];
        break;
      case "textarea":
        lastProps = getHostProps$3(domElement, lastRawProps);
        nextProps = getHostProps$3(domElement, nextRawProps);
        updatePayload = [];
        break;
      default:
        lastProps = lastRawProps;
        nextProps = nextRawProps;
        if (typeof lastProps.onClick !== "function" && typeof nextProps.onClick === "function") {
          trapClickOnNonInteractiveElement(domElement);
        }
        break;
    }
    assertValidProps(tag, nextProps);
    var propKey = void 0;
    var styleName = void 0;
    var styleUpdates = null;
    for (propKey in lastProps) {
      if (nextProps.hasOwnProperty(propKey) || !lastProps.hasOwnProperty(propKey) || lastProps[propKey] == null) {
        continue;
      }
      if (propKey === STYLE$1) {
        var lastStyle = lastProps[propKey];
        for (styleName in lastStyle) {
          if (lastStyle.hasOwnProperty(styleName)) {
            if (!styleUpdates) {
              styleUpdates = {};
            }
            styleUpdates[styleName] = "";
          }
        }
      } else if (propKey === DANGEROUSLY_SET_INNER_HTML || propKey === CHILDREN) {
      } else if (propKey === SUPPRESS_CONTENT_EDITABLE_WARNING || propKey === SUPPRESS_HYDRATION_WARNING$1) {
      } else if (propKey === AUTOFOCUS) {
      } else if (registrationNameModules.hasOwnProperty(propKey)) {
        if (!updatePayload) {
          updatePayload = [];
        }
      } else {
        (updatePayload = updatePayload || []).push(propKey, null);
      }
    }
    for (propKey in nextProps) {
      var nextProp = nextProps[propKey];
      var lastProp = lastProps != null ? lastProps[propKey] : void 0;
      if (!nextProps.hasOwnProperty(propKey) || nextProp === lastProp || nextProp == null && lastProp == null) {
        continue;
      }
      if (propKey === STYLE$1) {
        {
          if (nextProp) {
            Object.freeze(nextProp);
          }
        }
        if (lastProp) {
          for (styleName in lastProp) {
            if (lastProp.hasOwnProperty(styleName) && (!nextProp || !nextProp.hasOwnProperty(styleName))) {
              if (!styleUpdates) {
                styleUpdates = {};
              }
              styleUpdates[styleName] = "";
            }
          }
          for (styleName in nextProp) {
            if (nextProp.hasOwnProperty(styleName) && lastProp[styleName] !== nextProp[styleName]) {
              if (!styleUpdates) {
                styleUpdates = {};
              }
              styleUpdates[styleName] = nextProp[styleName];
            }
          }
        } else {
          if (!styleUpdates) {
            if (!updatePayload) {
              updatePayload = [];
            }
            updatePayload.push(propKey, styleUpdates);
          }
          styleUpdates = nextProp;
        }
      } else if (propKey === DANGEROUSLY_SET_INNER_HTML) {
        var nextHtml = nextProp ? nextProp[HTML] : void 0;
        var lastHtml = lastProp ? lastProp[HTML] : void 0;
        if (nextHtml != null) {
          if (lastHtml !== nextHtml) {
            (updatePayload = updatePayload || []).push(propKey, "" + nextHtml);
          }
        } else {
        }
      } else if (propKey === CHILDREN) {
        if (lastProp !== nextProp && (typeof nextProp === "string" || typeof nextProp === "number")) {
          (updatePayload = updatePayload || []).push(propKey, "" + nextProp);
        }
      } else if (propKey === SUPPRESS_CONTENT_EDITABLE_WARNING || propKey === SUPPRESS_HYDRATION_WARNING$1) {
      } else if (registrationNameModules.hasOwnProperty(propKey)) {
        if (nextProp != null) {
          if (typeof nextProp !== "function") {
            warnForInvalidEventListener(propKey, nextProp);
          }
          ensureListeningTo(rootContainerElement, propKey);
        }
        if (!updatePayload && lastProp !== nextProp) {
          updatePayload = [];
        }
      } else {
        (updatePayload = updatePayload || []).push(propKey, nextProp);
      }
    }
    if (styleUpdates) {
      (updatePayload = updatePayload || []).push(STYLE$1, styleUpdates);
    }
    return updatePayload;
  }
  function updateProperties(domElement, updatePayload, tag, lastRawProps, nextRawProps) {
    if (tag === "input" && nextRawProps.type === "radio" && nextRawProps.name != null) {
      updateChecked(domElement, nextRawProps);
    }
    var wasCustomComponentTag = isCustomComponent(tag, lastRawProps);
    var isCustomComponentTag = isCustomComponent(tag, nextRawProps);
    updateDOMProperties(domElement, updatePayload, wasCustomComponentTag, isCustomComponentTag);
    switch (tag) {
      case "input":
        updateWrapper(domElement, nextRawProps);
        break;
      case "textarea":
        updateWrapper$1(domElement, nextRawProps);
        break;
      case "select":
        postUpdateWrapper(domElement, nextRawProps);
        break;
    }
  }
  function getPossibleStandardName(propName) {
    {
      var lowerCasedName = propName.toLowerCase();
      if (!possibleStandardNames.hasOwnProperty(lowerCasedName)) {
        return null;
      }
      return possibleStandardNames[lowerCasedName] || null;
    }
    return null;
  }
  function diffHydratedProperties(domElement, tag, rawProps, parentNamespace, rootContainerElement) {
    var isCustomComponentTag = void 0;
    var extraAttributeNames = void 0;
    {
      suppressHydrationWarning = rawProps[SUPPRESS_HYDRATION_WARNING$1] === true;
      isCustomComponentTag = isCustomComponent(tag, rawProps);
      validatePropertiesInDevelopment(tag, rawProps);
      if (isCustomComponentTag && !didWarnShadyDOM && domElement.shadyRoot) {
        warning$1(false, "%s is using shady DOM. Using shady DOM with React can cause things to break subtly.", getCurrentFiberOwnerNameInDevOrNull() || "A component");
        didWarnShadyDOM = true;
      }
    }
    switch (tag) {
      case "iframe":
      case "object":
        trapBubbledEvent(TOP_LOAD, domElement);
        break;
      case "video":
      case "audio":
        for (var i = 0; i < mediaEventTypes.length; i++) {
          trapBubbledEvent(mediaEventTypes[i], domElement);
        }
        break;
      case "source":
        trapBubbledEvent(TOP_ERROR, domElement);
        break;
      case "img":
      case "image":
      case "link":
        trapBubbledEvent(TOP_ERROR, domElement);
        trapBubbledEvent(TOP_LOAD, domElement);
        break;
      case "form":
        trapBubbledEvent(TOP_RESET, domElement);
        trapBubbledEvent(TOP_SUBMIT, domElement);
        break;
      case "details":
        trapBubbledEvent(TOP_TOGGLE, domElement);
        break;
      case "input":
        initWrapperState(domElement, rawProps);
        trapBubbledEvent(TOP_INVALID, domElement);
        ensureListeningTo(rootContainerElement, "onChange");
        break;
      case "option":
        validateProps(domElement, rawProps);
        break;
      case "select":
        initWrapperState$1(domElement, rawProps);
        trapBubbledEvent(TOP_INVALID, domElement);
        ensureListeningTo(rootContainerElement, "onChange");
        break;
      case "textarea":
        initWrapperState$2(domElement, rawProps);
        trapBubbledEvent(TOP_INVALID, domElement);
        ensureListeningTo(rootContainerElement, "onChange");
        break;
    }
    assertValidProps(tag, rawProps);
    {
      extraAttributeNames = /* @__PURE__ */ new Set();
      var attributes = domElement.attributes;
      for (var _i = 0; _i < attributes.length; _i++) {
        var name = attributes[_i].name.toLowerCase();
        switch (name) {
          // Built-in SSR attribute is whitelisted
          case "data-reactroot":
            break;
          // Controlled attributes are not validated
          // TODO: Only ignore them on controlled tags.
          case "value":
            break;
          case "checked":
            break;
          case "selected":
            break;
          default:
            extraAttributeNames.add(attributes[_i].name);
        }
      }
    }
    var updatePayload = null;
    for (var propKey in rawProps) {
      if (!rawProps.hasOwnProperty(propKey)) {
        continue;
      }
      var nextProp = rawProps[propKey];
      if (propKey === CHILDREN) {
        if (typeof nextProp === "string") {
          if (domElement.textContent !== nextProp) {
            if (!suppressHydrationWarning) {
              warnForTextDifference(domElement.textContent, nextProp);
            }
            updatePayload = [CHILDREN, nextProp];
          }
        } else if (typeof nextProp === "number") {
          if (domElement.textContent !== "" + nextProp) {
            if (!suppressHydrationWarning) {
              warnForTextDifference(domElement.textContent, nextProp);
            }
            updatePayload = [CHILDREN, "" + nextProp];
          }
        }
      } else if (registrationNameModules.hasOwnProperty(propKey)) {
        if (nextProp != null) {
          if (typeof nextProp !== "function") {
            warnForInvalidEventListener(propKey, nextProp);
          }
          ensureListeningTo(rootContainerElement, propKey);
        }
      } else if (
        // Convince Flow we've calculated it (it's DEV-only in this method.)
        typeof isCustomComponentTag === "boolean"
      ) {
        var serverValue = void 0;
        var propertyInfo = getPropertyInfo(propKey);
        if (suppressHydrationWarning) {
        } else if (propKey === SUPPRESS_CONTENT_EDITABLE_WARNING || propKey === SUPPRESS_HYDRATION_WARNING$1 || // Controlled attributes are not validated
        // TODO: Only ignore them on controlled tags.
        propKey === "value" || propKey === "checked" || propKey === "selected") {
        } else if (propKey === DANGEROUSLY_SET_INNER_HTML) {
          var serverHTML = domElement.innerHTML;
          var nextHtml = nextProp ? nextProp[HTML] : void 0;
          var expectedHTML = normalizeHTML(domElement, nextHtml != null ? nextHtml : "");
          if (expectedHTML !== serverHTML) {
            warnForPropDifference(propKey, serverHTML, expectedHTML);
          }
        } else if (propKey === STYLE$1) {
          extraAttributeNames.delete(propKey);
          if (canDiffStyleForHydrationWarning) {
            var expectedStyle = createDangerousStringForStyles(nextProp);
            serverValue = domElement.getAttribute("style");
            if (expectedStyle !== serverValue) {
              warnForPropDifference(propKey, serverValue, expectedStyle);
            }
          }
        } else if (isCustomComponentTag) {
          extraAttributeNames.delete(propKey.toLowerCase());
          serverValue = getValueForAttribute(domElement, propKey, nextProp);
          if (nextProp !== serverValue) {
            warnForPropDifference(propKey, serverValue, nextProp);
          }
        } else if (!shouldIgnoreAttribute(propKey, propertyInfo, isCustomComponentTag) && !shouldRemoveAttribute(propKey, nextProp, propertyInfo, isCustomComponentTag)) {
          var isMismatchDueToBadCasing = false;
          if (propertyInfo !== null) {
            extraAttributeNames.delete(propertyInfo.attributeName);
            serverValue = getValueForProperty(domElement, propKey, nextProp, propertyInfo);
          } else {
            var ownNamespace = parentNamespace;
            if (ownNamespace === HTML_NAMESPACE) {
              ownNamespace = getIntrinsicNamespace(tag);
            }
            if (ownNamespace === HTML_NAMESPACE) {
              extraAttributeNames.delete(propKey.toLowerCase());
            } else {
              var standardName = getPossibleStandardName(propKey);
              if (standardName !== null && standardName !== propKey) {
                isMismatchDueToBadCasing = true;
                extraAttributeNames.delete(standardName);
              }
              extraAttributeNames.delete(propKey);
            }
            serverValue = getValueForAttribute(domElement, propKey, nextProp);
          }
          if (nextProp !== serverValue && !isMismatchDueToBadCasing) {
            warnForPropDifference(propKey, serverValue, nextProp);
          }
        }
      }
    }
    {
      if (extraAttributeNames.size > 0 && !suppressHydrationWarning) {
        warnForExtraAttributes(extraAttributeNames);
      }
    }
    switch (tag) {
      case "input":
        track(domElement);
        postMountWrapper(domElement, rawProps, true);
        break;
      case "textarea":
        track(domElement);
        postMountWrapper$3(domElement, rawProps);
        break;
      case "select":
      case "option":
        break;
      default:
        if (typeof rawProps.onClick === "function") {
          trapClickOnNonInteractiveElement(domElement);
        }
        break;
    }
    return updatePayload;
  }
  function diffHydratedText(textNode, text) {
    var isDifferent = textNode.nodeValue !== text;
    return isDifferent;
  }
  function warnForUnmatchedText(textNode, text) {
    {
      warnForTextDifference(textNode.nodeValue, text);
    }
  }
  function warnForDeletedHydratableElement(parentNode, child) {
    {
      if (didWarnInvalidHydration) {
        return;
      }
      didWarnInvalidHydration = true;
      warningWithoutStack$1(false, "Did not expect server HTML to contain a <%s> in <%s>.", child.nodeName.toLowerCase(), parentNode.nodeName.toLowerCase());
    }
  }
  function warnForDeletedHydratableText(parentNode, child) {
    {
      if (didWarnInvalidHydration) {
        return;
      }
      didWarnInvalidHydration = true;
      warningWithoutStack$1(false, 'Did not expect server HTML to contain the text node "%s" in <%s>.', child.nodeValue, parentNode.nodeName.toLowerCase());
    }
  }
  function warnForInsertedHydratedElement(parentNode, tag, props) {
    {
      if (didWarnInvalidHydration) {
        return;
      }
      didWarnInvalidHydration = true;
      warningWithoutStack$1(false, "Expected server HTML to contain a matching <%s> in <%s>.", tag, parentNode.nodeName.toLowerCase());
    }
  }
  function warnForInsertedHydratedText(parentNode, text) {
    {
      if (text === "") {
        return;
      }
      if (didWarnInvalidHydration) {
        return;
      }
      didWarnInvalidHydration = true;
      warningWithoutStack$1(false, 'Expected server HTML to contain a matching text node for "%s" in <%s>.', text, parentNode.nodeName.toLowerCase());
    }
  }
  function restoreControlledState$1(domElement, tag, props) {
    switch (tag) {
      case "input":
        restoreControlledState(domElement, props);
        return;
      case "textarea":
        restoreControlledState$3(domElement, props);
        return;
      case "select":
        restoreControlledState$2(domElement, props);
        return;
    }
  }
  var validateDOMNesting = function() {
  };
  var updatedAncestorInfo = function() {
  };
  {
    var specialTags = ["address", "applet", "area", "article", "aside", "base", "basefont", "bgsound", "blockquote", "body", "br", "button", "caption", "center", "col", "colgroup", "dd", "details", "dir", "div", "dl", "dt", "embed", "fieldset", "figcaption", "figure", "footer", "form", "frame", "frameset", "h1", "h2", "h3", "h4", "h5", "h6", "head", "header", "hgroup", "hr", "html", "iframe", "img", "input", "isindex", "li", "link", "listing", "main", "marquee", "menu", "menuitem", "meta", "nav", "noembed", "noframes", "noscript", "object", "ol", "p", "param", "plaintext", "pre", "script", "section", "select", "source", "style", "summary", "table", "tbody", "td", "template", "textarea", "tfoot", "th", "thead", "title", "tr", "track", "ul", "wbr", "xmp"];
    var inScopeTags = [
      "applet",
      "caption",
      "html",
      "table",
      "td",
      "th",
      "marquee",
      "object",
      "template",
      // https://html.spec.whatwg.org/multipage/syntax.html#html-integration-point
      // TODO: Distinguish by namespace here -- for <title>, including it here
      // errs on the side of fewer warnings
      "foreignObject",
      "desc",
      "title"
    ];
    var buttonScopeTags = inScopeTags.concat(["button"]);
    var impliedEndTags = ["dd", "dt", "li", "option", "optgroup", "p", "rp", "rt"];
    var emptyAncestorInfo = {
      current: null,
      formTag: null,
      aTagInScope: null,
      buttonTagInScope: null,
      nobrTagInScope: null,
      pTagInButtonScope: null,
      listItemTagAutoclosing: null,
      dlItemTagAutoclosing: null
    };
    updatedAncestorInfo = function(oldInfo, tag) {
      var ancestorInfo = _assign({}, oldInfo || emptyAncestorInfo);
      var info = { tag };
      if (inScopeTags.indexOf(tag) !== -1) {
        ancestorInfo.aTagInScope = null;
        ancestorInfo.buttonTagInScope = null;
        ancestorInfo.nobrTagInScope = null;
      }
      if (buttonScopeTags.indexOf(tag) !== -1) {
        ancestorInfo.pTagInButtonScope = null;
      }
      if (specialTags.indexOf(tag) !== -1 && tag !== "address" && tag !== "div" && tag !== "p") {
        ancestorInfo.listItemTagAutoclosing = null;
        ancestorInfo.dlItemTagAutoclosing = null;
      }
      ancestorInfo.current = info;
      if (tag === "form") {
        ancestorInfo.formTag = info;
      }
      if (tag === "a") {
        ancestorInfo.aTagInScope = info;
      }
      if (tag === "button") {
        ancestorInfo.buttonTagInScope = info;
      }
      if (tag === "nobr") {
        ancestorInfo.nobrTagInScope = info;
      }
      if (tag === "p") {
        ancestorInfo.pTagInButtonScope = info;
      }
      if (tag === "li") {
        ancestorInfo.listItemTagAutoclosing = info;
      }
      if (tag === "dd" || tag === "dt") {
        ancestorInfo.dlItemTagAutoclosing = info;
      }
      return ancestorInfo;
    };
    var isTagValidWithParent = function(tag, parentTag) {
      switch (parentTag) {
        // https://html.spec.whatwg.org/multipage/syntax.html#parsing-main-inselect
        case "select":
          return tag === "option" || tag === "optgroup" || tag === "#text";
        case "optgroup":
          return tag === "option" || tag === "#text";
        // Strictly speaking, seeing an <option> doesn't mean we're in a <select>
        // but
        case "option":
          return tag === "#text";
        // https://html.spec.whatwg.org/multipage/syntax.html#parsing-main-intd
        // https://html.spec.whatwg.org/multipage/syntax.html#parsing-main-incaption
        // No special behavior since these rules fall back to "in body" mode for
        // all except special table nodes which cause bad parsing behavior anyway.
        // https://html.spec.whatwg.org/multipage/syntax.html#parsing-main-intr
        case "tr":
          return tag === "th" || tag === "td" || tag === "style" || tag === "script" || tag === "template";
        // https://html.spec.whatwg.org/multipage/syntax.html#parsing-main-intbody
        case "tbody":
        case "thead":
        case "tfoot":
          return tag === "tr" || tag === "style" || tag === "script" || tag === "template";
        // https://html.spec.whatwg.org/multipage/syntax.html#parsing-main-incolgroup
        case "colgroup":
          return tag === "col" || tag === "template";
        // https://html.spec.whatwg.org/multipage/syntax.html#parsing-main-intable
        case "table":
          return tag === "caption" || tag === "colgroup" || tag === "tbody" || tag === "tfoot" || tag === "thead" || tag === "style" || tag === "script" || tag === "template";
        // https://html.spec.whatwg.org/multipage/syntax.html#parsing-main-inhead
        case "head":
          return tag === "base" || tag === "basefont" || tag === "bgsound" || tag === "link" || tag === "meta" || tag === "title" || tag === "noscript" || tag === "noframes" || tag === "style" || tag === "script" || tag === "template";
        // https://html.spec.whatwg.org/multipage/semantics.html#the-html-element
        case "html":
          return tag === "head" || tag === "body";
        case "#document":
          return tag === "html";
      }
      switch (tag) {
        case "h1":
        case "h2":
        case "h3":
        case "h4":
        case "h5":
        case "h6":
          return parentTag !== "h1" && parentTag !== "h2" && parentTag !== "h3" && parentTag !== "h4" && parentTag !== "h5" && parentTag !== "h6";
        case "rp":
        case "rt":
          return impliedEndTags.indexOf(parentTag) === -1;
        case "body":
        case "caption":
        case "col":
        case "colgroup":
        case "frame":
        case "head":
        case "html":
        case "tbody":
        case "td":
        case "tfoot":
        case "th":
        case "thead":
        case "tr":
          return parentTag == null;
      }
      return true;
    };
    var findInvalidAncestorForTag = function(tag, ancestorInfo) {
      switch (tag) {
        case "address":
        case "article":
        case "aside":
        case "blockquote":
        case "center":
        case "details":
        case "dialog":
        case "dir":
        case "div":
        case "dl":
        case "fieldset":
        case "figcaption":
        case "figure":
        case "footer":
        case "header":
        case "hgroup":
        case "main":
        case "menu":
        case "nav":
        case "ol":
        case "p":
        case "section":
        case "summary":
        case "ul":
        case "pre":
        case "listing":
        case "table":
        case "hr":
        case "xmp":
        case "h1":
        case "h2":
        case "h3":
        case "h4":
        case "h5":
        case "h6":
          return ancestorInfo.pTagInButtonScope;
        case "form":
          return ancestorInfo.formTag || ancestorInfo.pTagInButtonScope;
        case "li":
          return ancestorInfo.listItemTagAutoclosing;
        case "dd":
        case "dt":
          return ancestorInfo.dlItemTagAutoclosing;
        case "button":
          return ancestorInfo.buttonTagInScope;
        case "a":
          return ancestorInfo.aTagInScope;
        case "nobr":
          return ancestorInfo.nobrTagInScope;
      }
      return null;
    };
    var didWarn = {};
    validateDOMNesting = function(childTag, childText, ancestorInfo) {
      ancestorInfo = ancestorInfo || emptyAncestorInfo;
      var parentInfo = ancestorInfo.current;
      var parentTag = parentInfo && parentInfo.tag;
      if (childText != null) {
        !(childTag == null) ? warningWithoutStack$1(false, "validateDOMNesting: when childText is passed, childTag should be null") : void 0;
        childTag = "#text";
      }
      var invalidParent = isTagValidWithParent(childTag, parentTag) ? null : parentInfo;
      var invalidAncestor = invalidParent ? null : findInvalidAncestorForTag(childTag, ancestorInfo);
      var invalidParentOrAncestor = invalidParent || invalidAncestor;
      if (!invalidParentOrAncestor) {
        return;
      }
      var ancestorTag = invalidParentOrAncestor.tag;
      var addendum = getCurrentFiberStackInDev();
      var warnKey = !!invalidParent + "|" + childTag + "|" + ancestorTag + "|" + addendum;
      if (didWarn[warnKey]) {
        return;
      }
      didWarn[warnKey] = true;
      var tagDisplayName = childTag;
      var whitespaceInfo = "";
      if (childTag === "#text") {
        if (/\S/.test(childText)) {
          tagDisplayName = "Text nodes";
        } else {
          tagDisplayName = "Whitespace text nodes";
          whitespaceInfo = " Make sure you don't have any extra whitespace between tags on each line of your source code.";
        }
      } else {
        tagDisplayName = "<" + childTag + ">";
      }
      if (invalidParent) {
        var info = "";
        if (ancestorTag === "table" && childTag === "tr") {
          info += " Add a <tbody> to your code to match the DOM tree generated by the browser.";
        }
        warningWithoutStack$1(false, "validateDOMNesting(...): %s cannot appear as a child of <%s>.%s%s%s", tagDisplayName, ancestorTag, whitespaceInfo, info, addendum);
      } else {
        warningWithoutStack$1(false, "validateDOMNesting(...): %s cannot appear as a descendant of <%s>.%s", tagDisplayName, ancestorTag, addendum);
      }
    };
  }
  var ReactInternals$1 = React2.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED;
  var _ReactInternals$Sched = ReactInternals$1.Scheduler;
  var unstable_cancelCallback = _ReactInternals$Sched.unstable_cancelCallback;
  var unstable_now = _ReactInternals$Sched.unstable_now;
  var unstable_scheduleCallback = _ReactInternals$Sched.unstable_scheduleCallback;
  var unstable_shouldYield = _ReactInternals$Sched.unstable_shouldYield;
  function shim() {
    invariant(false, "The current renderer does not support persistence. This error is likely caused by a bug in React. Please file an issue.");
  }
  var supportsPersistence = false;
  var cloneInstance = shim;
  var createContainerChildSet = shim;
  var appendChildToContainerChildSet = shim;
  var finalizeContainerChildren = shim;
  var replaceContainerChildren = shim;
  var cloneHiddenInstance = shim;
  var cloneUnhiddenInstance = shim;
  var createHiddenTextInstance = shim;
  var SUPPRESS_HYDRATION_WARNING = void 0;
  {
    SUPPRESS_HYDRATION_WARNING = "suppressHydrationWarning";
  }
  var STYLE = "style";
  var eventsEnabled = null;
  var selectionInformation = null;
  function shouldAutoFocusHostComponent(type, props) {
    switch (type) {
      case "button":
      case "input":
      case "select":
      case "textarea":
        return !!props.autoFocus;
    }
    return false;
  }
  function getRootHostContext(rootContainerInstance) {
    var type = void 0;
    var namespace = void 0;
    var nodeType = rootContainerInstance.nodeType;
    switch (nodeType) {
      case DOCUMENT_NODE:
      case DOCUMENT_FRAGMENT_NODE: {
        type = nodeType === DOCUMENT_NODE ? "#document" : "#fragment";
        var root2 = rootContainerInstance.documentElement;
        namespace = root2 ? root2.namespaceURI : getChildNamespace(null, "");
        break;
      }
      default: {
        var container = nodeType === COMMENT_NODE ? rootContainerInstance.parentNode : rootContainerInstance;
        var ownNamespace = container.namespaceURI || null;
        type = container.tagName;
        namespace = getChildNamespace(ownNamespace, type);
        break;
      }
    }
    {
      var validatedTag = type.toLowerCase();
      var _ancestorInfo = updatedAncestorInfo(null, validatedTag);
      return { namespace, ancestorInfo: _ancestorInfo };
    }
    return namespace;
  }
  function getChildHostContext(parentHostContext, type, rootContainerInstance) {
    {
      var parentHostContextDev = parentHostContext;
      var _namespace = getChildNamespace(parentHostContextDev.namespace, type);
      var _ancestorInfo2 = updatedAncestorInfo(parentHostContextDev.ancestorInfo, type);
      return { namespace: _namespace, ancestorInfo: _ancestorInfo2 };
    }
    var parentNamespace = parentHostContext;
    return getChildNamespace(parentNamespace, type);
  }
  function getPublicInstance(instance) {
    return instance;
  }
  function prepareForCommit(containerInfo) {
    eventsEnabled = isEnabled();
    selectionInformation = getSelectionInformation();
    setEnabled(false);
  }
  function resetAfterCommit(containerInfo) {
    restoreSelection(selectionInformation);
    selectionInformation = null;
    setEnabled(eventsEnabled);
    eventsEnabled = null;
  }
  function createInstance(type, props, rootContainerInstance, hostContext, internalInstanceHandle) {
    var parentNamespace = void 0;
    {
      var hostContextDev = hostContext;
      validateDOMNesting(type, null, hostContextDev.ancestorInfo);
      if (typeof props.children === "string" || typeof props.children === "number") {
        var string = "" + props.children;
        var ownAncestorInfo = updatedAncestorInfo(hostContextDev.ancestorInfo, type);
        validateDOMNesting(null, string, ownAncestorInfo);
      }
      parentNamespace = hostContextDev.namespace;
    }
    var domElement = createElement(type, props, rootContainerInstance, parentNamespace);
    precacheFiberNode(internalInstanceHandle, domElement);
    updateFiberProps(domElement, props);
    return domElement;
  }
  function appendInitialChild(parentInstance, child) {
    parentInstance.appendChild(child);
  }
  function finalizeInitialChildren(domElement, type, props, rootContainerInstance, hostContext) {
    setInitialProperties(domElement, type, props, rootContainerInstance);
    return shouldAutoFocusHostComponent(type, props);
  }
  function prepareUpdate(domElement, type, oldProps, newProps, rootContainerInstance, hostContext) {
    {
      var hostContextDev = hostContext;
      if (typeof newProps.children !== typeof oldProps.children && (typeof newProps.children === "string" || typeof newProps.children === "number")) {
        var string = "" + newProps.children;
        var ownAncestorInfo = updatedAncestorInfo(hostContextDev.ancestorInfo, type);
        validateDOMNesting(null, string, ownAncestorInfo);
      }
    }
    return diffProperties(domElement, type, oldProps, newProps, rootContainerInstance);
  }
  function shouldSetTextContent(type, props) {
    return type === "textarea" || type === "option" || type === "noscript" || typeof props.children === "string" || typeof props.children === "number" || typeof props.dangerouslySetInnerHTML === "object" && props.dangerouslySetInnerHTML !== null && props.dangerouslySetInnerHTML.__html != null;
  }
  function shouldDeprioritizeSubtree(type, props) {
    return !!props.hidden;
  }
  function createTextInstance(text, rootContainerInstance, hostContext, internalInstanceHandle) {
    {
      var hostContextDev = hostContext;
      validateDOMNesting(null, text, hostContextDev.ancestorInfo);
    }
    var textNode = createTextNode(text, rootContainerInstance);
    precacheFiberNode(internalInstanceHandle, textNode);
    return textNode;
  }
  var isPrimaryRenderer = true;
  var scheduleTimeout = typeof setTimeout === "function" ? setTimeout : void 0;
  var cancelTimeout = typeof clearTimeout === "function" ? clearTimeout : void 0;
  var noTimeout = -1;
  var supportsMutation = true;
  function commitMount(domElement, type, newProps, internalInstanceHandle) {
    if (shouldAutoFocusHostComponent(type, newProps)) {
      domElement.focus();
    }
  }
  function commitUpdate(domElement, updatePayload, type, oldProps, newProps, internalInstanceHandle) {
    updateFiberProps(domElement, newProps);
    updateProperties(domElement, updatePayload, type, oldProps, newProps);
  }
  function resetTextContent(domElement) {
    setTextContent(domElement, "");
  }
  function commitTextUpdate(textInstance, oldText, newText) {
    textInstance.nodeValue = newText;
  }
  function appendChild(parentInstance, child) {
    parentInstance.appendChild(child);
  }
  function appendChildToContainer(container, child) {
    var parentNode = void 0;
    if (container.nodeType === COMMENT_NODE) {
      parentNode = container.parentNode;
      parentNode.insertBefore(child, container);
    } else {
      parentNode = container;
      parentNode.appendChild(child);
    }
    var reactRootContainer = container._reactRootContainer;
    if ((reactRootContainer === null || reactRootContainer === void 0) && parentNode.onclick === null) {
      trapClickOnNonInteractiveElement(parentNode);
    }
  }
  function insertBefore(parentInstance, child, beforeChild) {
    parentInstance.insertBefore(child, beforeChild);
  }
  function insertInContainerBefore(container, child, beforeChild) {
    if (container.nodeType === COMMENT_NODE) {
      container.parentNode.insertBefore(child, beforeChild);
    } else {
      container.insertBefore(child, beforeChild);
    }
  }
  function removeChild(parentInstance, child) {
    parentInstance.removeChild(child);
  }
  function removeChildFromContainer(container, child) {
    if (container.nodeType === COMMENT_NODE) {
      container.parentNode.removeChild(child);
    } else {
      container.removeChild(child);
    }
  }
  function hideInstance(instance) {
    instance = instance;
    instance.style.display = "none";
  }
  function hideTextInstance(textInstance) {
    textInstance.nodeValue = "";
  }
  function unhideInstance(instance, props) {
    instance = instance;
    var styleProp = props[STYLE];
    var display = styleProp !== void 0 && styleProp !== null && styleProp.hasOwnProperty("display") ? styleProp.display : null;
    instance.style.display = dangerousStyleValue("display", display);
  }
  function unhideTextInstance(textInstance, text) {
    textInstance.nodeValue = text;
  }
  var supportsHydration = true;
  function canHydrateInstance(instance, type, props) {
    if (instance.nodeType !== ELEMENT_NODE || type.toLowerCase() !== instance.nodeName.toLowerCase()) {
      return null;
    }
    return instance;
  }
  function canHydrateTextInstance(instance, text) {
    if (text === "" || instance.nodeType !== TEXT_NODE) {
      return null;
    }
    return instance;
  }
  function getNextHydratableSibling(instance) {
    var node = instance.nextSibling;
    while (node && node.nodeType !== ELEMENT_NODE && node.nodeType !== TEXT_NODE) {
      node = node.nextSibling;
    }
    return node;
  }
  function getFirstHydratableChild(parentInstance) {
    var next = parentInstance.firstChild;
    while (next && next.nodeType !== ELEMENT_NODE && next.nodeType !== TEXT_NODE) {
      next = next.nextSibling;
    }
    return next;
  }
  function hydrateInstance(instance, type, props, rootContainerInstance, hostContext, internalInstanceHandle) {
    precacheFiberNode(internalInstanceHandle, instance);
    updateFiberProps(instance, props);
    var parentNamespace = void 0;
    {
      var hostContextDev = hostContext;
      parentNamespace = hostContextDev.namespace;
    }
    return diffHydratedProperties(instance, type, props, parentNamespace, rootContainerInstance);
  }
  function hydrateTextInstance(textInstance, text, internalInstanceHandle) {
    precacheFiberNode(internalInstanceHandle, textInstance);
    return diffHydratedText(textInstance, text);
  }
  function didNotMatchHydratedContainerTextInstance(parentContainer, textInstance, text) {
    {
      warnForUnmatchedText(textInstance, text);
    }
  }
  function didNotMatchHydratedTextInstance(parentType, parentProps, parentInstance, textInstance, text) {
    if (parentProps[SUPPRESS_HYDRATION_WARNING] !== true) {
      warnForUnmatchedText(textInstance, text);
    }
  }
  function didNotHydrateContainerInstance(parentContainer, instance) {
    {
      if (instance.nodeType === ELEMENT_NODE) {
        warnForDeletedHydratableElement(parentContainer, instance);
      } else {
        warnForDeletedHydratableText(parentContainer, instance);
      }
    }
  }
  function didNotHydrateInstance(parentType, parentProps, parentInstance, instance) {
    if (parentProps[SUPPRESS_HYDRATION_WARNING] !== true) {
      if (instance.nodeType === ELEMENT_NODE) {
        warnForDeletedHydratableElement(parentInstance, instance);
      } else {
        warnForDeletedHydratableText(parentInstance, instance);
      }
    }
  }
  function didNotFindHydratableContainerInstance(parentContainer, type, props) {
    {
      warnForInsertedHydratedElement(parentContainer, type, props);
    }
  }
  function didNotFindHydratableContainerTextInstance(parentContainer, text) {
    {
      warnForInsertedHydratedText(parentContainer, text);
    }
  }
  function didNotFindHydratableInstance(parentType, parentProps, parentInstance, type, props) {
    if (parentProps[SUPPRESS_HYDRATION_WARNING] !== true) {
      warnForInsertedHydratedElement(parentInstance, type, props);
    }
  }
  function didNotFindHydratableTextInstance(parentType, parentProps, parentInstance, text) {
    if (parentProps[SUPPRESS_HYDRATION_WARNING] !== true) {
      warnForInsertedHydratedText(parentInstance, text);
    }
  }
  var reactEmoji = "\u269B";
  var warningEmoji = "\u26D4";
  var supportsUserTiming = typeof performance !== "undefined" && typeof performance.mark === "function" && typeof performance.clearMarks === "function" && typeof performance.measure === "function" && typeof performance.clearMeasures === "function";
  var currentFiber = null;
  var currentPhase = null;
  var currentPhaseFiber = null;
  var isCommitting = false;
  var hasScheduledUpdateInCurrentCommit = false;
  var hasScheduledUpdateInCurrentPhase = false;
  var commitCountInCurrentWorkLoop = 0;
  var effectCountInCurrentCommit = 0;
  var isWaitingForCallback = false;
  var labelsInCurrentCommit = /* @__PURE__ */ new Set();
  var formatMarkName = function(markName) {
    return reactEmoji + " " + markName;
  };
  var formatLabel = function(label, warning2) {
    var prefix = warning2 ? warningEmoji + " " : reactEmoji + " ";
    var suffix = warning2 ? " Warning: " + warning2 : "";
    return "" + prefix + label + suffix;
  };
  var beginMark = function(markName) {
    performance.mark(formatMarkName(markName));
  };
  var clearMark = function(markName) {
    performance.clearMarks(formatMarkName(markName));
  };
  var endMark = function(label, markName, warning2) {
    var formattedMarkName = formatMarkName(markName);
    var formattedLabel = formatLabel(label, warning2);
    try {
      performance.measure(formattedLabel, formattedMarkName);
    } catch (err) {
    }
    performance.clearMarks(formattedMarkName);
    performance.clearMeasures(formattedLabel);
  };
  var getFiberMarkName = function(label, debugID) {
    return label + " (#" + debugID + ")";
  };
  var getFiberLabel = function(componentName, isMounted2, phase2) {
    if (phase2 === null) {
      return componentName + " [" + (isMounted2 ? "update" : "mount") + "]";
    } else {
      return componentName + "." + phase2;
    }
  };
  var beginFiberMark = function(fiber, phase2) {
    var componentName = getComponentName(fiber.type) || "Unknown";
    var debugID = fiber._debugID;
    var isMounted2 = fiber.alternate !== null;
    var label = getFiberLabel(componentName, isMounted2, phase2);
    if (isCommitting && labelsInCurrentCommit.has(label)) {
      return false;
    }
    labelsInCurrentCommit.add(label);
    var markName = getFiberMarkName(label, debugID);
    beginMark(markName);
    return true;
  };
  var clearFiberMark = function(fiber, phase2) {
    var componentName = getComponentName(fiber.type) || "Unknown";
    var debugID = fiber._debugID;
    var isMounted2 = fiber.alternate !== null;
    var label = getFiberLabel(componentName, isMounted2, phase2);
    var markName = getFiberMarkName(label, debugID);
    clearMark(markName);
  };
  var endFiberMark = function(fiber, phase2, warning2) {
    var componentName = getComponentName(fiber.type) || "Unknown";
    var debugID = fiber._debugID;
    var isMounted2 = fiber.alternate !== null;
    var label = getFiberLabel(componentName, isMounted2, phase2);
    var markName = getFiberMarkName(label, debugID);
    endMark(label, markName, warning2);
  };
  var shouldIgnoreFiber = function(fiber) {
    switch (fiber.tag) {
      case HostRoot:
      case HostComponent:
      case HostText:
      case HostPortal:
      case Fragment:
      case ContextProvider:
      case ContextConsumer:
      case Mode:
        return true;
      default:
        return false;
    }
  };
  var clearPendingPhaseMeasurement = function() {
    if (currentPhase !== null && currentPhaseFiber !== null) {
      clearFiberMark(currentPhaseFiber, currentPhase);
    }
    currentPhaseFiber = null;
    currentPhase = null;
    hasScheduledUpdateInCurrentPhase = false;
  };
  var pauseTimers = function() {
    var fiber = currentFiber;
    while (fiber) {
      if (fiber._debugIsCurrentlyTiming) {
        endFiberMark(fiber, null, null);
      }
      fiber = fiber.return;
    }
  };
  var resumeTimersRecursively = function(fiber) {
    if (fiber.return !== null) {
      resumeTimersRecursively(fiber.return);
    }
    if (fiber._debugIsCurrentlyTiming) {
      beginFiberMark(fiber, null);
    }
  };
  var resumeTimers = function() {
    if (currentFiber !== null) {
      resumeTimersRecursively(currentFiber);
    }
  };
  function recordEffect() {
    if (enableUserTimingAPI) {
      effectCountInCurrentCommit++;
    }
  }
  function recordScheduleUpdate() {
    if (enableUserTimingAPI) {
      if (isCommitting) {
        hasScheduledUpdateInCurrentCommit = true;
      }
      if (currentPhase !== null && currentPhase !== "componentWillMount" && currentPhase !== "componentWillReceiveProps") {
        hasScheduledUpdateInCurrentPhase = true;
      }
    }
  }
  function startRequestCallbackTimer() {
    if (enableUserTimingAPI) {
      if (supportsUserTiming && !isWaitingForCallback) {
        isWaitingForCallback = true;
        beginMark("(Waiting for async callback...)");
      }
    }
  }
  function stopRequestCallbackTimer(didExpire, expirationTime) {
    if (enableUserTimingAPI) {
      if (supportsUserTiming) {
        isWaitingForCallback = false;
        var warning2 = didExpire ? "React was blocked by main thread" : null;
        endMark("(Waiting for async callback... will force flush in " + expirationTime + " ms)", "(Waiting for async callback...)", warning2);
      }
    }
  }
  function startWorkTimer(fiber) {
    if (enableUserTimingAPI) {
      if (!supportsUserTiming || shouldIgnoreFiber(fiber)) {
        return;
      }
      currentFiber = fiber;
      if (!beginFiberMark(fiber, null)) {
        return;
      }
      fiber._debugIsCurrentlyTiming = true;
    }
  }
  function cancelWorkTimer(fiber) {
    if (enableUserTimingAPI) {
      if (!supportsUserTiming || shouldIgnoreFiber(fiber)) {
        return;
      }
      fiber._debugIsCurrentlyTiming = false;
      clearFiberMark(fiber, null);
    }
  }
  function stopWorkTimer(fiber) {
    if (enableUserTimingAPI) {
      if (!supportsUserTiming || shouldIgnoreFiber(fiber)) {
        return;
      }
      currentFiber = fiber.return;
      if (!fiber._debugIsCurrentlyTiming) {
        return;
      }
      fiber._debugIsCurrentlyTiming = false;
      endFiberMark(fiber, null, null);
    }
  }
  function stopFailedWorkTimer(fiber) {
    if (enableUserTimingAPI) {
      if (!supportsUserTiming || shouldIgnoreFiber(fiber)) {
        return;
      }
      currentFiber = fiber.return;
      if (!fiber._debugIsCurrentlyTiming) {
        return;
      }
      fiber._debugIsCurrentlyTiming = false;
      var warning2 = fiber.tag === SuspenseComponent ? "Rendering was suspended" : "An error was thrown inside this error boundary";
      endFiberMark(fiber, null, warning2);
    }
  }
  function startPhaseTimer(fiber, phase2) {
    if (enableUserTimingAPI) {
      if (!supportsUserTiming) {
        return;
      }
      clearPendingPhaseMeasurement();
      if (!beginFiberMark(fiber, phase2)) {
        return;
      }
      currentPhaseFiber = fiber;
      currentPhase = phase2;
    }
  }
  function stopPhaseTimer() {
    if (enableUserTimingAPI) {
      if (!supportsUserTiming) {
        return;
      }
      if (currentPhase !== null && currentPhaseFiber !== null) {
        var warning2 = hasScheduledUpdateInCurrentPhase ? "Scheduled a cascading update" : null;
        endFiberMark(currentPhaseFiber, currentPhase, warning2);
      }
      currentPhase = null;
      currentPhaseFiber = null;
    }
  }
  function startWorkLoopTimer(nextUnitOfWork2) {
    if (enableUserTimingAPI) {
      currentFiber = nextUnitOfWork2;
      if (!supportsUserTiming) {
        return;
      }
      commitCountInCurrentWorkLoop = 0;
      beginMark("(React Tree Reconciliation)");
      resumeTimers();
    }
  }
  function stopWorkLoopTimer(interruptedBy2, didCompleteRoot) {
    if (enableUserTimingAPI) {
      if (!supportsUserTiming) {
        return;
      }
      var warning2 = null;
      if (interruptedBy2 !== null) {
        if (interruptedBy2.tag === HostRoot) {
          warning2 = "A top-level update interrupted the previous render";
        } else {
          var componentName = getComponentName(interruptedBy2.type) || "Unknown";
          warning2 = "An update to " + componentName + " interrupted the previous render";
        }
      } else if (commitCountInCurrentWorkLoop > 1) {
        warning2 = "There were cascading updates";
      }
      commitCountInCurrentWorkLoop = 0;
      var label = didCompleteRoot ? "(React Tree Reconciliation: Completed Root)" : "(React Tree Reconciliation: Yielded)";
      pauseTimers();
      endMark(label, "(React Tree Reconciliation)", warning2);
    }
  }
  function startCommitTimer() {
    if (enableUserTimingAPI) {
      if (!supportsUserTiming) {
        return;
      }
      isCommitting = true;
      hasScheduledUpdateInCurrentCommit = false;
      labelsInCurrentCommit.clear();
      beginMark("(Committing Changes)");
    }
  }
  function stopCommitTimer() {
    if (enableUserTimingAPI) {
      if (!supportsUserTiming) {
        return;
      }
      var warning2 = null;
      if (hasScheduledUpdateInCurrentCommit) {
        warning2 = "Lifecycle hook scheduled a cascading update";
      } else if (commitCountInCurrentWorkLoop > 0) {
        warning2 = "Caused by a cascading update in earlier commit";
      }
      hasScheduledUpdateInCurrentCommit = false;
      commitCountInCurrentWorkLoop++;
      isCommitting = false;
      labelsInCurrentCommit.clear();
      endMark("(Committing Changes)", "(Committing Changes)", warning2);
    }
  }
  function startCommitSnapshotEffectsTimer() {
    if (enableUserTimingAPI) {
      if (!supportsUserTiming) {
        return;
      }
      effectCountInCurrentCommit = 0;
      beginMark("(Committing Snapshot Effects)");
    }
  }
  function stopCommitSnapshotEffectsTimer() {
    if (enableUserTimingAPI) {
      if (!supportsUserTiming) {
        return;
      }
      var count = effectCountInCurrentCommit;
      effectCountInCurrentCommit = 0;
      endMark("(Committing Snapshot Effects: " + count + " Total)", "(Committing Snapshot Effects)", null);
    }
  }
  function startCommitHostEffectsTimer() {
    if (enableUserTimingAPI) {
      if (!supportsUserTiming) {
        return;
      }
      effectCountInCurrentCommit = 0;
      beginMark("(Committing Host Effects)");
    }
  }
  function stopCommitHostEffectsTimer() {
    if (enableUserTimingAPI) {
      if (!supportsUserTiming) {
        return;
      }
      var count = effectCountInCurrentCommit;
      effectCountInCurrentCommit = 0;
      endMark("(Committing Host Effects: " + count + " Total)", "(Committing Host Effects)", null);
    }
  }
  function startCommitLifeCyclesTimer() {
    if (enableUserTimingAPI) {
      if (!supportsUserTiming) {
        return;
      }
      effectCountInCurrentCommit = 0;
      beginMark("(Calling Lifecycle Methods)");
    }
  }
  function stopCommitLifeCyclesTimer() {
    if (enableUserTimingAPI) {
      if (!supportsUserTiming) {
        return;
      }
      var count = effectCountInCurrentCommit;
      effectCountInCurrentCommit = 0;
      endMark("(Calling Lifecycle Methods: " + count + " Total)", "(Calling Lifecycle Methods)", null);
    }
  }
  var valueStack = [];
  var fiberStack = void 0;
  {
    fiberStack = [];
  }
  var index = -1;
  function createCursor(defaultValue) {
    return {
      current: defaultValue
    };
  }
  function pop(cursor, fiber) {
    if (index < 0) {
      {
        warningWithoutStack$1(false, "Unexpected pop.");
      }
      return;
    }
    {
      if (fiber !== fiberStack[index]) {
        warningWithoutStack$1(false, "Unexpected Fiber popped.");
      }
    }
    cursor.current = valueStack[index];
    valueStack[index] = null;
    {
      fiberStack[index] = null;
    }
    index--;
  }
  function push(cursor, value, fiber) {
    index++;
    valueStack[index] = cursor.current;
    {
      fiberStack[index] = fiber;
    }
    cursor.current = value;
  }
  function checkThatStackIsEmpty() {
    {
      if (index !== -1) {
        warningWithoutStack$1(false, "Expected an empty stack. Something was not reset properly.");
      }
    }
  }
  function resetStackAfterFatalErrorInDev() {
    {
      index = -1;
      valueStack.length = 0;
      fiberStack.length = 0;
    }
  }
  var warnedAboutMissingGetChildContext = void 0;
  {
    warnedAboutMissingGetChildContext = {};
  }
  var emptyContextObject = {};
  {
    Object.freeze(emptyContextObject);
  }
  var contextStackCursor = createCursor(emptyContextObject);
  var didPerformWorkStackCursor = createCursor(false);
  var previousContext = emptyContextObject;
  function getUnmaskedContext(workInProgress, Component, didPushOwnContextIfProvider) {
    if (didPushOwnContextIfProvider && isContextProvider(Component)) {
      return previousContext;
    }
    return contextStackCursor.current;
  }
  function cacheContext(workInProgress, unmaskedContext, maskedContext) {
    var instance = workInProgress.stateNode;
    instance.__reactInternalMemoizedUnmaskedChildContext = unmaskedContext;
    instance.__reactInternalMemoizedMaskedChildContext = maskedContext;
  }
  function getMaskedContext(workInProgress, unmaskedContext) {
    var type = workInProgress.type;
    var contextTypes = type.contextTypes;
    if (!contextTypes) {
      return emptyContextObject;
    }
    var instance = workInProgress.stateNode;
    if (instance && instance.__reactInternalMemoizedUnmaskedChildContext === unmaskedContext) {
      return instance.__reactInternalMemoizedMaskedChildContext;
    }
    var context = {};
    for (var key in contextTypes) {
      context[key] = unmaskedContext[key];
    }
    {
      var name = getComponentName(type) || "Unknown";
      checkPropTypes_1(contextTypes, context, "context", name, getCurrentFiberStackInDev);
    }
    if (instance) {
      cacheContext(workInProgress, unmaskedContext, context);
    }
    return context;
  }
  function hasContextChanged() {
    return didPerformWorkStackCursor.current;
  }
  function isContextProvider(type) {
    var childContextTypes = type.childContextTypes;
    return childContextTypes !== null && childContextTypes !== void 0;
  }
  function popContext(fiber) {
    pop(didPerformWorkStackCursor, fiber);
    pop(contextStackCursor, fiber);
  }
  function popTopLevelContextObject(fiber) {
    pop(didPerformWorkStackCursor, fiber);
    pop(contextStackCursor, fiber);
  }
  function pushTopLevelContextObject(fiber, context, didChange) {
    !(contextStackCursor.current === emptyContextObject) ? invariant(false, "Unexpected context found on stack. This error is likely caused by a bug in React. Please file an issue.") : void 0;
    push(contextStackCursor, context, fiber);
    push(didPerformWorkStackCursor, didChange, fiber);
  }
  function processChildContext(fiber, type, parentContext) {
    var instance = fiber.stateNode;
    var childContextTypes = type.childContextTypes;
    if (typeof instance.getChildContext !== "function") {
      {
        var componentName = getComponentName(type) || "Unknown";
        if (!warnedAboutMissingGetChildContext[componentName]) {
          warnedAboutMissingGetChildContext[componentName] = true;
          warningWithoutStack$1(false, "%s.childContextTypes is specified but there is no getChildContext() method on the instance. You can either define getChildContext() on %s or remove childContextTypes from it.", componentName, componentName);
        }
      }
      return parentContext;
    }
    var childContext = void 0;
    {
      setCurrentPhase("getChildContext");
    }
    startPhaseTimer(fiber, "getChildContext");
    childContext = instance.getChildContext();
    stopPhaseTimer();
    {
      setCurrentPhase(null);
    }
    for (var contextKey in childContext) {
      !(contextKey in childContextTypes) ? invariant(false, '%s.getChildContext(): key "%s" is not defined in childContextTypes.', getComponentName(type) || "Unknown", contextKey) : void 0;
    }
    {
      var name = getComponentName(type) || "Unknown";
      checkPropTypes_1(
        childContextTypes,
        childContext,
        "child context",
        name,
        // In practice, there is one case in which we won't get a stack. It's when
        // somebody calls unstable_renderSubtreeIntoContainer() and we process
        // context from the parent component instance. The stack will be missing
        // because it's outside of the reconciliation, and so the pointer has not
        // been set. This is rare and doesn't matter. We'll also remove that API.
        getCurrentFiberStackInDev
      );
    }
    return _assign({}, parentContext, childContext);
  }
  function pushContextProvider(workInProgress) {
    var instance = workInProgress.stateNode;
    var memoizedMergedChildContext = instance && instance.__reactInternalMemoizedMergedChildContext || emptyContextObject;
    previousContext = contextStackCursor.current;
    push(contextStackCursor, memoizedMergedChildContext, workInProgress);
    push(didPerformWorkStackCursor, didPerformWorkStackCursor.current, workInProgress);
    return true;
  }
  function invalidateContextProvider(workInProgress, type, didChange) {
    var instance = workInProgress.stateNode;
    !instance ? invariant(false, "Expected to have an instance by this point. This error is likely caused by a bug in React. Please file an issue.") : void 0;
    if (didChange) {
      var mergedContext = processChildContext(workInProgress, type, previousContext);
      instance.__reactInternalMemoizedMergedChildContext = mergedContext;
      pop(didPerformWorkStackCursor, workInProgress);
      pop(contextStackCursor, workInProgress);
      push(contextStackCursor, mergedContext, workInProgress);
      push(didPerformWorkStackCursor, didChange, workInProgress);
    } else {
      pop(didPerformWorkStackCursor, workInProgress);
      push(didPerformWorkStackCursor, didChange, workInProgress);
    }
  }
  function findCurrentUnmaskedContext(fiber) {
    !(isFiberMounted(fiber) && fiber.tag === ClassComponent) ? invariant(false, "Expected subtree parent to be a mounted class component. This error is likely caused by a bug in React. Please file an issue.") : void 0;
    var node = fiber;
    do {
      switch (node.tag) {
        case HostRoot:
          return node.stateNode.context;
        case ClassComponent: {
          var Component = node.type;
          if (isContextProvider(Component)) {
            return node.stateNode.__reactInternalMemoizedMergedChildContext;
          }
          break;
        }
      }
      node = node.return;
    } while (node !== null);
    invariant(false, "Found unexpected detached subtree parent. This error is likely caused by a bug in React. Please file an issue.");
  }
  var onCommitFiberRoot = null;
  var onCommitFiberUnmount = null;
  var hasLoggedError = false;
  function catchErrors(fn) {
    return function(arg) {
      try {
        return fn(arg);
      } catch (err) {
        if (!hasLoggedError) {
          hasLoggedError = true;
          warningWithoutStack$1(false, "React DevTools encountered an error: %s", err);
        }
      }
    };
  }
  var isDevToolsPresent = typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ !== "undefined";
  function injectInternals(internals) {
    if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ === "undefined") {
      return false;
    }
    var hook = __REACT_DEVTOOLS_GLOBAL_HOOK__;
    if (hook.isDisabled) {
      return true;
    }
    if (!hook.supportsFiber) {
      {
        warningWithoutStack$1(false, "The installed version of React DevTools is too old and will not work with the current version of React. Please update React DevTools. https://fb.me/react-devtools");
      }
      return true;
    }
    try {
      var rendererID = hook.inject(internals);
      onCommitFiberRoot = catchErrors(function(root2) {
        return hook.onCommitFiberRoot(rendererID, root2);
      });
      onCommitFiberUnmount = catchErrors(function(fiber) {
        return hook.onCommitFiberUnmount(rendererID, fiber);
      });
    } catch (err) {
      {
        warningWithoutStack$1(false, "React DevTools encountered an error: %s.", err);
      }
    }
    return true;
  }
  function onCommitRoot(root2) {
    if (typeof onCommitFiberRoot === "function") {
      onCommitFiberRoot(root2);
    }
  }
  function onCommitUnmount(fiber) {
    if (typeof onCommitFiberUnmount === "function") {
      onCommitFiberUnmount(fiber);
    }
  }
  var maxSigned31BitInt = 1073741823;
  var NoWork = 0;
  var Never = 1;
  var Sync = maxSigned31BitInt;
  var UNIT_SIZE = 10;
  var MAGIC_NUMBER_OFFSET = maxSigned31BitInt - 1;
  function msToExpirationTime(ms) {
    return MAGIC_NUMBER_OFFSET - (ms / UNIT_SIZE | 0);
  }
  function expirationTimeToMs(expirationTime) {
    return (MAGIC_NUMBER_OFFSET - expirationTime) * UNIT_SIZE;
  }
  function ceiling(num, precision) {
    return ((num / precision | 0) + 1) * precision;
  }
  function computeExpirationBucket(currentTime, expirationInMs, bucketSizeMs) {
    return MAGIC_NUMBER_OFFSET - ceiling(MAGIC_NUMBER_OFFSET - currentTime + expirationInMs / UNIT_SIZE, bucketSizeMs / UNIT_SIZE);
  }
  var LOW_PRIORITY_EXPIRATION = 5e3;
  var LOW_PRIORITY_BATCH_SIZE = 250;
  function computeAsyncExpiration(currentTime) {
    return computeExpirationBucket(currentTime, LOW_PRIORITY_EXPIRATION, LOW_PRIORITY_BATCH_SIZE);
  }
  var HIGH_PRIORITY_EXPIRATION = 500;
  var HIGH_PRIORITY_BATCH_SIZE = 100;
  function computeInteractiveExpiration(currentTime) {
    return computeExpirationBucket(currentTime, HIGH_PRIORITY_EXPIRATION, HIGH_PRIORITY_BATCH_SIZE);
  }
  var NoContext = 0;
  var ConcurrentMode = 1;
  var StrictMode = 2;
  var ProfileMode = 4;
  var hasBadMapPolyfill = void 0;
  {
    hasBadMapPolyfill = false;
    try {
      var nonExtensibleObject = Object.preventExtensions({});
      var testMap = /* @__PURE__ */ new Map([[nonExtensibleObject, null]]);
      var testSet = /* @__PURE__ */ new Set([nonExtensibleObject]);
      testMap.set(0, 0);
      testSet.add(0);
    } catch (e) {
      hasBadMapPolyfill = true;
    }
  }
  var debugCounter = void 0;
  {
    debugCounter = 1;
  }
  function FiberNode(tag, pendingProps, key, mode) {
    this.tag = tag;
    this.key = key;
    this.elementType = null;
    this.type = null;
    this.stateNode = null;
    this.return = null;
    this.child = null;
    this.sibling = null;
    this.index = 0;
    this.ref = null;
    this.pendingProps = pendingProps;
    this.memoizedProps = null;
    this.updateQueue = null;
    this.memoizedState = null;
    this.firstContextDependency = null;
    this.mode = mode;
    this.effectTag = NoEffect;
    this.nextEffect = null;
    this.firstEffect = null;
    this.lastEffect = null;
    this.expirationTime = NoWork;
    this.childExpirationTime = NoWork;
    this.alternate = null;
    if (enableProfilerTimer) {
      this.actualDuration = 0;
      this.actualStartTime = -1;
      this.selfBaseDuration = 0;
      this.treeBaseDuration = 0;
    }
    {
      this._debugID = debugCounter++;
      this._debugSource = null;
      this._debugOwner = null;
      this._debugIsCurrentlyTiming = false;
      if (!hasBadMapPolyfill && typeof Object.preventExtensions === "function") {
        Object.preventExtensions(this);
      }
    }
  }
  var createFiber = function(tag, pendingProps, key, mode) {
    return new FiberNode(tag, pendingProps, key, mode);
  };
  function shouldConstruct(Component) {
    var prototype = Component.prototype;
    return !!(prototype && prototype.isReactComponent);
  }
  function isSimpleFunctionComponent(type) {
    return typeof type === "function" && !shouldConstruct(type) && type.defaultProps === void 0;
  }
  function resolveLazyComponentTag(Component) {
    if (typeof Component === "function") {
      return shouldConstruct(Component) ? ClassComponent : FunctionComponent;
    } else if (Component !== void 0 && Component !== null) {
      var $$typeof = Component.$$typeof;
      if ($$typeof === REACT_FORWARD_REF_TYPE) {
        return ForwardRef;
      }
      if ($$typeof === REACT_MEMO_TYPE) {
        return MemoComponent;
      }
    }
    return IndeterminateComponent;
  }
  function createWorkInProgress(current2, pendingProps, expirationTime) {
    var workInProgress = current2.alternate;
    if (workInProgress === null) {
      workInProgress = createFiber(current2.tag, pendingProps, current2.key, current2.mode);
      workInProgress.elementType = current2.elementType;
      workInProgress.type = current2.type;
      workInProgress.stateNode = current2.stateNode;
      {
        workInProgress._debugID = current2._debugID;
        workInProgress._debugSource = current2._debugSource;
        workInProgress._debugOwner = current2._debugOwner;
      }
      workInProgress.alternate = current2;
      current2.alternate = workInProgress;
    } else {
      workInProgress.pendingProps = pendingProps;
      workInProgress.effectTag = NoEffect;
      workInProgress.nextEffect = null;
      workInProgress.firstEffect = null;
      workInProgress.lastEffect = null;
      if (enableProfilerTimer) {
        workInProgress.actualDuration = 0;
        workInProgress.actualStartTime = -1;
      }
    }
    workInProgress.childExpirationTime = current2.childExpirationTime;
    workInProgress.expirationTime = current2.expirationTime;
    workInProgress.child = current2.child;
    workInProgress.memoizedProps = current2.memoizedProps;
    workInProgress.memoizedState = current2.memoizedState;
    workInProgress.updateQueue = current2.updateQueue;
    workInProgress.firstContextDependency = current2.firstContextDependency;
    workInProgress.sibling = current2.sibling;
    workInProgress.index = current2.index;
    workInProgress.ref = current2.ref;
    if (enableProfilerTimer) {
      workInProgress.selfBaseDuration = current2.selfBaseDuration;
      workInProgress.treeBaseDuration = current2.treeBaseDuration;
    }
    return workInProgress;
  }
  function createHostRootFiber(isConcurrent) {
    var mode = isConcurrent ? ConcurrentMode | StrictMode : NoContext;
    if (enableProfilerTimer && isDevToolsPresent) {
      mode |= ProfileMode;
    }
    return createFiber(HostRoot, null, null, mode);
  }
  function createFiberFromTypeAndProps(type, key, pendingProps, owner, mode, expirationTime) {
    var fiber = void 0;
    var fiberTag = IndeterminateComponent;
    var resolvedType = type;
    if (typeof type === "function") {
      if (shouldConstruct(type)) {
        fiberTag = ClassComponent;
      }
    } else if (typeof type === "string") {
      fiberTag = HostComponent;
    } else {
      getTag: switch (type) {
        case REACT_FRAGMENT_TYPE:
          return createFiberFromFragment(pendingProps.children, mode, expirationTime, key);
        case REACT_CONCURRENT_MODE_TYPE:
          return createFiberFromMode(pendingProps, mode | ConcurrentMode | StrictMode, expirationTime, key);
        case REACT_STRICT_MODE_TYPE:
          return createFiberFromMode(pendingProps, mode | StrictMode, expirationTime, key);
        case REACT_PROFILER_TYPE:
          return createFiberFromProfiler(pendingProps, mode, expirationTime, key);
        case REACT_SUSPENSE_TYPE:
          return createFiberFromSuspense(pendingProps, mode, expirationTime, key);
        default: {
          if (typeof type === "object" && type !== null) {
            switch (type.$$typeof) {
              case REACT_PROVIDER_TYPE:
                fiberTag = ContextProvider;
                break getTag;
              case REACT_CONTEXT_TYPE:
                fiberTag = ContextConsumer;
                break getTag;
              case REACT_FORWARD_REF_TYPE:
                fiberTag = ForwardRef;
                break getTag;
              case REACT_MEMO_TYPE:
                fiberTag = MemoComponent;
                break getTag;
              case REACT_LAZY_TYPE:
                fiberTag = LazyComponent;
                resolvedType = null;
                break getTag;
            }
          }
          var info = "";
          {
            if (type === void 0 || typeof type === "object" && type !== null && Object.keys(type).length === 0) {
              info += " You likely forgot to export your component from the file it's defined in, or you might have mixed up default and named imports.";
            }
            var ownerName = owner ? getComponentName(owner.type) : null;
            if (ownerName) {
              info += "\n\nCheck the render method of `" + ownerName + "`.";
            }
          }
          invariant(false, "Element type is invalid: expected a string (for built-in components) or a class/function (for composite components) but got: %s.%s", type == null ? type : typeof type, info);
        }
      }
    }
    fiber = createFiber(fiberTag, pendingProps, key, mode);
    fiber.elementType = type;
    fiber.type = resolvedType;
    fiber.expirationTime = expirationTime;
    return fiber;
  }
  function createFiberFromElement(element, mode, expirationTime) {
    var owner = null;
    {
      owner = element._owner;
    }
    var type = element.type;
    var key = element.key;
    var pendingProps = element.props;
    var fiber = createFiberFromTypeAndProps(type, key, pendingProps, owner, mode, expirationTime);
    {
      fiber._debugSource = element._source;
      fiber._debugOwner = element._owner;
    }
    return fiber;
  }
  function createFiberFromFragment(elements, mode, expirationTime, key) {
    var fiber = createFiber(Fragment, elements, key, mode);
    fiber.expirationTime = expirationTime;
    return fiber;
  }
  function createFiberFromProfiler(pendingProps, mode, expirationTime, key) {
    {
      if (typeof pendingProps.id !== "string" || typeof pendingProps.onRender !== "function") {
        warningWithoutStack$1(false, 'Profiler must specify an "id" string and "onRender" function as props');
      }
    }
    var fiber = createFiber(Profiler, pendingProps, key, mode | ProfileMode);
    fiber.elementType = REACT_PROFILER_TYPE;
    fiber.type = REACT_PROFILER_TYPE;
    fiber.expirationTime = expirationTime;
    return fiber;
  }
  function createFiberFromMode(pendingProps, mode, expirationTime, key) {
    var fiber = createFiber(Mode, pendingProps, key, mode);
    var type = (mode & ConcurrentMode) === NoContext ? REACT_STRICT_MODE_TYPE : REACT_CONCURRENT_MODE_TYPE;
    fiber.elementType = type;
    fiber.type = type;
    fiber.expirationTime = expirationTime;
    return fiber;
  }
  function createFiberFromSuspense(pendingProps, mode, expirationTime, key) {
    var fiber = createFiber(SuspenseComponent, pendingProps, key, mode);
    var type = REACT_SUSPENSE_TYPE;
    fiber.elementType = type;
    fiber.type = type;
    fiber.expirationTime = expirationTime;
    return fiber;
  }
  function createFiberFromText(content, mode, expirationTime) {
    var fiber = createFiber(HostText, content, null, mode);
    fiber.expirationTime = expirationTime;
    return fiber;
  }
  function createFiberFromHostInstanceForDeletion() {
    var fiber = createFiber(HostComponent, null, null, NoContext);
    fiber.elementType = "DELETED";
    fiber.type = "DELETED";
    return fiber;
  }
  function createFiberFromPortal(portal, mode, expirationTime) {
    var pendingProps = portal.children !== null ? portal.children : [];
    var fiber = createFiber(HostPortal, pendingProps, portal.key, mode);
    fiber.expirationTime = expirationTime;
    fiber.stateNode = {
      containerInfo: portal.containerInfo,
      pendingChildren: null,
      // Used by persistent updates
      implementation: portal.implementation
    };
    return fiber;
  }
  function assignFiberPropertiesInDEV(target, source) {
    if (target === null) {
      target = createFiber(IndeterminateComponent, null, null, NoContext);
    }
    target.tag = source.tag;
    target.key = source.key;
    target.elementType = source.elementType;
    target.type = source.type;
    target.stateNode = source.stateNode;
    target.return = source.return;
    target.child = source.child;
    target.sibling = source.sibling;
    target.index = source.index;
    target.ref = source.ref;
    target.pendingProps = source.pendingProps;
    target.memoizedProps = source.memoizedProps;
    target.updateQueue = source.updateQueue;
    target.memoizedState = source.memoizedState;
    target.firstContextDependency = source.firstContextDependency;
    target.mode = source.mode;
    target.effectTag = source.effectTag;
    target.nextEffect = source.nextEffect;
    target.firstEffect = source.firstEffect;
    target.lastEffect = source.lastEffect;
    target.expirationTime = source.expirationTime;
    target.childExpirationTime = source.childExpirationTime;
    target.alternate = source.alternate;
    if (enableProfilerTimer) {
      target.actualDuration = source.actualDuration;
      target.actualStartTime = source.actualStartTime;
      target.selfBaseDuration = source.selfBaseDuration;
      target.treeBaseDuration = source.treeBaseDuration;
    }
    target._debugID = source._debugID;
    target._debugSource = source._debugSource;
    target._debugOwner = source._debugOwner;
    target._debugIsCurrentlyTiming = source._debugIsCurrentlyTiming;
    return target;
  }
  var ReactInternals$2 = React2.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED;
  var _ReactInternals$Sched$1 = ReactInternals$2.SchedulerTracing;
  var __interactionsRef = _ReactInternals$Sched$1.__interactionsRef;
  var __subscriberRef = _ReactInternals$Sched$1.__subscriberRef;
  var unstable_clear = _ReactInternals$Sched$1.unstable_clear;
  var unstable_getCurrent = _ReactInternals$Sched$1.unstable_getCurrent;
  var unstable_getThreadID = _ReactInternals$Sched$1.unstable_getThreadID;
  var unstable_subscribe = _ReactInternals$Sched$1.unstable_subscribe;
  var unstable_trace = _ReactInternals$Sched$1.unstable_trace;
  var unstable_unsubscribe = _ReactInternals$Sched$1.unstable_unsubscribe;
  var unstable_wrap = _ReactInternals$Sched$1.unstable_wrap;
  function createFiberRoot(containerInfo, isConcurrent, hydrate2) {
    var uninitializedFiber = createHostRootFiber(isConcurrent);
    var root2 = void 0;
    if (enableSchedulerTracing) {
      root2 = {
        current: uninitializedFiber,
        containerInfo,
        pendingChildren: null,
        earliestPendingTime: NoWork,
        latestPendingTime: NoWork,
        earliestSuspendedTime: NoWork,
        latestSuspendedTime: NoWork,
        latestPingedTime: NoWork,
        didError: false,
        pendingCommitExpirationTime: NoWork,
        finishedWork: null,
        timeoutHandle: noTimeout,
        context: null,
        pendingContext: null,
        hydrate: hydrate2,
        nextExpirationTimeToWorkOn: NoWork,
        expirationTime: NoWork,
        firstBatch: null,
        nextScheduledRoot: null,
        interactionThreadID: unstable_getThreadID(),
        memoizedInteractions: /* @__PURE__ */ new Set(),
        pendingInteractionMap: /* @__PURE__ */ new Map()
      };
    } else {
      root2 = {
        current: uninitializedFiber,
        containerInfo,
        pendingChildren: null,
        earliestPendingTime: NoWork,
        latestPendingTime: NoWork,
        earliestSuspendedTime: NoWork,
        latestSuspendedTime: NoWork,
        latestPingedTime: NoWork,
        didError: false,
        pendingCommitExpirationTime: NoWork,
        finishedWork: null,
        timeoutHandle: noTimeout,
        context: null,
        pendingContext: null,
        hydrate: hydrate2,
        nextExpirationTimeToWorkOn: NoWork,
        expirationTime: NoWork,
        firstBatch: null,
        nextScheduledRoot: null
      };
    }
    uninitializedFiber.stateNode = root2;
    return root2;
  }
  var lowPriorityWarning = function() {
  };
  {
    var printWarning$1 = function(format) {
      for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
      }
      var argIndex = 0;
      var message = "Warning: " + format.replace(/%s/g, function() {
        return args[argIndex++];
      });
      if (typeof console !== "undefined") {
        console.warn(message);
      }
      try {
        throw new Error(message);
      } catch (x) {
      }
    };
    lowPriorityWarning = function(condition, format) {
      if (format === void 0) {
        throw new Error("`lowPriorityWarning(condition, format, ...args)` requires a warning message argument");
      }
      if (!condition) {
        for (var _len2 = arguments.length, args = Array(_len2 > 2 ? _len2 - 2 : 0), _key2 = 2; _key2 < _len2; _key2++) {
          args[_key2 - 2] = arguments[_key2];
        }
        printWarning$1.apply(void 0, [format].concat(args));
      }
    };
  }
  var lowPriorityWarning$1 = lowPriorityWarning;
  var ReactStrictModeWarnings = {
    discardPendingWarnings: function() {
    },
    flushPendingDeprecationWarnings: function() {
    },
    flushPendingUnsafeLifecycleWarnings: function() {
    },
    recordDeprecationWarnings: function(fiber, instance) {
    },
    recordUnsafeLifecycleWarnings: function(fiber, instance) {
    },
    recordLegacyContextWarning: function(fiber, instance) {
    },
    flushLegacyContextWarning: function() {
    }
  };
  {
    var LIFECYCLE_SUGGESTIONS = {
      UNSAFE_componentWillMount: "componentDidMount",
      UNSAFE_componentWillReceiveProps: "static getDerivedStateFromProps",
      UNSAFE_componentWillUpdate: "componentDidUpdate"
    };
    var pendingComponentWillMountWarnings = [];
    var pendingComponentWillReceivePropsWarnings = [];
    var pendingComponentWillUpdateWarnings = [];
    var pendingUnsafeLifecycleWarnings = /* @__PURE__ */ new Map();
    var pendingLegacyContextWarning = /* @__PURE__ */ new Map();
    var didWarnAboutDeprecatedLifecycles = /* @__PURE__ */ new Set();
    var didWarnAboutUnsafeLifecycles = /* @__PURE__ */ new Set();
    var didWarnAboutLegacyContext = /* @__PURE__ */ new Set();
    var setToSortedString = function(set2) {
      var array = [];
      set2.forEach(function(value) {
        array.push(value);
      });
      return array.sort().join(", ");
    };
    ReactStrictModeWarnings.discardPendingWarnings = function() {
      pendingComponentWillMountWarnings = [];
      pendingComponentWillReceivePropsWarnings = [];
      pendingComponentWillUpdateWarnings = [];
      pendingUnsafeLifecycleWarnings = /* @__PURE__ */ new Map();
      pendingLegacyContextWarning = /* @__PURE__ */ new Map();
    };
    ReactStrictModeWarnings.flushPendingUnsafeLifecycleWarnings = function() {
      pendingUnsafeLifecycleWarnings.forEach(function(lifecycleWarningsMap, strictRoot) {
        var lifecyclesWarningMesages = [];
        Object.keys(lifecycleWarningsMap).forEach(function(lifecycle) {
          var lifecycleWarnings = lifecycleWarningsMap[lifecycle];
          if (lifecycleWarnings.length > 0) {
            var componentNames = /* @__PURE__ */ new Set();
            lifecycleWarnings.forEach(function(fiber) {
              componentNames.add(getComponentName(fiber.type) || "Component");
              didWarnAboutUnsafeLifecycles.add(fiber.type);
            });
            var formatted = lifecycle.replace("UNSAFE_", "");
            var suggestion = LIFECYCLE_SUGGESTIONS[lifecycle];
            var sortedComponentNames = setToSortedString(componentNames);
            lifecyclesWarningMesages.push(formatted + ": Please update the following components to use " + (suggestion + " instead: " + sortedComponentNames));
          }
        });
        if (lifecyclesWarningMesages.length > 0) {
          var strictRootComponentStack = getStackByFiberInDevAndProd(strictRoot);
          warningWithoutStack$1(false, "Unsafe lifecycle methods were found within a strict-mode tree:%s\n\n%s\n\nLearn more about this warning here:\nhttps://fb.me/react-strict-mode-warnings", strictRootComponentStack, lifecyclesWarningMesages.join("\n\n"));
        }
      });
      pendingUnsafeLifecycleWarnings = /* @__PURE__ */ new Map();
    };
    var findStrictRoot = function(fiber) {
      var maybeStrictRoot = null;
      var node = fiber;
      while (node !== null) {
        if (node.mode & StrictMode) {
          maybeStrictRoot = node;
        }
        node = node.return;
      }
      return maybeStrictRoot;
    };
    ReactStrictModeWarnings.flushPendingDeprecationWarnings = function() {
      if (pendingComponentWillMountWarnings.length > 0) {
        var uniqueNames = /* @__PURE__ */ new Set();
        pendingComponentWillMountWarnings.forEach(function(fiber) {
          uniqueNames.add(getComponentName(fiber.type) || "Component");
          didWarnAboutDeprecatedLifecycles.add(fiber.type);
        });
        var sortedNames = setToSortedString(uniqueNames);
        lowPriorityWarning$1(false, "componentWillMount is deprecated and will be removed in the next major version. Use componentDidMount instead. As a temporary workaround, you can rename to UNSAFE_componentWillMount.\n\nPlease update the following components: %s\n\nLearn more about this warning here:\nhttps://fb.me/react-async-component-lifecycle-hooks", sortedNames);
        pendingComponentWillMountWarnings = [];
      }
      if (pendingComponentWillReceivePropsWarnings.length > 0) {
        var _uniqueNames = /* @__PURE__ */ new Set();
        pendingComponentWillReceivePropsWarnings.forEach(function(fiber) {
          _uniqueNames.add(getComponentName(fiber.type) || "Component");
          didWarnAboutDeprecatedLifecycles.add(fiber.type);
        });
        var _sortedNames = setToSortedString(_uniqueNames);
        lowPriorityWarning$1(false, "componentWillReceiveProps is deprecated and will be removed in the next major version. Use static getDerivedStateFromProps instead.\n\nPlease update the following components: %s\n\nLearn more about this warning here:\nhttps://fb.me/react-async-component-lifecycle-hooks", _sortedNames);
        pendingComponentWillReceivePropsWarnings = [];
      }
      if (pendingComponentWillUpdateWarnings.length > 0) {
        var _uniqueNames2 = /* @__PURE__ */ new Set();
        pendingComponentWillUpdateWarnings.forEach(function(fiber) {
          _uniqueNames2.add(getComponentName(fiber.type) || "Component");
          didWarnAboutDeprecatedLifecycles.add(fiber.type);
        });
        var _sortedNames2 = setToSortedString(_uniqueNames2);
        lowPriorityWarning$1(false, "componentWillUpdate is deprecated and will be removed in the next major version. Use componentDidUpdate instead. As a temporary workaround, you can rename to UNSAFE_componentWillUpdate.\n\nPlease update the following components: %s\n\nLearn more about this warning here:\nhttps://fb.me/react-async-component-lifecycle-hooks", _sortedNames2);
        pendingComponentWillUpdateWarnings = [];
      }
    };
    ReactStrictModeWarnings.recordDeprecationWarnings = function(fiber, instance) {
      if (didWarnAboutDeprecatedLifecycles.has(fiber.type)) {
        return;
      }
      if (typeof instance.componentWillMount === "function" && instance.componentWillMount.__suppressDeprecationWarning !== true) {
        pendingComponentWillMountWarnings.push(fiber);
      }
      if (typeof instance.componentWillReceiveProps === "function" && instance.componentWillReceiveProps.__suppressDeprecationWarning !== true) {
        pendingComponentWillReceivePropsWarnings.push(fiber);
      }
      if (typeof instance.componentWillUpdate === "function" && instance.componentWillUpdate.__suppressDeprecationWarning !== true) {
        pendingComponentWillUpdateWarnings.push(fiber);
      }
    };
    ReactStrictModeWarnings.recordUnsafeLifecycleWarnings = function(fiber, instance) {
      var strictRoot = findStrictRoot(fiber);
      if (strictRoot === null) {
        warningWithoutStack$1(false, "Expected to find a StrictMode component in a strict mode tree. This error is likely caused by a bug in React. Please file an issue.");
        return;
      }
      if (didWarnAboutUnsafeLifecycles.has(fiber.type)) {
        return;
      }
      var warningsForRoot = void 0;
      if (!pendingUnsafeLifecycleWarnings.has(strictRoot)) {
        warningsForRoot = {
          UNSAFE_componentWillMount: [],
          UNSAFE_componentWillReceiveProps: [],
          UNSAFE_componentWillUpdate: []
        };
        pendingUnsafeLifecycleWarnings.set(strictRoot, warningsForRoot);
      } else {
        warningsForRoot = pendingUnsafeLifecycleWarnings.get(strictRoot);
      }
      var unsafeLifecycles = [];
      if (typeof instance.componentWillMount === "function" && instance.componentWillMount.__suppressDeprecationWarning !== true || typeof instance.UNSAFE_componentWillMount === "function") {
        unsafeLifecycles.push("UNSAFE_componentWillMount");
      }
      if (typeof instance.componentWillReceiveProps === "function" && instance.componentWillReceiveProps.__suppressDeprecationWarning !== true || typeof instance.UNSAFE_componentWillReceiveProps === "function") {
        unsafeLifecycles.push("UNSAFE_componentWillReceiveProps");
      }
      if (typeof instance.componentWillUpdate === "function" && instance.componentWillUpdate.__suppressDeprecationWarning !== true || typeof instance.UNSAFE_componentWillUpdate === "function") {
        unsafeLifecycles.push("UNSAFE_componentWillUpdate");
      }
      if (unsafeLifecycles.length > 0) {
        unsafeLifecycles.forEach(function(lifecycle) {
          warningsForRoot[lifecycle].push(fiber);
        });
      }
    };
    ReactStrictModeWarnings.recordLegacyContextWarning = function(fiber, instance) {
      var strictRoot = findStrictRoot(fiber);
      if (strictRoot === null) {
        warningWithoutStack$1(false, "Expected to find a StrictMode component in a strict mode tree. This error is likely caused by a bug in React. Please file an issue.");
        return;
      }
      if (didWarnAboutLegacyContext.has(fiber.type)) {
        return;
      }
      var warningsForRoot = pendingLegacyContextWarning.get(strictRoot);
      if (fiber.type.contextTypes != null || fiber.type.childContextTypes != null || instance !== null && typeof instance.getChildContext === "function") {
        if (warningsForRoot === void 0) {
          warningsForRoot = [];
          pendingLegacyContextWarning.set(strictRoot, warningsForRoot);
        }
        warningsForRoot.push(fiber);
      }
    };
    ReactStrictModeWarnings.flushLegacyContextWarning = function() {
      pendingLegacyContextWarning.forEach(function(fiberArray, strictRoot) {
        var uniqueNames = /* @__PURE__ */ new Set();
        fiberArray.forEach(function(fiber) {
          uniqueNames.add(getComponentName(fiber.type) || "Component");
          didWarnAboutLegacyContext.add(fiber.type);
        });
        var sortedNames = setToSortedString(uniqueNames);
        var strictRootComponentStack = getStackByFiberInDevAndProd(strictRoot);
        warningWithoutStack$1(false, "Legacy context API has been detected within a strict-mode tree: %s\n\nPlease update the following components: %s\n\nLearn more about this warning here:\nhttps://fb.me/react-strict-mode-warnings", strictRootComponentStack, sortedNames);
      });
    };
  }
  var ReactFiberInstrumentation = {
    debugTool: null
  };
  var ReactFiberInstrumentation_1 = ReactFiberInstrumentation;
  function markPendingPriorityLevel(root2, expirationTime) {
    root2.didError = false;
    var earliestPendingTime = root2.earliestPendingTime;
    if (earliestPendingTime === NoWork) {
      root2.earliestPendingTime = root2.latestPendingTime = expirationTime;
    } else {
      if (earliestPendingTime < expirationTime) {
        root2.earliestPendingTime = expirationTime;
      } else {
        var latestPendingTime = root2.latestPendingTime;
        if (latestPendingTime > expirationTime) {
          root2.latestPendingTime = expirationTime;
        }
      }
    }
    findNextExpirationTimeToWorkOn(expirationTime, root2);
  }
  function markCommittedPriorityLevels(root2, earliestRemainingTime) {
    root2.didError = false;
    if (earliestRemainingTime === NoWork) {
      root2.earliestPendingTime = NoWork;
      root2.latestPendingTime = NoWork;
      root2.earliestSuspendedTime = NoWork;
      root2.latestSuspendedTime = NoWork;
      root2.latestPingedTime = NoWork;
      findNextExpirationTimeToWorkOn(NoWork, root2);
      return;
    }
    var latestPendingTime = root2.latestPendingTime;
    if (latestPendingTime !== NoWork) {
      if (latestPendingTime > earliestRemainingTime) {
        root2.earliestPendingTime = root2.latestPendingTime = NoWork;
      } else {
        var earliestPendingTime = root2.earliestPendingTime;
        if (earliestPendingTime > earliestRemainingTime) {
          root2.earliestPendingTime = root2.latestPendingTime;
        }
      }
    }
    var earliestSuspendedTime = root2.earliestSuspendedTime;
    if (earliestSuspendedTime === NoWork) {
      markPendingPriorityLevel(root2, earliestRemainingTime);
      findNextExpirationTimeToWorkOn(NoWork, root2);
      return;
    }
    var latestSuspendedTime = root2.latestSuspendedTime;
    if (earliestRemainingTime < latestSuspendedTime) {
      root2.earliestSuspendedTime = NoWork;
      root2.latestSuspendedTime = NoWork;
      root2.latestPingedTime = NoWork;
      markPendingPriorityLevel(root2, earliestRemainingTime);
      findNextExpirationTimeToWorkOn(NoWork, root2);
      return;
    }
    if (earliestRemainingTime > earliestSuspendedTime) {
      markPendingPriorityLevel(root2, earliestRemainingTime);
      findNextExpirationTimeToWorkOn(NoWork, root2);
      return;
    }
    findNextExpirationTimeToWorkOn(NoWork, root2);
  }
  function hasLowerPriorityWork(root2, erroredExpirationTime) {
    var latestPendingTime = root2.latestPendingTime;
    var latestSuspendedTime = root2.latestSuspendedTime;
    var latestPingedTime = root2.latestPingedTime;
    return latestPendingTime !== NoWork && latestPendingTime < erroredExpirationTime || latestSuspendedTime !== NoWork && latestSuspendedTime < erroredExpirationTime || latestPingedTime !== NoWork && latestPingedTime < erroredExpirationTime;
  }
  function isPriorityLevelSuspended(root2, expirationTime) {
    var earliestSuspendedTime = root2.earliestSuspendedTime;
    var latestSuspendedTime = root2.latestSuspendedTime;
    return earliestSuspendedTime !== NoWork && expirationTime <= earliestSuspendedTime && expirationTime >= latestSuspendedTime;
  }
  function markSuspendedPriorityLevel(root2, suspendedTime) {
    root2.didError = false;
    clearPing(root2, suspendedTime);
    var earliestPendingTime = root2.earliestPendingTime;
    var latestPendingTime = root2.latestPendingTime;
    if (earliestPendingTime === suspendedTime) {
      if (latestPendingTime === suspendedTime) {
        root2.earliestPendingTime = root2.latestPendingTime = NoWork;
      } else {
        root2.earliestPendingTime = latestPendingTime;
      }
    } else if (latestPendingTime === suspendedTime) {
      root2.latestPendingTime = earliestPendingTime;
    }
    var earliestSuspendedTime = root2.earliestSuspendedTime;
    var latestSuspendedTime = root2.latestSuspendedTime;
    if (earliestSuspendedTime === NoWork) {
      root2.earliestSuspendedTime = root2.latestSuspendedTime = suspendedTime;
    } else {
      if (earliestSuspendedTime < suspendedTime) {
        root2.earliestSuspendedTime = suspendedTime;
      } else if (latestSuspendedTime > suspendedTime) {
        root2.latestSuspendedTime = suspendedTime;
      }
    }
    findNextExpirationTimeToWorkOn(suspendedTime, root2);
  }
  function markPingedPriorityLevel(root2, pingedTime) {
    root2.didError = false;
    var latestPingedTime = root2.latestPingedTime;
    if (latestPingedTime === NoWork || latestPingedTime > pingedTime) {
      root2.latestPingedTime = pingedTime;
    }
    findNextExpirationTimeToWorkOn(pingedTime, root2);
  }
  function clearPing(root2, completedTime) {
    var latestPingedTime = root2.latestPingedTime;
    if (latestPingedTime !== NoWork && latestPingedTime >= completedTime) {
      root2.latestPingedTime = NoWork;
    }
  }
  function findEarliestOutstandingPriorityLevel(root2, renderExpirationTime2) {
    var earliestExpirationTime = renderExpirationTime2;
    var earliestPendingTime = root2.earliestPendingTime;
    var earliestSuspendedTime = root2.earliestSuspendedTime;
    if (earliestPendingTime > earliestExpirationTime) {
      earliestExpirationTime = earliestPendingTime;
    }
    if (earliestSuspendedTime > earliestExpirationTime) {
      earliestExpirationTime = earliestSuspendedTime;
    }
    return earliestExpirationTime;
  }
  function didExpireAtExpirationTime(root2, currentTime) {
    var expirationTime = root2.expirationTime;
    if (expirationTime !== NoWork && currentTime <= expirationTime) {
      root2.nextExpirationTimeToWorkOn = currentTime;
    }
  }
  function findNextExpirationTimeToWorkOn(completedExpirationTime, root2) {
    var earliestSuspendedTime = root2.earliestSuspendedTime;
    var latestSuspendedTime = root2.latestSuspendedTime;
    var earliestPendingTime = root2.earliestPendingTime;
    var latestPingedTime = root2.latestPingedTime;
    var nextExpirationTimeToWorkOn = earliestPendingTime !== NoWork ? earliestPendingTime : latestPingedTime;
    if (nextExpirationTimeToWorkOn === NoWork && (completedExpirationTime === NoWork || latestSuspendedTime < completedExpirationTime)) {
      nextExpirationTimeToWorkOn = latestSuspendedTime;
    }
    var expirationTime = nextExpirationTimeToWorkOn;
    if (expirationTime !== NoWork && earliestSuspendedTime > expirationTime) {
      expirationTime = earliestSuspendedTime;
    }
    root2.nextExpirationTimeToWorkOn = nextExpirationTimeToWorkOn;
    root2.expirationTime = expirationTime;
  }
  var UpdateState = 0;
  var ReplaceState = 1;
  var ForceUpdate = 2;
  var CaptureUpdate = 3;
  var hasForceUpdate = false;
  var didWarnUpdateInsideUpdate = void 0;
  var currentlyProcessingQueue = void 0;
  var resetCurrentlyProcessingQueue = void 0;
  {
    didWarnUpdateInsideUpdate = false;
    currentlyProcessingQueue = null;
    resetCurrentlyProcessingQueue = function() {
      currentlyProcessingQueue = null;
    };
  }
  function createUpdateQueue(baseState) {
    var queue = {
      baseState,
      firstUpdate: null,
      lastUpdate: null,
      firstCapturedUpdate: null,
      lastCapturedUpdate: null,
      firstEffect: null,
      lastEffect: null,
      firstCapturedEffect: null,
      lastCapturedEffect: null
    };
    return queue;
  }
  function cloneUpdateQueue(currentQueue) {
    var queue = {
      baseState: currentQueue.baseState,
      firstUpdate: currentQueue.firstUpdate,
      lastUpdate: currentQueue.lastUpdate,
      // TODO: With resuming, if we bail out and resuse the child tree, we should
      // keep these effects.
      firstCapturedUpdate: null,
      lastCapturedUpdate: null,
      firstEffect: null,
      lastEffect: null,
      firstCapturedEffect: null,
      lastCapturedEffect: null
    };
    return queue;
  }
  function createUpdate(expirationTime) {
    return {
      expirationTime,
      tag: UpdateState,
      payload: null,
      callback: null,
      next: null,
      nextEffect: null
    };
  }
  function appendUpdateToQueue(queue, update) {
    if (queue.lastUpdate === null) {
      queue.firstUpdate = queue.lastUpdate = update;
    } else {
      queue.lastUpdate.next = update;
      queue.lastUpdate = update;
    }
  }
  function enqueueUpdate(fiber, update) {
    var alternate = fiber.alternate;
    var queue1 = void 0;
    var queue2 = void 0;
    if (alternate === null) {
      queue1 = fiber.updateQueue;
      queue2 = null;
      if (queue1 === null) {
        queue1 = fiber.updateQueue = createUpdateQueue(fiber.memoizedState);
      }
    } else {
      queue1 = fiber.updateQueue;
      queue2 = alternate.updateQueue;
      if (queue1 === null) {
        if (queue2 === null) {
          queue1 = fiber.updateQueue = createUpdateQueue(fiber.memoizedState);
          queue2 = alternate.updateQueue = createUpdateQueue(alternate.memoizedState);
        } else {
          queue1 = fiber.updateQueue = cloneUpdateQueue(queue2);
        }
      } else {
        if (queue2 === null) {
          queue2 = alternate.updateQueue = cloneUpdateQueue(queue1);
        } else {
        }
      }
    }
    if (queue2 === null || queue1 === queue2) {
      appendUpdateToQueue(queue1, update);
    } else {
      if (queue1.lastUpdate === null || queue2.lastUpdate === null) {
        appendUpdateToQueue(queue1, update);
        appendUpdateToQueue(queue2, update);
      } else {
        appendUpdateToQueue(queue1, update);
        queue2.lastUpdate = update;
      }
    }
    {
      if (fiber.tag === ClassComponent && (currentlyProcessingQueue === queue1 || queue2 !== null && currentlyProcessingQueue === queue2) && !didWarnUpdateInsideUpdate) {
        warningWithoutStack$1(false, "An update (setState, replaceState, or forceUpdate) was scheduled from inside an update function. Update functions should be pure, with zero side-effects. Consider using componentDidUpdate or a callback.");
        didWarnUpdateInsideUpdate = true;
      }
    }
  }
  function enqueueCapturedUpdate(workInProgress, update) {
    var workInProgressQueue = workInProgress.updateQueue;
    if (workInProgressQueue === null) {
      workInProgressQueue = workInProgress.updateQueue = createUpdateQueue(workInProgress.memoizedState);
    } else {
      workInProgressQueue = ensureWorkInProgressQueueIsAClone(workInProgress, workInProgressQueue);
    }
    if (workInProgressQueue.lastCapturedUpdate === null) {
      workInProgressQueue.firstCapturedUpdate = workInProgressQueue.lastCapturedUpdate = update;
    } else {
      workInProgressQueue.lastCapturedUpdate.next = update;
      workInProgressQueue.lastCapturedUpdate = update;
    }
  }
  function ensureWorkInProgressQueueIsAClone(workInProgress, queue) {
    var current2 = workInProgress.alternate;
    if (current2 !== null) {
      if (queue === current2.updateQueue) {
        queue = workInProgress.updateQueue = cloneUpdateQueue(queue);
      }
    }
    return queue;
  }
  function getStateFromUpdate(workInProgress, queue, update, prevState, nextProps, instance) {
    switch (update.tag) {
      case ReplaceState: {
        var _payload = update.payload;
        if (typeof _payload === "function") {
          {
            if (debugRenderPhaseSideEffects || debugRenderPhaseSideEffectsForStrictMode && workInProgress.mode & StrictMode) {
              _payload.call(instance, prevState, nextProps);
            }
          }
          return _payload.call(instance, prevState, nextProps);
        }
        return _payload;
      }
      case CaptureUpdate: {
        workInProgress.effectTag = workInProgress.effectTag & ~ShouldCapture | DidCapture;
      }
      // Intentional fallthrough
      case UpdateState: {
        var _payload2 = update.payload;
        var partialState = void 0;
        if (typeof _payload2 === "function") {
          {
            if (debugRenderPhaseSideEffects || debugRenderPhaseSideEffectsForStrictMode && workInProgress.mode & StrictMode) {
              _payload2.call(instance, prevState, nextProps);
            }
          }
          partialState = _payload2.call(instance, prevState, nextProps);
        } else {
          partialState = _payload2;
        }
        if (partialState === null || partialState === void 0) {
          return prevState;
        }
        return _assign({}, prevState, partialState);
      }
      case ForceUpdate: {
        hasForceUpdate = true;
        return prevState;
      }
    }
    return prevState;
  }
  function processUpdateQueue(workInProgress, queue, props, instance, renderExpirationTime2) {
    hasForceUpdate = false;
    queue = ensureWorkInProgressQueueIsAClone(workInProgress, queue);
    {
      currentlyProcessingQueue = queue;
    }
    var newBaseState = queue.baseState;
    var newFirstUpdate = null;
    var newExpirationTime = NoWork;
    var update = queue.firstUpdate;
    var resultState = newBaseState;
    while (update !== null) {
      var updateExpirationTime = update.expirationTime;
      if (updateExpirationTime < renderExpirationTime2) {
        if (newFirstUpdate === null) {
          newFirstUpdate = update;
          newBaseState = resultState;
        }
        if (newExpirationTime < updateExpirationTime) {
          newExpirationTime = updateExpirationTime;
        }
      } else {
        resultState = getStateFromUpdate(workInProgress, queue, update, resultState, props, instance);
        var _callback = update.callback;
        if (_callback !== null) {
          workInProgress.effectTag |= Callback;
          update.nextEffect = null;
          if (queue.lastEffect === null) {
            queue.firstEffect = queue.lastEffect = update;
          } else {
            queue.lastEffect.nextEffect = update;
            queue.lastEffect = update;
          }
        }
      }
      update = update.next;
    }
    var newFirstCapturedUpdate = null;
    update = queue.firstCapturedUpdate;
    while (update !== null) {
      var _updateExpirationTime = update.expirationTime;
      if (_updateExpirationTime < renderExpirationTime2) {
        if (newFirstCapturedUpdate === null) {
          newFirstCapturedUpdate = update;
          if (newFirstUpdate === null) {
            newBaseState = resultState;
          }
        }
        if (newExpirationTime < _updateExpirationTime) {
          newExpirationTime = _updateExpirationTime;
        }
      } else {
        resultState = getStateFromUpdate(workInProgress, queue, update, resultState, props, instance);
        var _callback2 = update.callback;
        if (_callback2 !== null) {
          workInProgress.effectTag |= Callback;
          update.nextEffect = null;
          if (queue.lastCapturedEffect === null) {
            queue.firstCapturedEffect = queue.lastCapturedEffect = update;
          } else {
            queue.lastCapturedEffect.nextEffect = update;
            queue.lastCapturedEffect = update;
          }
        }
      }
      update = update.next;
    }
    if (newFirstUpdate === null) {
      queue.lastUpdate = null;
    }
    if (newFirstCapturedUpdate === null) {
      queue.lastCapturedUpdate = null;
    } else {
      workInProgress.effectTag |= Callback;
    }
    if (newFirstUpdate === null && newFirstCapturedUpdate === null) {
      newBaseState = resultState;
    }
    queue.baseState = newBaseState;
    queue.firstUpdate = newFirstUpdate;
    queue.firstCapturedUpdate = newFirstCapturedUpdate;
    workInProgress.expirationTime = newExpirationTime;
    workInProgress.memoizedState = resultState;
    {
      currentlyProcessingQueue = null;
    }
  }
  function callCallback(callback, context) {
    !(typeof callback === "function") ? invariant(false, "Invalid argument passed as callback. Expected a function. Instead received: %s", callback) : void 0;
    callback.call(context);
  }
  function resetHasForceUpdateBeforeProcessing() {
    hasForceUpdate = false;
  }
  function checkHasForceUpdateAfterProcessing() {
    return hasForceUpdate;
  }
  function commitUpdateQueue(finishedWork, finishedQueue, instance, renderExpirationTime2) {
    if (finishedQueue.firstCapturedUpdate !== null) {
      if (finishedQueue.lastUpdate !== null) {
        finishedQueue.lastUpdate.next = finishedQueue.firstCapturedUpdate;
        finishedQueue.lastUpdate = finishedQueue.lastCapturedUpdate;
      }
      finishedQueue.firstCapturedUpdate = finishedQueue.lastCapturedUpdate = null;
    }
    commitUpdateEffects(finishedQueue.firstEffect, instance);
    finishedQueue.firstEffect = finishedQueue.lastEffect = null;
    commitUpdateEffects(finishedQueue.firstCapturedEffect, instance);
    finishedQueue.firstCapturedEffect = finishedQueue.lastCapturedEffect = null;
  }
  function commitUpdateEffects(effect, instance) {
    while (effect !== null) {
      var _callback3 = effect.callback;
      if (_callback3 !== null) {
        effect.callback = null;
        callCallback(_callback3, instance);
      }
      effect = effect.nextEffect;
    }
  }
  function createCapturedValue(value, source) {
    return {
      value,
      source,
      stack: getStackByFiberInDevAndProd(source)
    };
  }
  var valueCursor = createCursor(null);
  var rendererSigil = void 0;
  {
    rendererSigil = {};
  }
  var currentlyRenderingFiber = null;
  var lastContextDependency = null;
  var lastContextWithAllBitsObserved = null;
  function resetContextDependences() {
    currentlyRenderingFiber = null;
    lastContextDependency = null;
    lastContextWithAllBitsObserved = null;
  }
  function pushProvider(providerFiber, nextValue) {
    var context = providerFiber.type._context;
    if (isPrimaryRenderer) {
      push(valueCursor, context._currentValue, providerFiber);
      context._currentValue = nextValue;
      {
        !(context._currentRenderer === void 0 || context._currentRenderer === null || context._currentRenderer === rendererSigil) ? warningWithoutStack$1(false, "Detected multiple renderers concurrently rendering the same context provider. This is currently unsupported.") : void 0;
        context._currentRenderer = rendererSigil;
      }
    } else {
      push(valueCursor, context._currentValue2, providerFiber);
      context._currentValue2 = nextValue;
      {
        !(context._currentRenderer2 === void 0 || context._currentRenderer2 === null || context._currentRenderer2 === rendererSigil) ? warningWithoutStack$1(false, "Detected multiple renderers concurrently rendering the same context provider. This is currently unsupported.") : void 0;
        context._currentRenderer2 = rendererSigil;
      }
    }
  }
  function popProvider(providerFiber) {
    var currentValue = valueCursor.current;
    pop(valueCursor, providerFiber);
    var context = providerFiber.type._context;
    if (isPrimaryRenderer) {
      context._currentValue = currentValue;
    } else {
      context._currentValue2 = currentValue;
    }
  }
  function calculateChangedBits(context, newValue, oldValue) {
    if (oldValue === newValue && (oldValue !== 0 || 1 / oldValue === 1 / newValue) || oldValue !== oldValue && newValue !== newValue) {
      return 0;
    } else {
      var changedBits = typeof context._calculateChangedBits === "function" ? context._calculateChangedBits(oldValue, newValue) : maxSigned31BitInt;
      {
        !((changedBits & maxSigned31BitInt) === changedBits) ? warning$1(false, "calculateChangedBits: Expected the return value to be a 31-bit integer. Instead received: %s", changedBits) : void 0;
      }
      return changedBits | 0;
    }
  }
  function propagateContextChange(workInProgress, context, changedBits, renderExpirationTime2) {
    var fiber = workInProgress.child;
    if (fiber !== null) {
      fiber.return = workInProgress;
    }
    while (fiber !== null) {
      var nextFiber = void 0;
      var dependency = fiber.firstContextDependency;
      if (dependency !== null) {
        do {
          if (dependency.context === context && (dependency.observedBits & changedBits) !== 0) {
            if (fiber.tag === ClassComponent) {
              var update = createUpdate(renderExpirationTime2);
              update.tag = ForceUpdate;
              enqueueUpdate(fiber, update);
            }
            if (fiber.expirationTime < renderExpirationTime2) {
              fiber.expirationTime = renderExpirationTime2;
            }
            var alternate = fiber.alternate;
            if (alternate !== null && alternate.expirationTime < renderExpirationTime2) {
              alternate.expirationTime = renderExpirationTime2;
            }
            var node = fiber.return;
            while (node !== null) {
              alternate = node.alternate;
              if (node.childExpirationTime < renderExpirationTime2) {
                node.childExpirationTime = renderExpirationTime2;
                if (alternate !== null && alternate.childExpirationTime < renderExpirationTime2) {
                  alternate.childExpirationTime = renderExpirationTime2;
                }
              } else if (alternate !== null && alternate.childExpirationTime < renderExpirationTime2) {
                alternate.childExpirationTime = renderExpirationTime2;
              } else {
                break;
              }
              node = node.return;
            }
          }
          nextFiber = fiber.child;
          dependency = dependency.next;
        } while (dependency !== null);
      } else if (fiber.tag === ContextProvider) {
        nextFiber = fiber.type === workInProgress.type ? null : fiber.child;
      } else {
        nextFiber = fiber.child;
      }
      if (nextFiber !== null) {
        nextFiber.return = fiber;
      } else {
        nextFiber = fiber;
        while (nextFiber !== null) {
          if (nextFiber === workInProgress) {
            nextFiber = null;
            break;
          }
          var sibling = nextFiber.sibling;
          if (sibling !== null) {
            sibling.return = nextFiber.return;
            nextFiber = sibling;
            break;
          }
          nextFiber = nextFiber.return;
        }
      }
      fiber = nextFiber;
    }
  }
  function prepareToReadContext(workInProgress, renderExpirationTime2) {
    currentlyRenderingFiber = workInProgress;
    lastContextDependency = null;
    lastContextWithAllBitsObserved = null;
    workInProgress.firstContextDependency = null;
  }
  function readContext(context, observedBits) {
    if (lastContextWithAllBitsObserved === context) {
    } else if (observedBits === false || observedBits === 0) {
    } else {
      var resolvedObservedBits = void 0;
      if (typeof observedBits !== "number" || observedBits === maxSigned31BitInt) {
        lastContextWithAllBitsObserved = context;
        resolvedObservedBits = maxSigned31BitInt;
      } else {
        resolvedObservedBits = observedBits;
      }
      var contextItem = {
        context,
        observedBits: resolvedObservedBits,
        next: null
      };
      if (lastContextDependency === null) {
        !(currentlyRenderingFiber !== null) ? invariant(false, "Context can only be read while React is rendering, e.g. inside the render method or getDerivedStateFromProps.") : void 0;
        currentlyRenderingFiber.firstContextDependency = lastContextDependency = contextItem;
      } else {
        lastContextDependency = lastContextDependency.next = contextItem;
      }
    }
    return isPrimaryRenderer ? context._currentValue : context._currentValue2;
  }
  var NoEffect$1 = (
    /*             */
    0
  );
  var UnmountSnapshot = (
    /*      */
    2
  );
  var UnmountMutation = (
    /*      */
    4
  );
  var MountMutation = (
    /*        */
    8
  );
  var UnmountLayout = (
    /*        */
    16
  );
  var MountLayout = (
    /*          */
    32
  );
  var MountPassive = (
    /*         */
    64
  );
  var UnmountPassive = (
    /*       */
    128
  );
  function areHookInputsEqual(arr1, arr2) {
    {
      !(arr1.length === arr2.length) ? warning$1(false, "Detected a variable number of hook dependencies. The length of the dependencies array should be constant between renders.\n\nPrevious: %s\nIncoming: %s", arr1.join(", "), arr2.join(", ")) : void 0;
    }
    for (var i = 0; i < arr1.length; i++) {
      var val1 = arr1[i];
      var val2 = arr2[i];
      if (val1 === val2 && (val1 !== 0 || 1 / val1 === 1 / val2) || val1 !== val1 && val2 !== val2) {
        continue;
      }
      return false;
    }
    return true;
  }
  var renderExpirationTime = NoWork;
  var currentlyRenderingFiber$1 = null;
  var firstCurrentHook = null;
  var currentHook = null;
  var firstWorkInProgressHook = null;
  var workInProgressHook = null;
  var remainingExpirationTime = NoWork;
  var componentUpdateQueue = null;
  var isReRender = false;
  var didScheduleRenderPhaseUpdate = false;
  var renderPhaseUpdates = null;
  var numberOfReRenders = 0;
  var RE_RENDER_LIMIT = 25;
  function resolveCurrentlyRenderingFiber() {
    !(currentlyRenderingFiber$1 !== null) ? invariant(false, "Hooks can only be called inside the body of a function component.") : void 0;
    return currentlyRenderingFiber$1;
  }
  function prepareToUseHooks(current2, workInProgress, nextRenderExpirationTime2) {
    if (!enableHooks) {
      return;
    }
    renderExpirationTime = nextRenderExpirationTime2;
    currentlyRenderingFiber$1 = workInProgress;
    firstCurrentHook = current2 !== null ? current2.memoizedState : null;
  }
  function finishHooks(Component, props, children, refOrContext) {
    if (!enableHooks) {
      return children;
    }
    while (didScheduleRenderPhaseUpdate) {
      didScheduleRenderPhaseUpdate = false;
      numberOfReRenders += 1;
      currentHook = null;
      workInProgressHook = null;
      componentUpdateQueue = null;
      children = Component(props, refOrContext);
    }
    renderPhaseUpdates = null;
    numberOfReRenders = 0;
    var renderedWork = currentlyRenderingFiber$1;
    renderedWork.memoizedState = firstWorkInProgressHook;
    renderedWork.expirationTime = remainingExpirationTime;
    renderedWork.updateQueue = componentUpdateQueue;
    var didRenderTooFewHooks = currentHook !== null && currentHook.next !== null;
    renderExpirationTime = NoWork;
    currentlyRenderingFiber$1 = null;
    firstCurrentHook = null;
    currentHook = null;
    firstWorkInProgressHook = null;
    workInProgressHook = null;
    remainingExpirationTime = NoWork;
    componentUpdateQueue = null;
    !!didRenderTooFewHooks ? invariant(false, "Rendered fewer hooks than expected. This may be caused by an accidental early return statement.") : void 0;
    return children;
  }
  function resetHooks() {
    if (!enableHooks) {
      return;
    }
    renderExpirationTime = NoWork;
    currentlyRenderingFiber$1 = null;
    firstCurrentHook = null;
    currentHook = null;
    firstWorkInProgressHook = null;
    workInProgressHook = null;
    remainingExpirationTime = NoWork;
    componentUpdateQueue = null;
    didScheduleRenderPhaseUpdate = false;
    renderPhaseUpdates = null;
    numberOfReRenders = 0;
  }
  function createHook() {
    return {
      memoizedState: null,
      baseState: null,
      queue: null,
      baseUpdate: null,
      next: null
    };
  }
  function cloneHook(hook) {
    return {
      memoizedState: hook.memoizedState,
      baseState: hook.memoizedState,
      queue: hook.queue,
      baseUpdate: hook.baseUpdate,
      next: null
    };
  }
  function createWorkInProgressHook() {
    if (workInProgressHook === null) {
      if (firstWorkInProgressHook === null) {
        isReRender = false;
        currentHook = firstCurrentHook;
        if (currentHook === null) {
          workInProgressHook = createHook();
        } else {
          workInProgressHook = cloneHook(currentHook);
        }
        firstWorkInProgressHook = workInProgressHook;
      } else {
        isReRender = true;
        currentHook = firstCurrentHook;
        workInProgressHook = firstWorkInProgressHook;
      }
    } else {
      if (workInProgressHook.next === null) {
        isReRender = false;
        var hook = void 0;
        if (currentHook === null) {
          hook = createHook();
        } else {
          currentHook = currentHook.next;
          if (currentHook === null) {
            hook = createHook();
          } else {
            hook = cloneHook(currentHook);
          }
        }
        workInProgressHook = workInProgressHook.next = hook;
      } else {
        isReRender = true;
        workInProgressHook = workInProgressHook.next;
        currentHook = currentHook !== null ? currentHook.next : null;
      }
    }
    return workInProgressHook;
  }
  function createFunctionComponentUpdateQueue() {
    return {
      lastEffect: null
    };
  }
  function basicStateReducer(state, action) {
    return typeof action === "function" ? action(state) : action;
  }
  function useContext(context, observedBits) {
    resolveCurrentlyRenderingFiber();
    return readContext(context, observedBits);
  }
  function useState(initialState) {
    return useReducer(
      basicStateReducer,
      // useReducer has a special case to support lazy useState initializers
      initialState
    );
  }
  function useReducer(reducer, initialState, initialAction) {
    currentlyRenderingFiber$1 = resolveCurrentlyRenderingFiber();
    workInProgressHook = createWorkInProgressHook();
    var queue = workInProgressHook.queue;
    if (queue !== null) {
      if (isReRender) {
        var _dispatch2 = queue.dispatch;
        if (renderPhaseUpdates !== null) {
          var firstRenderPhaseUpdate = renderPhaseUpdates.get(queue);
          if (firstRenderPhaseUpdate !== void 0) {
            renderPhaseUpdates.delete(queue);
            var newState = workInProgressHook.memoizedState;
            var update = firstRenderPhaseUpdate;
            do {
              var _action = update.action;
              newState = reducer(newState, _action);
              update = update.next;
            } while (update !== null);
            workInProgressHook.memoizedState = newState;
            if (workInProgressHook.baseUpdate === queue.last) {
              workInProgressHook.baseState = newState;
            }
            return [newState, _dispatch2];
          }
        }
        return [workInProgressHook.memoizedState, _dispatch2];
      }
      var _last = queue.last;
      var _baseUpdate = workInProgressHook.baseUpdate;
      var first = void 0;
      if (_baseUpdate !== null) {
        if (_last !== null) {
          _last.next = null;
        }
        first = _baseUpdate.next;
      } else {
        first = _last !== null ? _last.next : null;
      }
      if (first !== null) {
        var _newState = workInProgressHook.baseState;
        var newBaseState = null;
        var newBaseUpdate = null;
        var prevUpdate = _baseUpdate;
        var _update = first;
        var didSkip = false;
        do {
          var updateExpirationTime = _update.expirationTime;
          if (updateExpirationTime < renderExpirationTime) {
            if (!didSkip) {
              didSkip = true;
              newBaseUpdate = prevUpdate;
              newBaseState = _newState;
            }
            if (updateExpirationTime > remainingExpirationTime) {
              remainingExpirationTime = updateExpirationTime;
            }
          } else {
            var _action2 = _update.action;
            _newState = reducer(_newState, _action2);
          }
          prevUpdate = _update;
          _update = _update.next;
        } while (_update !== null && _update !== first);
        if (!didSkip) {
          newBaseUpdate = prevUpdate;
          newBaseState = _newState;
        }
        workInProgressHook.memoizedState = _newState;
        workInProgressHook.baseUpdate = newBaseUpdate;
        workInProgressHook.baseState = newBaseState;
      }
      var _dispatch = queue.dispatch;
      return [workInProgressHook.memoizedState, _dispatch];
    }
    if (reducer === basicStateReducer) {
      if (typeof initialState === "function") {
        initialState = initialState();
      }
    } else if (initialAction !== void 0 && initialAction !== null) {
      initialState = reducer(initialState, initialAction);
    }
    workInProgressHook.memoizedState = workInProgressHook.baseState = initialState;
    queue = workInProgressHook.queue = {
      last: null,
      dispatch: null
    };
    var dispatch = queue.dispatch = dispatchAction.bind(null, currentlyRenderingFiber$1, queue);
    return [workInProgressHook.memoizedState, dispatch];
  }
  function pushEffect(tag, create, destroy, inputs) {
    var effect = {
      tag,
      create,
      destroy,
      inputs,
      // Circular
      next: null
    };
    if (componentUpdateQueue === null) {
      componentUpdateQueue = createFunctionComponentUpdateQueue();
      componentUpdateQueue.lastEffect = effect.next = effect;
    } else {
      var _lastEffect = componentUpdateQueue.lastEffect;
      if (_lastEffect === null) {
        componentUpdateQueue.lastEffect = effect.next = effect;
      } else {
        var firstEffect = _lastEffect.next;
        _lastEffect.next = effect;
        effect.next = firstEffect;
        componentUpdateQueue.lastEffect = effect;
      }
    }
    return effect;
  }
  function useRef(initialValue) {
    currentlyRenderingFiber$1 = resolveCurrentlyRenderingFiber();
    workInProgressHook = createWorkInProgressHook();
    var ref = void 0;
    if (workInProgressHook.memoizedState === null) {
      ref = { current: initialValue };
      {
        Object.seal(ref);
      }
      workInProgressHook.memoizedState = ref;
    } else {
      ref = workInProgressHook.memoizedState;
    }
    return ref;
  }
  function useMutationEffect(create, inputs) {
    useEffectImpl(Snapshot | Update, UnmountSnapshot | MountMutation, create, inputs);
  }
  function useLayoutEffect(create, inputs) {
    useEffectImpl(Update, UnmountMutation | MountLayout, create, inputs);
  }
  function useEffect(create, inputs) {
    useEffectImpl(Update | Passive, UnmountPassive | MountPassive, create, inputs);
  }
  function useEffectImpl(fiberEffectTag, hookEffectTag, create, inputs) {
    currentlyRenderingFiber$1 = resolveCurrentlyRenderingFiber();
    workInProgressHook = createWorkInProgressHook();
    var nextInputs = inputs !== void 0 && inputs !== null ? inputs : [create];
    var destroy = null;
    if (currentHook !== null) {
      var prevEffect = currentHook.memoizedState;
      destroy = prevEffect.destroy;
      if (areHookInputsEqual(nextInputs, prevEffect.inputs)) {
        pushEffect(NoEffect$1, create, destroy, nextInputs);
        return;
      }
    }
    currentlyRenderingFiber$1.effectTag |= fiberEffectTag;
    workInProgressHook.memoizedState = pushEffect(hookEffectTag, create, destroy, nextInputs);
  }
  function useImperativeMethods(ref, create, inputs) {
    var nextInputs = inputs !== null && inputs !== void 0 ? inputs.concat([ref]) : [ref, create];
    useEffectImpl(Update, UnmountMutation | MountLayout, function() {
      if (typeof ref === "function") {
        var refCallback = ref;
        var _inst = create();
        refCallback(_inst);
        return function() {
          return refCallback(null);
        };
      } else if (ref !== null && ref !== void 0) {
        var refObject = ref;
        var _inst2 = create();
        refObject.current = _inst2;
        return function() {
          refObject.current = null;
        };
      }
    }, nextInputs);
  }
  function useCallback(callback, inputs) {
    currentlyRenderingFiber$1 = resolveCurrentlyRenderingFiber();
    workInProgressHook = createWorkInProgressHook();
    var nextInputs = inputs !== void 0 && inputs !== null ? inputs : [callback];
    var prevState = workInProgressHook.memoizedState;
    if (prevState !== null) {
      var prevInputs = prevState[1];
      if (areHookInputsEqual(nextInputs, prevInputs)) {
        return prevState[0];
      }
    }
    workInProgressHook.memoizedState = [callback, nextInputs];
    return callback;
  }
  function useMemo(nextCreate, inputs) {
    currentlyRenderingFiber$1 = resolveCurrentlyRenderingFiber();
    workInProgressHook = createWorkInProgressHook();
    var nextInputs = inputs !== void 0 && inputs !== null ? inputs : [nextCreate];
    var prevState = workInProgressHook.memoizedState;
    if (prevState !== null) {
      var prevInputs = prevState[1];
      if (areHookInputsEqual(nextInputs, prevInputs)) {
        return prevState[0];
      }
    }
    var nextValue = nextCreate();
    workInProgressHook.memoizedState = [nextValue, nextInputs];
    return nextValue;
  }
  function dispatchAction(fiber, queue, action) {
    !(numberOfReRenders < RE_RENDER_LIMIT) ? invariant(false, "Too many re-renders. React limits the number of renders to prevent an infinite loop.") : void 0;
    var alternate = fiber.alternate;
    if (fiber === currentlyRenderingFiber$1 || alternate !== null && alternate === currentlyRenderingFiber$1) {
      didScheduleRenderPhaseUpdate = true;
      var update = {
        expirationTime: renderExpirationTime,
        action,
        next: null
      };
      if (renderPhaseUpdates === null) {
        renderPhaseUpdates = /* @__PURE__ */ new Map();
      }
      var firstRenderPhaseUpdate = renderPhaseUpdates.get(queue);
      if (firstRenderPhaseUpdate === void 0) {
        renderPhaseUpdates.set(queue, update);
      } else {
        var lastRenderPhaseUpdate = firstRenderPhaseUpdate;
        while (lastRenderPhaseUpdate.next !== null) {
          lastRenderPhaseUpdate = lastRenderPhaseUpdate.next;
        }
        lastRenderPhaseUpdate.next = update;
      }
    } else {
      var currentTime = requestCurrentTime();
      var _expirationTime = computeExpirationForFiber(currentTime, fiber);
      var _update2 = {
        expirationTime: _expirationTime,
        action,
        next: null
      };
      flushPassiveEffects();
      var _last2 = queue.last;
      if (_last2 === null) {
        _update2.next = _update2;
      } else {
        var first = _last2.next;
        if (first !== null) {
          _update2.next = first;
        }
        _last2.next = _update2;
      }
      queue.last = _update2;
      scheduleWork(fiber, _expirationTime);
    }
  }
  var NO_CONTEXT = {};
  var contextStackCursor$1 = createCursor(NO_CONTEXT);
  var contextFiberStackCursor = createCursor(NO_CONTEXT);
  var rootInstanceStackCursor = createCursor(NO_CONTEXT);
  function requiredContext(c) {
    !(c !== NO_CONTEXT) ? invariant(false, "Expected host context to exist. This error is likely caused by a bug in React. Please file an issue.") : void 0;
    return c;
  }
  function getRootHostContainer() {
    var rootInstance = requiredContext(rootInstanceStackCursor.current);
    return rootInstance;
  }
  function pushHostContainer(fiber, nextRootInstance) {
    push(rootInstanceStackCursor, nextRootInstance, fiber);
    push(contextFiberStackCursor, fiber, fiber);
    push(contextStackCursor$1, NO_CONTEXT, fiber);
    var nextRootContext = getRootHostContext(nextRootInstance);
    pop(contextStackCursor$1, fiber);
    push(contextStackCursor$1, nextRootContext, fiber);
  }
  function popHostContainer(fiber) {
    pop(contextStackCursor$1, fiber);
    pop(contextFiberStackCursor, fiber);
    pop(rootInstanceStackCursor, fiber);
  }
  function getHostContext() {
    var context = requiredContext(contextStackCursor$1.current);
    return context;
  }
  function pushHostContext(fiber) {
    var rootInstance = requiredContext(rootInstanceStackCursor.current);
    var context = requiredContext(contextStackCursor$1.current);
    var nextContext = getChildHostContext(context, fiber.type, rootInstance);
    if (context === nextContext) {
      return;
    }
    push(contextFiberStackCursor, fiber, fiber);
    push(contextStackCursor$1, nextContext, fiber);
  }
  function popHostContext(fiber) {
    if (contextFiberStackCursor.current !== fiber) {
      return;
    }
    pop(contextStackCursor$1, fiber);
    pop(contextFiberStackCursor, fiber);
  }
  var commitTime = 0;
  var profilerStartTime = -1;
  function getCommitTime() {
    return commitTime;
  }
  function recordCommitTime() {
    if (!enableProfilerTimer) {
      return;
    }
    commitTime = unstable_now();
  }
  function startProfilerTimer(fiber) {
    if (!enableProfilerTimer) {
      return;
    }
    profilerStartTime = unstable_now();
    if (fiber.actualStartTime < 0) {
      fiber.actualStartTime = unstable_now();
    }
  }
  function stopProfilerTimerIfRunning(fiber) {
    if (!enableProfilerTimer) {
      return;
    }
    profilerStartTime = -1;
  }
  function stopProfilerTimerIfRunningAndRecordDelta(fiber, overrideBaseTime) {
    if (!enableProfilerTimer) {
      return;
    }
    if (profilerStartTime >= 0) {
      var elapsedTime = unstable_now() - profilerStartTime;
      fiber.actualDuration += elapsedTime;
      if (overrideBaseTime) {
        fiber.selfBaseDuration = elapsedTime;
      }
      profilerStartTime = -1;
    }
  }
  function resolveDefaultProps(Component, baseProps) {
    if (Component && Component.defaultProps) {
      var props = _assign({}, baseProps);
      var defaultProps = Component.defaultProps;
      for (var propName in defaultProps) {
        if (props[propName] === void 0) {
          props[propName] = defaultProps[propName];
        }
      }
      return props;
    }
    return baseProps;
  }
  function readLazyComponentType(lazyComponent) {
    var status = lazyComponent._status;
    var result = lazyComponent._result;
    switch (status) {
      case Resolved: {
        var Component = result;
        return Component;
      }
      case Rejected: {
        var error = result;
        throw error;
      }
      case Pending: {
        var thenable = result;
        throw thenable;
      }
      default: {
        lazyComponent._status = Pending;
        var ctor = lazyComponent._ctor;
        var _thenable = ctor();
        _thenable.then(function(moduleObject) {
          if (lazyComponent._status === Pending) {
            var defaultExport = moduleObject.default;
            {
              if (defaultExport === void 0) {
                warning$1(false, "lazy: Expected the result of a dynamic import() call. Instead received: %s\n\nYour code should look like: \n  const MyComponent = lazy(() => import('./MyComponent'))", moduleObject);
              }
            }
            lazyComponent._status = Resolved;
            lazyComponent._result = defaultExport;
          }
        }, function(error2) {
          if (lazyComponent._status === Pending) {
            lazyComponent._status = Rejected;
            lazyComponent._result = error2;
          }
        });
        lazyComponent._result = _thenable;
        throw _thenable;
      }
    }
  }
  var ReactCurrentOwner$4 = ReactSharedInternals.ReactCurrentOwner;
  function readContext$1(contextType) {
    var dispatcher = ReactCurrentOwner$4.currentDispatcher;
    return dispatcher.readContext(contextType);
  }
  var fakeInternalInstance = {};
  var isArray$1 = Array.isArray;
  var emptyRefsObject = new React2.Component().refs;
  var didWarnAboutStateAssignmentForComponent = void 0;
  var didWarnAboutUninitializedState = void 0;
  var didWarnAboutGetSnapshotBeforeUpdateWithoutDidUpdate = void 0;
  var didWarnAboutLegacyLifecyclesAndDerivedState = void 0;
  var didWarnAboutUndefinedDerivedState = void 0;
  var warnOnUndefinedDerivedState = void 0;
  var warnOnInvalidCallback$1 = void 0;
  var didWarnAboutDirectlyAssigningPropsToState = void 0;
  var didWarnAboutContextTypeAndContextTypes = void 0;
  var didWarnAboutInvalidateContextType = void 0;
  {
    didWarnAboutStateAssignmentForComponent = /* @__PURE__ */ new Set();
    didWarnAboutUninitializedState = /* @__PURE__ */ new Set();
    didWarnAboutGetSnapshotBeforeUpdateWithoutDidUpdate = /* @__PURE__ */ new Set();
    didWarnAboutLegacyLifecyclesAndDerivedState = /* @__PURE__ */ new Set();
    didWarnAboutDirectlyAssigningPropsToState = /* @__PURE__ */ new Set();
    didWarnAboutUndefinedDerivedState = /* @__PURE__ */ new Set();
    didWarnAboutContextTypeAndContextTypes = /* @__PURE__ */ new Set();
    didWarnAboutInvalidateContextType = /* @__PURE__ */ new Set();
    var didWarnOnInvalidCallback = /* @__PURE__ */ new Set();
    warnOnInvalidCallback$1 = function(callback, callerName) {
      if (callback === null || typeof callback === "function") {
        return;
      }
      var key = callerName + "_" + callback;
      if (!didWarnOnInvalidCallback.has(key)) {
        didWarnOnInvalidCallback.add(key);
        warningWithoutStack$1(false, "%s(...): Expected the last optional `callback` argument to be a function. Instead received: %s.", callerName, callback);
      }
    };
    warnOnUndefinedDerivedState = function(type, partialState) {
      if (partialState === void 0) {
        var componentName = getComponentName(type) || "Component";
        if (!didWarnAboutUndefinedDerivedState.has(componentName)) {
          didWarnAboutUndefinedDerivedState.add(componentName);
          warningWithoutStack$1(false, "%s.getDerivedStateFromProps(): A valid state object (or null) must be returned. You have returned undefined.", componentName);
        }
      }
    };
    Object.defineProperty(fakeInternalInstance, "_processChildContext", {
      enumerable: false,
      value: function() {
        invariant(false, "_processChildContext is not available in React 16+. This likely means you have multiple copies of React and are attempting to nest a React 15 tree inside a React 16 tree using unstable_renderSubtreeIntoContainer, which isn't supported. Try to make sure you have only one copy of React (and ideally, switch to ReactDOM.createPortal).");
      }
    });
    Object.freeze(fakeInternalInstance);
  }
  function applyDerivedStateFromProps(workInProgress, ctor, getDerivedStateFromProps, nextProps) {
    var prevState = workInProgress.memoizedState;
    {
      if (debugRenderPhaseSideEffects || debugRenderPhaseSideEffectsForStrictMode && workInProgress.mode & StrictMode) {
        getDerivedStateFromProps(nextProps, prevState);
      }
    }
    var partialState = getDerivedStateFromProps(nextProps, prevState);
    {
      warnOnUndefinedDerivedState(ctor, partialState);
    }
    var memoizedState = partialState === null || partialState === void 0 ? prevState : _assign({}, prevState, partialState);
    workInProgress.memoizedState = memoizedState;
    var updateQueue = workInProgress.updateQueue;
    if (updateQueue !== null && workInProgress.expirationTime === NoWork) {
      updateQueue.baseState = memoizedState;
    }
  }
  var classComponentUpdater = {
    isMounted,
    enqueueSetState: function(inst, payload, callback) {
      var fiber = get(inst);
      var currentTime = requestCurrentTime();
      var expirationTime = computeExpirationForFiber(currentTime, fiber);
      var update = createUpdate(expirationTime);
      update.payload = payload;
      if (callback !== void 0 && callback !== null) {
        {
          warnOnInvalidCallback$1(callback, "setState");
        }
        update.callback = callback;
      }
      flushPassiveEffects();
      enqueueUpdate(fiber, update);
      scheduleWork(fiber, expirationTime);
    },
    enqueueReplaceState: function(inst, payload, callback) {
      var fiber = get(inst);
      var currentTime = requestCurrentTime();
      var expirationTime = computeExpirationForFiber(currentTime, fiber);
      var update = createUpdate(expirationTime);
      update.tag = ReplaceState;
      update.payload = payload;
      if (callback !== void 0 && callback !== null) {
        {
          warnOnInvalidCallback$1(callback, "replaceState");
        }
        update.callback = callback;
      }
      flushPassiveEffects();
      enqueueUpdate(fiber, update);
      scheduleWork(fiber, expirationTime);
    },
    enqueueForceUpdate: function(inst, callback) {
      var fiber = get(inst);
      var currentTime = requestCurrentTime();
      var expirationTime = computeExpirationForFiber(currentTime, fiber);
      var update = createUpdate(expirationTime);
      update.tag = ForceUpdate;
      if (callback !== void 0 && callback !== null) {
        {
          warnOnInvalidCallback$1(callback, "forceUpdate");
        }
        update.callback = callback;
      }
      flushPassiveEffects();
      enqueueUpdate(fiber, update);
      scheduleWork(fiber, expirationTime);
    }
  };
  function checkShouldComponentUpdate(workInProgress, ctor, oldProps, newProps, oldState, newState, nextContext) {
    var instance = workInProgress.stateNode;
    if (typeof instance.shouldComponentUpdate === "function") {
      startPhaseTimer(workInProgress, "shouldComponentUpdate");
      var shouldUpdate = instance.shouldComponentUpdate(newProps, newState, nextContext);
      stopPhaseTimer();
      {
        !(shouldUpdate !== void 0) ? warningWithoutStack$1(false, "%s.shouldComponentUpdate(): Returned undefined instead of a boolean value. Make sure to return true or false.", getComponentName(ctor) || "Component") : void 0;
      }
      return shouldUpdate;
    }
    if (ctor.prototype && ctor.prototype.isPureReactComponent) {
      return !shallowEqual(oldProps, newProps) || !shallowEqual(oldState, newState);
    }
    return true;
  }
  function checkClassInstance(workInProgress, ctor, newProps) {
    var instance = workInProgress.stateNode;
    {
      var name = getComponentName(ctor) || "Component";
      var renderPresent = instance.render;
      if (!renderPresent) {
        if (ctor.prototype && typeof ctor.prototype.render === "function") {
          warningWithoutStack$1(false, "%s(...): No `render` method found on the returned component instance: did you accidentally return an object from the constructor?", name);
        } else {
          warningWithoutStack$1(false, "%s(...): No `render` method found on the returned component instance: you may have forgotten to define `render`.", name);
        }
      }
      var noGetInitialStateOnES6 = !instance.getInitialState || instance.getInitialState.isReactClassApproved || instance.state;
      !noGetInitialStateOnES6 ? warningWithoutStack$1(false, "getInitialState was defined on %s, a plain JavaScript class. This is only supported for classes created using React.createClass. Did you mean to define a state property instead?", name) : void 0;
      var noGetDefaultPropsOnES6 = !instance.getDefaultProps || instance.getDefaultProps.isReactClassApproved;
      !noGetDefaultPropsOnES6 ? warningWithoutStack$1(false, "getDefaultProps was defined on %s, a plain JavaScript class. This is only supported for classes created using React.createClass. Use a static property to define defaultProps instead.", name) : void 0;
      var noInstancePropTypes = !instance.propTypes;
      !noInstancePropTypes ? warningWithoutStack$1(false, "propTypes was defined as an instance property on %s. Use a static property to define propTypes instead.", name) : void 0;
      var noInstanceContextType = !instance.contextType;
      !noInstanceContextType ? warningWithoutStack$1(false, "contextType was defined as an instance property on %s. Use a static property to define contextType instead.", name) : void 0;
      var noInstanceContextTypes = !instance.contextTypes;
      !noInstanceContextTypes ? warningWithoutStack$1(false, "contextTypes was defined as an instance property on %s. Use a static property to define contextTypes instead.", name) : void 0;
      if (ctor.contextType && ctor.contextTypes && !didWarnAboutContextTypeAndContextTypes.has(ctor)) {
        didWarnAboutContextTypeAndContextTypes.add(ctor);
        warningWithoutStack$1(false, "%s declares both contextTypes and contextType static properties. The legacy contextTypes property will be ignored.", name);
      }
      var noComponentShouldUpdate = typeof instance.componentShouldUpdate !== "function";
      !noComponentShouldUpdate ? warningWithoutStack$1(false, "%s has a method called componentShouldUpdate(). Did you mean shouldComponentUpdate()? The name is phrased as a question because the function is expected to return a value.", name) : void 0;
      if (ctor.prototype && ctor.prototype.isPureReactComponent && typeof instance.shouldComponentUpdate !== "undefined") {
        warningWithoutStack$1(false, "%s has a method called shouldComponentUpdate(). shouldComponentUpdate should not be used when extending React.PureComponent. Please extend React.Component if shouldComponentUpdate is used.", getComponentName(ctor) || "A pure component");
      }
      var noComponentDidUnmount = typeof instance.componentDidUnmount !== "function";
      !noComponentDidUnmount ? warningWithoutStack$1(false, "%s has a method called componentDidUnmount(). But there is no such lifecycle method. Did you mean componentWillUnmount()?", name) : void 0;
      var noComponentDidReceiveProps = typeof instance.componentDidReceiveProps !== "function";
      !noComponentDidReceiveProps ? warningWithoutStack$1(false, "%s has a method called componentDidReceiveProps(). But there is no such lifecycle method. If you meant to update the state in response to changing props, use componentWillReceiveProps(). If you meant to fetch data or run side-effects or mutations after React has updated the UI, use componentDidUpdate().", name) : void 0;
      var noComponentWillRecieveProps = typeof instance.componentWillRecieveProps !== "function";
      !noComponentWillRecieveProps ? warningWithoutStack$1(false, "%s has a method called componentWillRecieveProps(). Did you mean componentWillReceiveProps()?", name) : void 0;
      var noUnsafeComponentWillRecieveProps = typeof instance.UNSAFE_componentWillRecieveProps !== "function";
      !noUnsafeComponentWillRecieveProps ? warningWithoutStack$1(false, "%s has a method called UNSAFE_componentWillRecieveProps(). Did you mean UNSAFE_componentWillReceiveProps()?", name) : void 0;
      var hasMutatedProps = instance.props !== newProps;
      !(instance.props === void 0 || !hasMutatedProps) ? warningWithoutStack$1(false, "%s(...): When calling super() in `%s`, make sure to pass up the same props that your component's constructor was passed.", name, name) : void 0;
      var noInstanceDefaultProps = !instance.defaultProps;
      !noInstanceDefaultProps ? warningWithoutStack$1(false, "Setting defaultProps as an instance property on %s is not supported and will be ignored. Instead, define defaultProps as a static property on %s.", name, name) : void 0;
      if (typeof instance.getSnapshotBeforeUpdate === "function" && typeof instance.componentDidUpdate !== "function" && !didWarnAboutGetSnapshotBeforeUpdateWithoutDidUpdate.has(ctor)) {
        didWarnAboutGetSnapshotBeforeUpdateWithoutDidUpdate.add(ctor);
        warningWithoutStack$1(false, "%s: getSnapshotBeforeUpdate() should be used with componentDidUpdate(). This component defines getSnapshotBeforeUpdate() only.", getComponentName(ctor));
      }
      var noInstanceGetDerivedStateFromProps = typeof instance.getDerivedStateFromProps !== "function";
      !noInstanceGetDerivedStateFromProps ? warningWithoutStack$1(false, "%s: getDerivedStateFromProps() is defined as an instance method and will be ignored. Instead, declare it as a static method.", name) : void 0;
      var noInstanceGetDerivedStateFromCatch = typeof instance.getDerivedStateFromError !== "function";
      !noInstanceGetDerivedStateFromCatch ? warningWithoutStack$1(false, "%s: getDerivedStateFromError() is defined as an instance method and will be ignored. Instead, declare it as a static method.", name) : void 0;
      var noStaticGetSnapshotBeforeUpdate = typeof ctor.getSnapshotBeforeUpdate !== "function";
      !noStaticGetSnapshotBeforeUpdate ? warningWithoutStack$1(false, "%s: getSnapshotBeforeUpdate() is defined as a static method and will be ignored. Instead, declare it as an instance method.", name) : void 0;
      var _state = instance.state;
      if (_state && (typeof _state !== "object" || isArray$1(_state))) {
        warningWithoutStack$1(false, "%s.state: must be set to an object or null", name);
      }
      if (typeof instance.getChildContext === "function") {
        !(typeof ctor.childContextTypes === "object") ? warningWithoutStack$1(false, "%s.getChildContext(): childContextTypes must be defined in order to use getChildContext().", name) : void 0;
      }
    }
  }
  function adoptClassInstance(workInProgress, instance) {
    instance.updater = classComponentUpdater;
    workInProgress.stateNode = instance;
    set(instance, workInProgress);
    {
      instance._reactInternalInstance = fakeInternalInstance;
    }
  }
  function constructClassInstance(workInProgress, ctor, props, renderExpirationTime2) {
    var isLegacyContextConsumer = false;
    var unmaskedContext = emptyContextObject;
    var context = null;
    var contextType = ctor.contextType;
    if (typeof contextType === "object" && contextType !== null) {
      {
        if (contextType.$$typeof !== REACT_CONTEXT_TYPE && !didWarnAboutInvalidateContextType.has(ctor)) {
          didWarnAboutInvalidateContextType.add(ctor);
          warningWithoutStack$1(false, "%s defines an invalid contextType. contextType should point to the Context object returned by React.createContext(). Did you accidentally pass the Context.Provider instead?", getComponentName(ctor) || "Component");
        }
      }
      context = readContext$1(contextType);
    } else {
      unmaskedContext = getUnmaskedContext(workInProgress, ctor, true);
      var contextTypes = ctor.contextTypes;
      isLegacyContextConsumer = contextTypes !== null && contextTypes !== void 0;
      context = isLegacyContextConsumer ? getMaskedContext(workInProgress, unmaskedContext) : emptyContextObject;
    }
    {
      if (debugRenderPhaseSideEffects || debugRenderPhaseSideEffectsForStrictMode && workInProgress.mode & StrictMode) {
        new ctor(props, context);
      }
    }
    var instance = new ctor(props, context);
    var state = workInProgress.memoizedState = instance.state !== null && instance.state !== void 0 ? instance.state : null;
    adoptClassInstance(workInProgress, instance);
    {
      if (typeof ctor.getDerivedStateFromProps === "function" && state === null) {
        var componentName = getComponentName(ctor) || "Component";
        if (!didWarnAboutUninitializedState.has(componentName)) {
          didWarnAboutUninitializedState.add(componentName);
          warningWithoutStack$1(false, "`%s` uses `getDerivedStateFromProps` but its initial state is %s. This is not recommended. Instead, define the initial state by assigning an object to `this.state` in the constructor of `%s`. This ensures that `getDerivedStateFromProps` arguments have a consistent shape.", componentName, instance.state === null ? "null" : "undefined", componentName);
        }
      }
      if (typeof ctor.getDerivedStateFromProps === "function" || typeof instance.getSnapshotBeforeUpdate === "function") {
        var foundWillMountName = null;
        var foundWillReceivePropsName = null;
        var foundWillUpdateName = null;
        if (typeof instance.componentWillMount === "function" && instance.componentWillMount.__suppressDeprecationWarning !== true) {
          foundWillMountName = "componentWillMount";
        } else if (typeof instance.UNSAFE_componentWillMount === "function") {
          foundWillMountName = "UNSAFE_componentWillMount";
        }
        if (typeof instance.componentWillReceiveProps === "function" && instance.componentWillReceiveProps.__suppressDeprecationWarning !== true) {
          foundWillReceivePropsName = "componentWillReceiveProps";
        } else if (typeof instance.UNSAFE_componentWillReceiveProps === "function") {
          foundWillReceivePropsName = "UNSAFE_componentWillReceiveProps";
        }
        if (typeof instance.componentWillUpdate === "function" && instance.componentWillUpdate.__suppressDeprecationWarning !== true) {
          foundWillUpdateName = "componentWillUpdate";
        } else if (typeof instance.UNSAFE_componentWillUpdate === "function") {
          foundWillUpdateName = "UNSAFE_componentWillUpdate";
        }
        if (foundWillMountName !== null || foundWillReceivePropsName !== null || foundWillUpdateName !== null) {
          var _componentName = getComponentName(ctor) || "Component";
          var newApiName = typeof ctor.getDerivedStateFromProps === "function" ? "getDerivedStateFromProps()" : "getSnapshotBeforeUpdate()";
          if (!didWarnAboutLegacyLifecyclesAndDerivedState.has(_componentName)) {
            didWarnAboutLegacyLifecyclesAndDerivedState.add(_componentName);
            warningWithoutStack$1(false, "Unsafe legacy lifecycles will not be called for components using new component APIs.\n\n%s uses %s but also contains the following legacy lifecycles:%s%s%s\n\nThe above lifecycles should be removed. Learn more about this warning here:\nhttps://fb.me/react-async-component-lifecycle-hooks", _componentName, newApiName, foundWillMountName !== null ? "\n  " + foundWillMountName : "", foundWillReceivePropsName !== null ? "\n  " + foundWillReceivePropsName : "", foundWillUpdateName !== null ? "\n  " + foundWillUpdateName : "");
          }
        }
      }
    }
    if (isLegacyContextConsumer) {
      cacheContext(workInProgress, unmaskedContext, context);
    }
    return instance;
  }
  function callComponentWillMount(workInProgress, instance) {
    startPhaseTimer(workInProgress, "componentWillMount");
    var oldState = instance.state;
    if (typeof instance.componentWillMount === "function") {
      instance.componentWillMount();
    }
    if (typeof instance.UNSAFE_componentWillMount === "function") {
      instance.UNSAFE_componentWillMount();
    }
    stopPhaseTimer();
    if (oldState !== instance.state) {
      {
        warningWithoutStack$1(false, "%s.componentWillMount(): Assigning directly to this.state is deprecated (except inside a component's constructor). Use setState instead.", getComponentName(workInProgress.type) || "Component");
      }
      classComponentUpdater.enqueueReplaceState(instance, instance.state, null);
    }
  }
  function callComponentWillReceiveProps(workInProgress, instance, newProps, nextContext) {
    var oldState = instance.state;
    startPhaseTimer(workInProgress, "componentWillReceiveProps");
    if (typeof instance.componentWillReceiveProps === "function") {
      instance.componentWillReceiveProps(newProps, nextContext);
    }
    if (typeof instance.UNSAFE_componentWillReceiveProps === "function") {
      instance.UNSAFE_componentWillReceiveProps(newProps, nextContext);
    }
    stopPhaseTimer();
    if (instance.state !== oldState) {
      {
        var componentName = getComponentName(workInProgress.type) || "Component";
        if (!didWarnAboutStateAssignmentForComponent.has(componentName)) {
          didWarnAboutStateAssignmentForComponent.add(componentName);
          warningWithoutStack$1(false, "%s.componentWillReceiveProps(): Assigning directly to this.state is deprecated (except inside a component's constructor). Use setState instead.", componentName);
        }
      }
      classComponentUpdater.enqueueReplaceState(instance, instance.state, null);
    }
  }
  function mountClassInstance(workInProgress, ctor, newProps, renderExpirationTime2) {
    {
      checkClassInstance(workInProgress, ctor, newProps);
    }
    var instance = workInProgress.stateNode;
    instance.props = newProps;
    instance.state = workInProgress.memoizedState;
    instance.refs = emptyRefsObject;
    var contextType = ctor.contextType;
    if (typeof contextType === "object" && contextType !== null) {
      instance.context = readContext$1(contextType);
    } else {
      var unmaskedContext = getUnmaskedContext(workInProgress, ctor, true);
      instance.context = getMaskedContext(workInProgress, unmaskedContext);
    }
    {
      if (instance.state === newProps) {
        var componentName = getComponentName(ctor) || "Component";
        if (!didWarnAboutDirectlyAssigningPropsToState.has(componentName)) {
          didWarnAboutDirectlyAssigningPropsToState.add(componentName);
          warningWithoutStack$1(false, "%s: It is not recommended to assign props directly to state because updates to props won't be reflected in state. In most cases, it is better to use props directly.", componentName);
        }
      }
      if (workInProgress.mode & StrictMode) {
        ReactStrictModeWarnings.recordUnsafeLifecycleWarnings(workInProgress, instance);
        ReactStrictModeWarnings.recordLegacyContextWarning(workInProgress, instance);
      }
      if (warnAboutDeprecatedLifecycles) {
        ReactStrictModeWarnings.recordDeprecationWarnings(workInProgress, instance);
      }
    }
    var updateQueue = workInProgress.updateQueue;
    if (updateQueue !== null) {
      processUpdateQueue(workInProgress, updateQueue, newProps, instance, renderExpirationTime2);
      instance.state = workInProgress.memoizedState;
    }
    var getDerivedStateFromProps = ctor.getDerivedStateFromProps;
    if (typeof getDerivedStateFromProps === "function") {
      applyDerivedStateFromProps(workInProgress, ctor, getDerivedStateFromProps, newProps);
      instance.state = workInProgress.memoizedState;
    }
    if (typeof ctor.getDerivedStateFromProps !== "function" && typeof instance.getSnapshotBeforeUpdate !== "function" && (typeof instance.UNSAFE_componentWillMount === "function" || typeof instance.componentWillMount === "function")) {
      callComponentWillMount(workInProgress, instance);
      updateQueue = workInProgress.updateQueue;
      if (updateQueue !== null) {
        processUpdateQueue(workInProgress, updateQueue, newProps, instance, renderExpirationTime2);
        instance.state = workInProgress.memoizedState;
      }
    }
    if (typeof instance.componentDidMount === "function") {
      workInProgress.effectTag |= Update;
    }
  }
  function resumeMountClassInstance(workInProgress, ctor, newProps, renderExpirationTime2) {
    var instance = workInProgress.stateNode;
    var oldProps = workInProgress.memoizedProps;
    instance.props = oldProps;
    var oldContext = instance.context;
    var contextType = ctor.contextType;
    var nextContext = void 0;
    if (typeof contextType === "object" && contextType !== null) {
      nextContext = readContext$1(contextType);
    } else {
      var nextLegacyUnmaskedContext = getUnmaskedContext(workInProgress, ctor, true);
      nextContext = getMaskedContext(workInProgress, nextLegacyUnmaskedContext);
    }
    var getDerivedStateFromProps = ctor.getDerivedStateFromProps;
    var hasNewLifecycles = typeof getDerivedStateFromProps === "function" || typeof instance.getSnapshotBeforeUpdate === "function";
    if (!hasNewLifecycles && (typeof instance.UNSAFE_componentWillReceiveProps === "function" || typeof instance.componentWillReceiveProps === "function")) {
      if (oldProps !== newProps || oldContext !== nextContext) {
        callComponentWillReceiveProps(workInProgress, instance, newProps, nextContext);
      }
    }
    resetHasForceUpdateBeforeProcessing();
    var oldState = workInProgress.memoizedState;
    var newState = instance.state = oldState;
    var updateQueue = workInProgress.updateQueue;
    if (updateQueue !== null) {
      processUpdateQueue(workInProgress, updateQueue, newProps, instance, renderExpirationTime2);
      newState = workInProgress.memoizedState;
    }
    if (oldProps === newProps && oldState === newState && !hasContextChanged() && !checkHasForceUpdateAfterProcessing()) {
      if (typeof instance.componentDidMount === "function") {
        workInProgress.effectTag |= Update;
      }
      return false;
    }
    if (typeof getDerivedStateFromProps === "function") {
      applyDerivedStateFromProps(workInProgress, ctor, getDerivedStateFromProps, newProps);
      newState = workInProgress.memoizedState;
    }
    var shouldUpdate = checkHasForceUpdateAfterProcessing() || checkShouldComponentUpdate(workInProgress, ctor, oldProps, newProps, oldState, newState, nextContext);
    if (shouldUpdate) {
      if (!hasNewLifecycles && (typeof instance.UNSAFE_componentWillMount === "function" || typeof instance.componentWillMount === "function")) {
        startPhaseTimer(workInProgress, "componentWillMount");
        if (typeof instance.componentWillMount === "function") {
          instance.componentWillMount();
        }
        if (typeof instance.UNSAFE_componentWillMount === "function") {
          instance.UNSAFE_componentWillMount();
        }
        stopPhaseTimer();
      }
      if (typeof instance.componentDidMount === "function") {
        workInProgress.effectTag |= Update;
      }
    } else {
      if (typeof instance.componentDidMount === "function") {
        workInProgress.effectTag |= Update;
      }
      workInProgress.memoizedProps = newProps;
      workInProgress.memoizedState = newState;
    }
    instance.props = newProps;
    instance.state = newState;
    instance.context = nextContext;
    return shouldUpdate;
  }
  function updateClassInstance(current2, workInProgress, ctor, newProps, renderExpirationTime2) {
    var instance = workInProgress.stateNode;
    var oldProps = workInProgress.memoizedProps;
    instance.props = workInProgress.type === workInProgress.elementType ? oldProps : resolveDefaultProps(workInProgress.type, oldProps);
    var oldContext = instance.context;
    var contextType = ctor.contextType;
    var nextContext = void 0;
    if (typeof contextType === "object" && contextType !== null) {
      nextContext = readContext$1(contextType);
    } else {
      var nextUnmaskedContext = getUnmaskedContext(workInProgress, ctor, true);
      nextContext = getMaskedContext(workInProgress, nextUnmaskedContext);
    }
    var getDerivedStateFromProps = ctor.getDerivedStateFromProps;
    var hasNewLifecycles = typeof getDerivedStateFromProps === "function" || typeof instance.getSnapshotBeforeUpdate === "function";
    if (!hasNewLifecycles && (typeof instance.UNSAFE_componentWillReceiveProps === "function" || typeof instance.componentWillReceiveProps === "function")) {
      if (oldProps !== newProps || oldContext !== nextContext) {
        callComponentWillReceiveProps(workInProgress, instance, newProps, nextContext);
      }
    }
    resetHasForceUpdateBeforeProcessing();
    var oldState = workInProgress.memoizedState;
    var newState = instance.state = oldState;
    var updateQueue = workInProgress.updateQueue;
    if (updateQueue !== null) {
      processUpdateQueue(workInProgress, updateQueue, newProps, instance, renderExpirationTime2);
      newState = workInProgress.memoizedState;
    }
    if (oldProps === newProps && oldState === newState && !hasContextChanged() && !checkHasForceUpdateAfterProcessing()) {
      if (typeof instance.componentDidUpdate === "function") {
        if (oldProps !== current2.memoizedProps || oldState !== current2.memoizedState) {
          workInProgress.effectTag |= Update;
        }
      }
      if (typeof instance.getSnapshotBeforeUpdate === "function") {
        if (oldProps !== current2.memoizedProps || oldState !== current2.memoizedState) {
          workInProgress.effectTag |= Snapshot;
        }
      }
      return false;
    }
    if (typeof getDerivedStateFromProps === "function") {
      applyDerivedStateFromProps(workInProgress, ctor, getDerivedStateFromProps, newProps);
      newState = workInProgress.memoizedState;
    }
    var shouldUpdate = checkHasForceUpdateAfterProcessing() || checkShouldComponentUpdate(workInProgress, ctor, oldProps, newProps, oldState, newState, nextContext);
    if (shouldUpdate) {
      if (!hasNewLifecycles && (typeof instance.UNSAFE_componentWillUpdate === "function" || typeof instance.componentWillUpdate === "function")) {
        startPhaseTimer(workInProgress, "componentWillUpdate");
        if (typeof instance.componentWillUpdate === "function") {
          instance.componentWillUpdate(newProps, newState, nextContext);
        }
        if (typeof instance.UNSAFE_componentWillUpdate === "function") {
          instance.UNSAFE_componentWillUpdate(newProps, newState, nextContext);
        }
        stopPhaseTimer();
      }
      if (typeof instance.componentDidUpdate === "function") {
        workInProgress.effectTag |= Update;
      }
      if (typeof instance.getSnapshotBeforeUpdate === "function") {
        workInProgress.effectTag |= Snapshot;
      }
    } else {
      if (typeof instance.componentDidUpdate === "function") {
        if (oldProps !== current2.memoizedProps || oldState !== current2.memoizedState) {
          workInProgress.effectTag |= Update;
        }
      }
      if (typeof instance.getSnapshotBeforeUpdate === "function") {
        if (oldProps !== current2.memoizedProps || oldState !== current2.memoizedState) {
          workInProgress.effectTag |= Snapshot;
        }
      }
      workInProgress.memoizedProps = newProps;
      workInProgress.memoizedState = newState;
    }
    instance.props = newProps;
    instance.state = newState;
    instance.context = nextContext;
    return shouldUpdate;
  }
  var didWarnAboutMaps = void 0;
  var didWarnAboutGenerators = void 0;
  var didWarnAboutStringRefInStrictMode = void 0;
  var ownerHasKeyUseWarning = void 0;
  var ownerHasFunctionTypeWarning = void 0;
  var warnForMissingKey = function(child) {
  };
  {
    didWarnAboutMaps = false;
    didWarnAboutGenerators = false;
    didWarnAboutStringRefInStrictMode = {};
    ownerHasKeyUseWarning = {};
    ownerHasFunctionTypeWarning = {};
    warnForMissingKey = function(child) {
      if (child === null || typeof child !== "object") {
        return;
      }
      if (!child._store || child._store.validated || child.key != null) {
        return;
      }
      !(typeof child._store === "object") ? invariant(false, "React Component in warnForMissingKey should have a _store. This error is likely caused by a bug in React. Please file an issue.") : void 0;
      child._store.validated = true;
      var currentComponentErrorInfo = 'Each child in an array or iterator should have a unique "key" prop. See https://fb.me/react-warning-keys for more information.' + getCurrentFiberStackInDev();
      if (ownerHasKeyUseWarning[currentComponentErrorInfo]) {
        return;
      }
      ownerHasKeyUseWarning[currentComponentErrorInfo] = true;
      warning$1(false, 'Each child in an array or iterator should have a unique "key" prop. See https://fb.me/react-warning-keys for more information.');
    };
  }
  var isArray = Array.isArray;
  function coerceRef(returnFiber, current$$1, element) {
    var mixedRef = element.ref;
    if (mixedRef !== null && typeof mixedRef !== "function" && typeof mixedRef !== "object") {
      {
        if (returnFiber.mode & StrictMode) {
          var componentName = getComponentName(returnFiber.type) || "Component";
          if (!didWarnAboutStringRefInStrictMode[componentName]) {
            warningWithoutStack$1(false, 'A string ref, "%s", has been found within a strict mode tree. String refs are a source of potential bugs and should be avoided. We recommend using createRef() instead.\n%s\n\nLearn more about using refs safely here:\nhttps://fb.me/react-strict-mode-string-ref', mixedRef, getStackByFiberInDevAndProd(returnFiber));
            didWarnAboutStringRefInStrictMode[componentName] = true;
          }
        }
      }
      if (element._owner) {
        var owner = element._owner;
        var inst = void 0;
        if (owner) {
          var ownerFiber = owner;
          !(ownerFiber.tag === ClassComponent) ? invariant(false, "Function components cannot have refs.") : void 0;
          inst = ownerFiber.stateNode;
        }
        !inst ? invariant(false, "Missing owner for string ref %s. This error is likely caused by a bug in React. Please file an issue.", mixedRef) : void 0;
        var stringRef = "" + mixedRef;
        if (current$$1 !== null && current$$1.ref !== null && typeof current$$1.ref === "function" && current$$1.ref._stringRef === stringRef) {
          return current$$1.ref;
        }
        var ref = function(value) {
          var refs = inst.refs;
          if (refs === emptyRefsObject) {
            refs = inst.refs = {};
          }
          if (value === null) {
            delete refs[stringRef];
          } else {
            refs[stringRef] = value;
          }
        };
        ref._stringRef = stringRef;
        return ref;
      } else {
        !(typeof mixedRef === "string") ? invariant(false, "Expected ref to be a function, a string, an object returned by React.createRef(), or null.") : void 0;
        !element._owner ? invariant(false, "Element ref was specified as a string (%s) but no owner was set. This could happen for one of the following reasons:\n1. You may be adding a ref to a function component\n2. You may be adding a ref to a component that was not created inside a component's render method\n3. You have multiple copies of React loaded\nSee https://fb.me/react-refs-must-have-owner for more information.", mixedRef) : void 0;
      }
    }
    return mixedRef;
  }
  function throwOnInvalidObjectType(returnFiber, newChild) {
    if (returnFiber.type !== "textarea") {
      var addendum = "";
      {
        addendum = " If you meant to render a collection of children, use an array instead." + getCurrentFiberStackInDev();
      }
      invariant(false, "Objects are not valid as a React child (found: %s).%s", Object.prototype.toString.call(newChild) === "[object Object]" ? "object with keys {" + Object.keys(newChild).join(", ") + "}" : newChild, addendum);
    }
  }
  function warnOnFunctionType() {
    var currentComponentErrorInfo = "Functions are not valid as a React child. This may happen if you return a Component instead of <Component /> from render. Or maybe you meant to call this function rather than return it." + getCurrentFiberStackInDev();
    if (ownerHasFunctionTypeWarning[currentComponentErrorInfo]) {
      return;
    }
    ownerHasFunctionTypeWarning[currentComponentErrorInfo] = true;
    warning$1(false, "Functions are not valid as a React child. This may happen if you return a Component instead of <Component /> from render. Or maybe you meant to call this function rather than return it.");
  }
  function ChildReconciler(shouldTrackSideEffects) {
    function deleteChild(returnFiber, childToDelete) {
      if (!shouldTrackSideEffects) {
        return;
      }
      var last = returnFiber.lastEffect;
      if (last !== null) {
        last.nextEffect = childToDelete;
        returnFiber.lastEffect = childToDelete;
      } else {
        returnFiber.firstEffect = returnFiber.lastEffect = childToDelete;
      }
      childToDelete.nextEffect = null;
      childToDelete.effectTag = Deletion;
    }
    function deleteRemainingChildren(returnFiber, currentFirstChild) {
      if (!shouldTrackSideEffects) {
        return null;
      }
      var childToDelete = currentFirstChild;
      while (childToDelete !== null) {
        deleteChild(returnFiber, childToDelete);
        childToDelete = childToDelete.sibling;
      }
      return null;
    }
    function mapRemainingChildren(returnFiber, currentFirstChild) {
      var existingChildren = /* @__PURE__ */ new Map();
      var existingChild = currentFirstChild;
      while (existingChild !== null) {
        if (existingChild.key !== null) {
          existingChildren.set(existingChild.key, existingChild);
        } else {
          existingChildren.set(existingChild.index, existingChild);
        }
        existingChild = existingChild.sibling;
      }
      return existingChildren;
    }
    function useFiber(fiber, pendingProps, expirationTime) {
      var clone = createWorkInProgress(fiber, pendingProps, expirationTime);
      clone.index = 0;
      clone.sibling = null;
      return clone;
    }
    function placeChild(newFiber, lastPlacedIndex, newIndex) {
      newFiber.index = newIndex;
      if (!shouldTrackSideEffects) {
        return lastPlacedIndex;
      }
      var current$$1 = newFiber.alternate;
      if (current$$1 !== null) {
        var oldIndex = current$$1.index;
        if (oldIndex < lastPlacedIndex) {
          newFiber.effectTag = Placement;
          return lastPlacedIndex;
        } else {
          return oldIndex;
        }
      } else {
        newFiber.effectTag = Placement;
        return lastPlacedIndex;
      }
    }
    function placeSingleChild(newFiber) {
      if (shouldTrackSideEffects && newFiber.alternate === null) {
        newFiber.effectTag = Placement;
      }
      return newFiber;
    }
    function updateTextNode(returnFiber, current$$1, textContent, expirationTime) {
      if (current$$1 === null || current$$1.tag !== HostText) {
        var created = createFiberFromText(textContent, returnFiber.mode, expirationTime);
        created.return = returnFiber;
        return created;
      } else {
        var existing = useFiber(current$$1, textContent, expirationTime);
        existing.return = returnFiber;
        return existing;
      }
    }
    function updateElement(returnFiber, current$$1, element, expirationTime) {
      if (current$$1 !== null && current$$1.elementType === element.type) {
        var existing = useFiber(current$$1, element.props, expirationTime);
        existing.ref = coerceRef(returnFiber, current$$1, element);
        existing.return = returnFiber;
        {
          existing._debugSource = element._source;
          existing._debugOwner = element._owner;
        }
        return existing;
      } else {
        var created = createFiberFromElement(element, returnFiber.mode, expirationTime);
        created.ref = coerceRef(returnFiber, current$$1, element);
        created.return = returnFiber;
        return created;
      }
    }
    function updatePortal(returnFiber, current$$1, portal, expirationTime) {
      if (current$$1 === null || current$$1.tag !== HostPortal || current$$1.stateNode.containerInfo !== portal.containerInfo || current$$1.stateNode.implementation !== portal.implementation) {
        var created = createFiberFromPortal(portal, returnFiber.mode, expirationTime);
        created.return = returnFiber;
        return created;
      } else {
        var existing = useFiber(current$$1, portal.children || [], expirationTime);
        existing.return = returnFiber;
        return existing;
      }
    }
    function updateFragment2(returnFiber, current$$1, fragment, expirationTime, key) {
      if (current$$1 === null || current$$1.tag !== Fragment) {
        var created = createFiberFromFragment(fragment, returnFiber.mode, expirationTime, key);
        created.return = returnFiber;
        return created;
      } else {
        var existing = useFiber(current$$1, fragment, expirationTime);
        existing.return = returnFiber;
        return existing;
      }
    }
    function createChild(returnFiber, newChild, expirationTime) {
      if (typeof newChild === "string" || typeof newChild === "number") {
        var created = createFiberFromText("" + newChild, returnFiber.mode, expirationTime);
        created.return = returnFiber;
        return created;
      }
      if (typeof newChild === "object" && newChild !== null) {
        switch (newChild.$$typeof) {
          case REACT_ELEMENT_TYPE: {
            var _created = createFiberFromElement(newChild, returnFiber.mode, expirationTime);
            _created.ref = coerceRef(returnFiber, null, newChild);
            _created.return = returnFiber;
            return _created;
          }
          case REACT_PORTAL_TYPE: {
            var _created2 = createFiberFromPortal(newChild, returnFiber.mode, expirationTime);
            _created2.return = returnFiber;
            return _created2;
          }
        }
        if (isArray(newChild) || getIteratorFn(newChild)) {
          var _created3 = createFiberFromFragment(newChild, returnFiber.mode, expirationTime, null);
          _created3.return = returnFiber;
          return _created3;
        }
        throwOnInvalidObjectType(returnFiber, newChild);
      }
      {
        if (typeof newChild === "function") {
          warnOnFunctionType();
        }
      }
      return null;
    }
    function updateSlot(returnFiber, oldFiber, newChild, expirationTime) {
      var key = oldFiber !== null ? oldFiber.key : null;
      if (typeof newChild === "string" || typeof newChild === "number") {
        if (key !== null) {
          return null;
        }
        return updateTextNode(returnFiber, oldFiber, "" + newChild, expirationTime);
      }
      if (typeof newChild === "object" && newChild !== null) {
        switch (newChild.$$typeof) {
          case REACT_ELEMENT_TYPE: {
            if (newChild.key === key) {
              if (newChild.type === REACT_FRAGMENT_TYPE) {
                return updateFragment2(returnFiber, oldFiber, newChild.props.children, expirationTime, key);
              }
              return updateElement(returnFiber, oldFiber, newChild, expirationTime);
            } else {
              return null;
            }
          }
          case REACT_PORTAL_TYPE: {
            if (newChild.key === key) {
              return updatePortal(returnFiber, oldFiber, newChild, expirationTime);
            } else {
              return null;
            }
          }
        }
        if (isArray(newChild) || getIteratorFn(newChild)) {
          if (key !== null) {
            return null;
          }
          return updateFragment2(returnFiber, oldFiber, newChild, expirationTime, null);
        }
        throwOnInvalidObjectType(returnFiber, newChild);
      }
      {
        if (typeof newChild === "function") {
          warnOnFunctionType();
        }
      }
      return null;
    }
    function updateFromMap(existingChildren, returnFiber, newIdx, newChild, expirationTime) {
      if (typeof newChild === "string" || typeof newChild === "number") {
        var matchedFiber = existingChildren.get(newIdx) || null;
        return updateTextNode(returnFiber, matchedFiber, "" + newChild, expirationTime);
      }
      if (typeof newChild === "object" && newChild !== null) {
        switch (newChild.$$typeof) {
          case REACT_ELEMENT_TYPE: {
            var _matchedFiber = existingChildren.get(newChild.key === null ? newIdx : newChild.key) || null;
            if (newChild.type === REACT_FRAGMENT_TYPE) {
              return updateFragment2(returnFiber, _matchedFiber, newChild.props.children, expirationTime, newChild.key);
            }
            return updateElement(returnFiber, _matchedFiber, newChild, expirationTime);
          }
          case REACT_PORTAL_TYPE: {
            var _matchedFiber2 = existingChildren.get(newChild.key === null ? newIdx : newChild.key) || null;
            return updatePortal(returnFiber, _matchedFiber2, newChild, expirationTime);
          }
        }
        if (isArray(newChild) || getIteratorFn(newChild)) {
          var _matchedFiber3 = existingChildren.get(newIdx) || null;
          return updateFragment2(returnFiber, _matchedFiber3, newChild, expirationTime, null);
        }
        throwOnInvalidObjectType(returnFiber, newChild);
      }
      {
        if (typeof newChild === "function") {
          warnOnFunctionType();
        }
      }
      return null;
    }
    function warnOnInvalidKey(child, knownKeys) {
      {
        if (typeof child !== "object" || child === null) {
          return knownKeys;
        }
        switch (child.$$typeof) {
          case REACT_ELEMENT_TYPE:
          case REACT_PORTAL_TYPE:
            warnForMissingKey(child);
            var key = child.key;
            if (typeof key !== "string") {
              break;
            }
            if (knownKeys === null) {
              knownKeys = /* @__PURE__ */ new Set();
              knownKeys.add(key);
              break;
            }
            if (!knownKeys.has(key)) {
              knownKeys.add(key);
              break;
            }
            warning$1(false, "Encountered two children with the same key, `%s`. Keys should be unique so that components maintain their identity across updates. Non-unique keys may cause children to be duplicated and/or omitted \u2014 the behavior is unsupported and could change in a future version.", key);
            break;
          default:
            break;
        }
      }
      return knownKeys;
    }
    function reconcileChildrenArray(returnFiber, currentFirstChild, newChildren, expirationTime) {
      {
        var knownKeys = null;
        for (var i = 0; i < newChildren.length; i++) {
          var child = newChildren[i];
          knownKeys = warnOnInvalidKey(child, knownKeys);
        }
      }
      var resultingFirstChild = null;
      var previousNewFiber = null;
      var oldFiber = currentFirstChild;
      var lastPlacedIndex = 0;
      var newIdx = 0;
      var nextOldFiber = null;
      for (; oldFiber !== null && newIdx < newChildren.length; newIdx++) {
        if (oldFiber.index > newIdx) {
          nextOldFiber = oldFiber;
          oldFiber = null;
        } else {
          nextOldFiber = oldFiber.sibling;
        }
        var newFiber = updateSlot(returnFiber, oldFiber, newChildren[newIdx], expirationTime);
        if (newFiber === null) {
          if (oldFiber === null) {
            oldFiber = nextOldFiber;
          }
          break;
        }
        if (shouldTrackSideEffects) {
          if (oldFiber && newFiber.alternate === null) {
            deleteChild(returnFiber, oldFiber);
          }
        }
        lastPlacedIndex = placeChild(newFiber, lastPlacedIndex, newIdx);
        if (previousNewFiber === null) {
          resultingFirstChild = newFiber;
        } else {
          previousNewFiber.sibling = newFiber;
        }
        previousNewFiber = newFiber;
        oldFiber = nextOldFiber;
      }
      if (newIdx === newChildren.length) {
        deleteRemainingChildren(returnFiber, oldFiber);
        return resultingFirstChild;
      }
      if (oldFiber === null) {
        for (; newIdx < newChildren.length; newIdx++) {
          var _newFiber = createChild(returnFiber, newChildren[newIdx], expirationTime);
          if (!_newFiber) {
            continue;
          }
          lastPlacedIndex = placeChild(_newFiber, lastPlacedIndex, newIdx);
          if (previousNewFiber === null) {
            resultingFirstChild = _newFiber;
          } else {
            previousNewFiber.sibling = _newFiber;
          }
          previousNewFiber = _newFiber;
        }
        return resultingFirstChild;
      }
      var existingChildren = mapRemainingChildren(returnFiber, oldFiber);
      for (; newIdx < newChildren.length; newIdx++) {
        var _newFiber2 = updateFromMap(existingChildren, returnFiber, newIdx, newChildren[newIdx], expirationTime);
        if (_newFiber2) {
          if (shouldTrackSideEffects) {
            if (_newFiber2.alternate !== null) {
              existingChildren.delete(_newFiber2.key === null ? newIdx : _newFiber2.key);
            }
          }
          lastPlacedIndex = placeChild(_newFiber2, lastPlacedIndex, newIdx);
          if (previousNewFiber === null) {
            resultingFirstChild = _newFiber2;
          } else {
            previousNewFiber.sibling = _newFiber2;
          }
          previousNewFiber = _newFiber2;
        }
      }
      if (shouldTrackSideEffects) {
        existingChildren.forEach(function(child2) {
          return deleteChild(returnFiber, child2);
        });
      }
      return resultingFirstChild;
    }
    function reconcileChildrenIterator(returnFiber, currentFirstChild, newChildrenIterable, expirationTime) {
      var iteratorFn = getIteratorFn(newChildrenIterable);
      !(typeof iteratorFn === "function") ? invariant(false, "An object is not an iterable. This error is likely caused by a bug in React. Please file an issue.") : void 0;
      {
        if (typeof Symbol === "function" && // $FlowFixMe Flow doesn't know about toStringTag
        newChildrenIterable[Symbol.toStringTag] === "Generator") {
          !didWarnAboutGenerators ? warning$1(false, "Using Generators as children is unsupported and will likely yield unexpected results because enumerating a generator mutates it. You may convert it to an array with `Array.from()` or the `[...spread]` operator before rendering. Keep in mind you might need to polyfill these features for older browsers.") : void 0;
          didWarnAboutGenerators = true;
        }
        if (newChildrenIterable.entries === iteratorFn) {
          !didWarnAboutMaps ? warning$1(false, "Using Maps as children is unsupported and will likely yield unexpected results. Convert it to a sequence/iterable of keyed ReactElements instead.") : void 0;
          didWarnAboutMaps = true;
        }
        var _newChildren = iteratorFn.call(newChildrenIterable);
        if (_newChildren) {
          var knownKeys = null;
          var _step = _newChildren.next();
          for (; !_step.done; _step = _newChildren.next()) {
            var child = _step.value;
            knownKeys = warnOnInvalidKey(child, knownKeys);
          }
        }
      }
      var newChildren = iteratorFn.call(newChildrenIterable);
      !(newChildren != null) ? invariant(false, "An iterable object provided no iterator.") : void 0;
      var resultingFirstChild = null;
      var previousNewFiber = null;
      var oldFiber = currentFirstChild;
      var lastPlacedIndex = 0;
      var newIdx = 0;
      var nextOldFiber = null;
      var step = newChildren.next();
      for (; oldFiber !== null && !step.done; newIdx++, step = newChildren.next()) {
        if (oldFiber.index > newIdx) {
          nextOldFiber = oldFiber;
          oldFiber = null;
        } else {
          nextOldFiber = oldFiber.sibling;
        }
        var newFiber = updateSlot(returnFiber, oldFiber, step.value, expirationTime);
        if (newFiber === null) {
          if (!oldFiber) {
            oldFiber = nextOldFiber;
          }
          break;
        }
        if (shouldTrackSideEffects) {
          if (oldFiber && newFiber.alternate === null) {
            deleteChild(returnFiber, oldFiber);
          }
        }
        lastPlacedIndex = placeChild(newFiber, lastPlacedIndex, newIdx);
        if (previousNewFiber === null) {
          resultingFirstChild = newFiber;
        } else {
          previousNewFiber.sibling = newFiber;
        }
        previousNewFiber = newFiber;
        oldFiber = nextOldFiber;
      }
      if (step.done) {
        deleteRemainingChildren(returnFiber, oldFiber);
        return resultingFirstChild;
      }
      if (oldFiber === null) {
        for (; !step.done; newIdx++, step = newChildren.next()) {
          var _newFiber3 = createChild(returnFiber, step.value, expirationTime);
          if (_newFiber3 === null) {
            continue;
          }
          lastPlacedIndex = placeChild(_newFiber3, lastPlacedIndex, newIdx);
          if (previousNewFiber === null) {
            resultingFirstChild = _newFiber3;
          } else {
            previousNewFiber.sibling = _newFiber3;
          }
          previousNewFiber = _newFiber3;
        }
        return resultingFirstChild;
      }
      var existingChildren = mapRemainingChildren(returnFiber, oldFiber);
      for (; !step.done; newIdx++, step = newChildren.next()) {
        var _newFiber4 = updateFromMap(existingChildren, returnFiber, newIdx, step.value, expirationTime);
        if (_newFiber4 !== null) {
          if (shouldTrackSideEffects) {
            if (_newFiber4.alternate !== null) {
              existingChildren.delete(_newFiber4.key === null ? newIdx : _newFiber4.key);
            }
          }
          lastPlacedIndex = placeChild(_newFiber4, lastPlacedIndex, newIdx);
          if (previousNewFiber === null) {
            resultingFirstChild = _newFiber4;
          } else {
            previousNewFiber.sibling = _newFiber4;
          }
          previousNewFiber = _newFiber4;
        }
      }
      if (shouldTrackSideEffects) {
        existingChildren.forEach(function(child2) {
          return deleteChild(returnFiber, child2);
        });
      }
      return resultingFirstChild;
    }
    function reconcileSingleTextNode(returnFiber, currentFirstChild, textContent, expirationTime) {
      if (currentFirstChild !== null && currentFirstChild.tag === HostText) {
        deleteRemainingChildren(returnFiber, currentFirstChild.sibling);
        var existing = useFiber(currentFirstChild, textContent, expirationTime);
        existing.return = returnFiber;
        return existing;
      }
      deleteRemainingChildren(returnFiber, currentFirstChild);
      var created = createFiberFromText(textContent, returnFiber.mode, expirationTime);
      created.return = returnFiber;
      return created;
    }
    function reconcileSingleElement(returnFiber, currentFirstChild, element, expirationTime) {
      var key = element.key;
      var child = currentFirstChild;
      while (child !== null) {
        if (child.key === key) {
          if (child.tag === Fragment ? element.type === REACT_FRAGMENT_TYPE : child.elementType === element.type) {
            deleteRemainingChildren(returnFiber, child.sibling);
            var existing = useFiber(child, element.type === REACT_FRAGMENT_TYPE ? element.props.children : element.props, expirationTime);
            existing.ref = coerceRef(returnFiber, child, element);
            existing.return = returnFiber;
            {
              existing._debugSource = element._source;
              existing._debugOwner = element._owner;
            }
            return existing;
          } else {
            deleteRemainingChildren(returnFiber, child);
            break;
          }
        } else {
          deleteChild(returnFiber, child);
        }
        child = child.sibling;
      }
      if (element.type === REACT_FRAGMENT_TYPE) {
        var created = createFiberFromFragment(element.props.children, returnFiber.mode, expirationTime, element.key);
        created.return = returnFiber;
        return created;
      } else {
        var _created4 = createFiberFromElement(element, returnFiber.mode, expirationTime);
        _created4.ref = coerceRef(returnFiber, currentFirstChild, element);
        _created4.return = returnFiber;
        return _created4;
      }
    }
    function reconcileSinglePortal(returnFiber, currentFirstChild, portal, expirationTime) {
      var key = portal.key;
      var child = currentFirstChild;
      while (child !== null) {
        if (child.key === key) {
          if (child.tag === HostPortal && child.stateNode.containerInfo === portal.containerInfo && child.stateNode.implementation === portal.implementation) {
            deleteRemainingChildren(returnFiber, child.sibling);
            var existing = useFiber(child, portal.children || [], expirationTime);
            existing.return = returnFiber;
            return existing;
          } else {
            deleteRemainingChildren(returnFiber, child);
            break;
          }
        } else {
          deleteChild(returnFiber, child);
        }
        child = child.sibling;
      }
      var created = createFiberFromPortal(portal, returnFiber.mode, expirationTime);
      created.return = returnFiber;
      return created;
    }
    function reconcileChildFibers2(returnFiber, currentFirstChild, newChild, expirationTime) {
      var isUnkeyedTopLevelFragment = typeof newChild === "object" && newChild !== null && newChild.type === REACT_FRAGMENT_TYPE && newChild.key === null;
      if (isUnkeyedTopLevelFragment) {
        newChild = newChild.props.children;
      }
      var isObject = typeof newChild === "object" && newChild !== null;
      if (isObject) {
        switch (newChild.$$typeof) {
          case REACT_ELEMENT_TYPE:
            return placeSingleChild(reconcileSingleElement(returnFiber, currentFirstChild, newChild, expirationTime));
          case REACT_PORTAL_TYPE:
            return placeSingleChild(reconcileSinglePortal(returnFiber, currentFirstChild, newChild, expirationTime));
        }
      }
      if (typeof newChild === "string" || typeof newChild === "number") {
        return placeSingleChild(reconcileSingleTextNode(returnFiber, currentFirstChild, "" + newChild, expirationTime));
      }
      if (isArray(newChild)) {
        return reconcileChildrenArray(returnFiber, currentFirstChild, newChild, expirationTime);
      }
      if (getIteratorFn(newChild)) {
        return reconcileChildrenIterator(returnFiber, currentFirstChild, newChild, expirationTime);
      }
      if (isObject) {
        throwOnInvalidObjectType(returnFiber, newChild);
      }
      {
        if (typeof newChild === "function") {
          warnOnFunctionType();
        }
      }
      if (typeof newChild === "undefined" && !isUnkeyedTopLevelFragment) {
        switch (returnFiber.tag) {
          case ClassComponent: {
            {
              var instance = returnFiber.stateNode;
              if (instance.render._isMockFunction) {
                break;
              }
            }
          }
          // Intentionally fall through to the next case, which handles both
          // functions and classes
          // eslint-disable-next-lined no-fallthrough
          case FunctionComponent: {
            var Component = returnFiber.type;
            invariant(false, "%s(...): Nothing was returned from render. This usually means a return statement is missing. Or, to render nothing, return null.", Component.displayName || Component.name || "Component");
          }
        }
      }
      return deleteRemainingChildren(returnFiber, currentFirstChild);
    }
    return reconcileChildFibers2;
  }
  var reconcileChildFibers = ChildReconciler(true);
  var mountChildFibers = ChildReconciler(false);
  function cloneChildFibers(current$$1, workInProgress) {
    !(current$$1 === null || workInProgress.child === current$$1.child) ? invariant(false, "Resuming work not yet implemented.") : void 0;
    if (workInProgress.child === null) {
      return;
    }
    var currentChild = workInProgress.child;
    var newChild = createWorkInProgress(currentChild, currentChild.pendingProps, currentChild.expirationTime);
    workInProgress.child = newChild;
    newChild.return = workInProgress;
    while (currentChild.sibling !== null) {
      currentChild = currentChild.sibling;
      newChild = newChild.sibling = createWorkInProgress(currentChild, currentChild.pendingProps, currentChild.expirationTime);
      newChild.return = workInProgress;
    }
    newChild.sibling = null;
  }
  var hydrationParentFiber = null;
  var nextHydratableInstance = null;
  var isHydrating = false;
  function enterHydrationState(fiber) {
    if (!supportsHydration) {
      return false;
    }
    var parentInstance = fiber.stateNode.containerInfo;
    nextHydratableInstance = getFirstHydratableChild(parentInstance);
    hydrationParentFiber = fiber;
    isHydrating = true;
    return true;
  }
  function deleteHydratableInstance(returnFiber, instance) {
    {
      switch (returnFiber.tag) {
        case HostRoot:
          didNotHydrateContainerInstance(returnFiber.stateNode.containerInfo, instance);
          break;
        case HostComponent:
          didNotHydrateInstance(returnFiber.type, returnFiber.memoizedProps, returnFiber.stateNode, instance);
          break;
      }
    }
    var childToDelete = createFiberFromHostInstanceForDeletion();
    childToDelete.stateNode = instance;
    childToDelete.return = returnFiber;
    childToDelete.effectTag = Deletion;
    if (returnFiber.lastEffect !== null) {
      returnFiber.lastEffect.nextEffect = childToDelete;
      returnFiber.lastEffect = childToDelete;
    } else {
      returnFiber.firstEffect = returnFiber.lastEffect = childToDelete;
    }
  }
  function insertNonHydratedInstance(returnFiber, fiber) {
    fiber.effectTag |= Placement;
    {
      switch (returnFiber.tag) {
        case HostRoot: {
          var parentContainer = returnFiber.stateNode.containerInfo;
          switch (fiber.tag) {
            case HostComponent:
              var type = fiber.type;
              var props = fiber.pendingProps;
              didNotFindHydratableContainerInstance(parentContainer, type, props);
              break;
            case HostText:
              var text = fiber.pendingProps;
              didNotFindHydratableContainerTextInstance(parentContainer, text);
              break;
          }
          break;
        }
        case HostComponent: {
          var parentType = returnFiber.type;
          var parentProps = returnFiber.memoizedProps;
          var parentInstance = returnFiber.stateNode;
          switch (fiber.tag) {
            case HostComponent:
              var _type = fiber.type;
              var _props = fiber.pendingProps;
              didNotFindHydratableInstance(parentType, parentProps, parentInstance, _type, _props);
              break;
            case HostText:
              var _text = fiber.pendingProps;
              didNotFindHydratableTextInstance(parentType, parentProps, parentInstance, _text);
              break;
          }
          break;
        }
        default:
          return;
      }
    }
  }
  function tryHydrate(fiber, nextInstance) {
    switch (fiber.tag) {
      case HostComponent: {
        var type = fiber.type;
        var props = fiber.pendingProps;
        var instance = canHydrateInstance(nextInstance, type, props);
        if (instance !== null) {
          fiber.stateNode = instance;
          return true;
        }
        return false;
      }
      case HostText: {
        var text = fiber.pendingProps;
        var textInstance = canHydrateTextInstance(nextInstance, text);
        if (textInstance !== null) {
          fiber.stateNode = textInstance;
          return true;
        }
        return false;
      }
      default:
        return false;
    }
  }
  function tryToClaimNextHydratableInstance(fiber) {
    if (!isHydrating) {
      return;
    }
    var nextInstance = nextHydratableInstance;
    if (!nextInstance) {
      insertNonHydratedInstance(hydrationParentFiber, fiber);
      isHydrating = false;
      hydrationParentFiber = fiber;
      return;
    }
    var firstAttemptedInstance = nextInstance;
    if (!tryHydrate(fiber, nextInstance)) {
      nextInstance = getNextHydratableSibling(firstAttemptedInstance);
      if (!nextInstance || !tryHydrate(fiber, nextInstance)) {
        insertNonHydratedInstance(hydrationParentFiber, fiber);
        isHydrating = false;
        hydrationParentFiber = fiber;
        return;
      }
      deleteHydratableInstance(hydrationParentFiber, firstAttemptedInstance);
    }
    hydrationParentFiber = fiber;
    nextHydratableInstance = getFirstHydratableChild(nextInstance);
  }
  function prepareToHydrateHostInstance(fiber, rootContainerInstance, hostContext) {
    if (!supportsHydration) {
      invariant(false, "Expected prepareToHydrateHostInstance() to never be called. This error is likely caused by a bug in React. Please file an issue.");
    }
    var instance = fiber.stateNode;
    var updatePayload = hydrateInstance(instance, fiber.type, fiber.memoizedProps, rootContainerInstance, hostContext, fiber);
    fiber.updateQueue = updatePayload;
    if (updatePayload !== null) {
      return true;
    }
    return false;
  }
  function prepareToHydrateHostTextInstance(fiber) {
    if (!supportsHydration) {
      invariant(false, "Expected prepareToHydrateHostTextInstance() to never be called. This error is likely caused by a bug in React. Please file an issue.");
    }
    var textInstance = fiber.stateNode;
    var textContent = fiber.memoizedProps;
    var shouldUpdate = hydrateTextInstance(textInstance, textContent, fiber);
    {
      if (shouldUpdate) {
        var returnFiber = hydrationParentFiber;
        if (returnFiber !== null) {
          switch (returnFiber.tag) {
            case HostRoot: {
              var parentContainer = returnFiber.stateNode.containerInfo;
              didNotMatchHydratedContainerTextInstance(parentContainer, textInstance, textContent);
              break;
            }
            case HostComponent: {
              var parentType = returnFiber.type;
              var parentProps = returnFiber.memoizedProps;
              var parentInstance = returnFiber.stateNode;
              didNotMatchHydratedTextInstance(parentType, parentProps, parentInstance, textInstance, textContent);
              break;
            }
          }
        }
      }
    }
    return shouldUpdate;
  }
  function popToNextHostParent(fiber) {
    var parent = fiber.return;
    while (parent !== null && parent.tag !== HostComponent && parent.tag !== HostRoot) {
      parent = parent.return;
    }
    hydrationParentFiber = parent;
  }
  function popHydrationState(fiber) {
    if (!supportsHydration) {
      return false;
    }
    if (fiber !== hydrationParentFiber) {
      return false;
    }
    if (!isHydrating) {
      popToNextHostParent(fiber);
      isHydrating = true;
      return false;
    }
    var type = fiber.type;
    if (fiber.tag !== HostComponent || type !== "head" && type !== "body" && !shouldSetTextContent(type, fiber.memoizedProps)) {
      var nextInstance = nextHydratableInstance;
      while (nextInstance) {
        deleteHydratableInstance(fiber, nextInstance);
        nextInstance = getNextHydratableSibling(nextInstance);
      }
    }
    popToNextHostParent(fiber);
    nextHydratableInstance = hydrationParentFiber ? getNextHydratableSibling(fiber.stateNode) : null;
    return true;
  }
  function resetHydrationState() {
    if (!supportsHydration) {
      return;
    }
    hydrationParentFiber = null;
    nextHydratableInstance = null;
    isHydrating = false;
  }
  var ReactCurrentOwner$3 = ReactSharedInternals.ReactCurrentOwner;
  var didWarnAboutBadClass = void 0;
  var didWarnAboutContextTypeOnFunctionComponent = void 0;
  var didWarnAboutGetDerivedStateOnFunctionComponent = void 0;
  var didWarnAboutFunctionRefs = void 0;
  {
    didWarnAboutBadClass = {};
    didWarnAboutContextTypeOnFunctionComponent = {};
    didWarnAboutGetDerivedStateOnFunctionComponent = {};
    didWarnAboutFunctionRefs = {};
  }
  function reconcileChildren(current$$1, workInProgress, nextChildren, renderExpirationTime2) {
    if (current$$1 === null) {
      workInProgress.child = mountChildFibers(workInProgress, null, nextChildren, renderExpirationTime2);
    } else {
      workInProgress.child = reconcileChildFibers(workInProgress, current$$1.child, nextChildren, renderExpirationTime2);
    }
  }
  function forceUnmountCurrentAndReconcile(current$$1, workInProgress, nextChildren, renderExpirationTime2) {
    workInProgress.child = reconcileChildFibers(workInProgress, current$$1.child, null, renderExpirationTime2);
    workInProgress.child = reconcileChildFibers(workInProgress, null, nextChildren, renderExpirationTime2);
  }
  function updateForwardRef(current$$1, workInProgress, Component, nextProps, renderExpirationTime2) {
    var render2 = Component.render;
    var ref = workInProgress.ref;
    var nextChildren = void 0;
    prepareToReadContext(workInProgress, renderExpirationTime2);
    prepareToUseHooks(current$$1, workInProgress, renderExpirationTime2);
    {
      ReactCurrentOwner$3.current = workInProgress;
      setCurrentPhase("render");
      nextChildren = render2(nextProps, ref);
      setCurrentPhase(null);
    }
    nextChildren = finishHooks(render2, nextProps, nextChildren, ref);
    workInProgress.effectTag |= PerformedWork;
    reconcileChildren(current$$1, workInProgress, nextChildren, renderExpirationTime2);
    return workInProgress.child;
  }
  function updateMemoComponent(current$$1, workInProgress, Component, nextProps, updateExpirationTime, renderExpirationTime2) {
    if (current$$1 === null) {
      var type = Component.type;
      if (isSimpleFunctionComponent(type) && Component.compare === null) {
        workInProgress.tag = SimpleMemoComponent;
        workInProgress.type = type;
        return updateSimpleMemoComponent(current$$1, workInProgress, type, nextProps, updateExpirationTime, renderExpirationTime2);
      }
      var child = createFiberFromTypeAndProps(Component.type, null, nextProps, null, workInProgress.mode, renderExpirationTime2);
      child.ref = workInProgress.ref;
      child.return = workInProgress;
      workInProgress.child = child;
      return child;
    }
    var currentChild = current$$1.child;
    if (updateExpirationTime < renderExpirationTime2) {
      var prevProps = currentChild.memoizedProps;
      var compare = Component.compare;
      compare = compare !== null ? compare : shallowEqual;
      if (compare(prevProps, nextProps) && current$$1.ref === workInProgress.ref) {
        return bailoutOnAlreadyFinishedWork(current$$1, workInProgress, renderExpirationTime2);
      }
    }
    workInProgress.effectTag |= PerformedWork;
    var newChild = createWorkInProgress(currentChild, nextProps, renderExpirationTime2);
    newChild.ref = workInProgress.ref;
    newChild.return = workInProgress;
    workInProgress.child = newChild;
    return newChild;
  }
  function updateSimpleMemoComponent(current$$1, workInProgress, Component, nextProps, updateExpirationTime, renderExpirationTime2) {
    if (current$$1 !== null && updateExpirationTime < renderExpirationTime2) {
      var prevProps = current$$1.memoizedProps;
      if (shallowEqual(prevProps, nextProps) && current$$1.ref === workInProgress.ref) {
        return bailoutOnAlreadyFinishedWork(current$$1, workInProgress, renderExpirationTime2);
      }
    }
    return updateFunctionComponent(current$$1, workInProgress, Component, nextProps, renderExpirationTime2);
  }
  function updateFragment(current$$1, workInProgress, renderExpirationTime2) {
    var nextChildren = workInProgress.pendingProps;
    reconcileChildren(current$$1, workInProgress, nextChildren, renderExpirationTime2);
    return workInProgress.child;
  }
  function updateMode(current$$1, workInProgress, renderExpirationTime2) {
    var nextChildren = workInProgress.pendingProps.children;
    reconcileChildren(current$$1, workInProgress, nextChildren, renderExpirationTime2);
    return workInProgress.child;
  }
  function updateProfiler(current$$1, workInProgress, renderExpirationTime2) {
    if (enableProfilerTimer) {
      workInProgress.effectTag |= Update;
    }
    var nextProps = workInProgress.pendingProps;
    var nextChildren = nextProps.children;
    reconcileChildren(current$$1, workInProgress, nextChildren, renderExpirationTime2);
    return workInProgress.child;
  }
  function markRef(current$$1, workInProgress) {
    var ref = workInProgress.ref;
    if (current$$1 === null && ref !== null || current$$1 !== null && current$$1.ref !== ref) {
      workInProgress.effectTag |= Ref;
    }
  }
  function updateFunctionComponent(current$$1, workInProgress, Component, nextProps, renderExpirationTime2) {
    var unmaskedContext = getUnmaskedContext(workInProgress, Component, true);
    var context = getMaskedContext(workInProgress, unmaskedContext);
    var nextChildren = void 0;
    prepareToReadContext(workInProgress, renderExpirationTime2);
    prepareToUseHooks(current$$1, workInProgress, renderExpirationTime2);
    {
      ReactCurrentOwner$3.current = workInProgress;
      setCurrentPhase("render");
      nextChildren = Component(nextProps, context);
      setCurrentPhase(null);
    }
    nextChildren = finishHooks(Component, nextProps, nextChildren, context);
    workInProgress.effectTag |= PerformedWork;
    reconcileChildren(current$$1, workInProgress, nextChildren, renderExpirationTime2);
    return workInProgress.child;
  }
  function updateClassComponent(current$$1, workInProgress, Component, nextProps, renderExpirationTime2) {
    var hasContext = void 0;
    if (isContextProvider(Component)) {
      hasContext = true;
      pushContextProvider(workInProgress);
    } else {
      hasContext = false;
    }
    prepareToReadContext(workInProgress, renderExpirationTime2);
    var instance = workInProgress.stateNode;
    var shouldUpdate = void 0;
    if (instance === null) {
      if (current$$1 !== null) {
        current$$1.alternate = null;
        workInProgress.alternate = null;
        workInProgress.effectTag |= Placement;
      }
      constructClassInstance(workInProgress, Component, nextProps, renderExpirationTime2);
      mountClassInstance(workInProgress, Component, nextProps, renderExpirationTime2);
      shouldUpdate = true;
    } else if (current$$1 === null) {
      shouldUpdate = resumeMountClassInstance(workInProgress, Component, nextProps, renderExpirationTime2);
    } else {
      shouldUpdate = updateClassInstance(current$$1, workInProgress, Component, nextProps, renderExpirationTime2);
    }
    return finishClassComponent(current$$1, workInProgress, Component, shouldUpdate, hasContext, renderExpirationTime2);
  }
  function finishClassComponent(current$$1, workInProgress, Component, shouldUpdate, hasContext, renderExpirationTime2) {
    markRef(current$$1, workInProgress);
    var didCaptureError = (workInProgress.effectTag & DidCapture) !== NoEffect;
    if (!shouldUpdate && !didCaptureError) {
      if (hasContext) {
        invalidateContextProvider(workInProgress, Component, false);
      }
      return bailoutOnAlreadyFinishedWork(current$$1, workInProgress, renderExpirationTime2);
    }
    var instance = workInProgress.stateNode;
    ReactCurrentOwner$3.current = workInProgress;
    var nextChildren = void 0;
    if (didCaptureError && typeof Component.getDerivedStateFromError !== "function") {
      nextChildren = null;
      if (enableProfilerTimer) {
        stopProfilerTimerIfRunning(workInProgress);
      }
    } else {
      {
        setCurrentPhase("render");
        nextChildren = instance.render();
        if (debugRenderPhaseSideEffects || debugRenderPhaseSideEffectsForStrictMode && workInProgress.mode & StrictMode) {
          instance.render();
        }
        setCurrentPhase(null);
      }
    }
    workInProgress.effectTag |= PerformedWork;
    if (current$$1 !== null && didCaptureError) {
      forceUnmountCurrentAndReconcile(current$$1, workInProgress, nextChildren, renderExpirationTime2);
    } else {
      reconcileChildren(current$$1, workInProgress, nextChildren, renderExpirationTime2);
    }
    workInProgress.memoizedState = instance.state;
    if (hasContext) {
      invalidateContextProvider(workInProgress, Component, true);
    }
    return workInProgress.child;
  }
  function pushHostRootContext(workInProgress) {
    var root2 = workInProgress.stateNode;
    if (root2.pendingContext) {
      pushTopLevelContextObject(workInProgress, root2.pendingContext, root2.pendingContext !== root2.context);
    } else if (root2.context) {
      pushTopLevelContextObject(workInProgress, root2.context, false);
    }
    pushHostContainer(workInProgress, root2.containerInfo);
  }
  function updateHostRoot(current$$1, workInProgress, renderExpirationTime2) {
    pushHostRootContext(workInProgress);
    var updateQueue = workInProgress.updateQueue;
    !(updateQueue !== null) ? invariant(false, "If the root does not have an updateQueue, we should have already bailed out. This error is likely caused by a bug in React. Please file an issue.") : void 0;
    var nextProps = workInProgress.pendingProps;
    var prevState = workInProgress.memoizedState;
    var prevChildren = prevState !== null ? prevState.element : null;
    processUpdateQueue(workInProgress, updateQueue, nextProps, null, renderExpirationTime2);
    var nextState = workInProgress.memoizedState;
    var nextChildren = nextState.element;
    if (nextChildren === prevChildren) {
      resetHydrationState();
      return bailoutOnAlreadyFinishedWork(current$$1, workInProgress, renderExpirationTime2);
    }
    var root2 = workInProgress.stateNode;
    if ((current$$1 === null || current$$1.child === null) && root2.hydrate && enterHydrationState(workInProgress)) {
      workInProgress.effectTag |= Placement;
      workInProgress.child = mountChildFibers(workInProgress, null, nextChildren, renderExpirationTime2);
    } else {
      reconcileChildren(current$$1, workInProgress, nextChildren, renderExpirationTime2);
      resetHydrationState();
    }
    return workInProgress.child;
  }
  function updateHostComponent(current$$1, workInProgress, renderExpirationTime2) {
    pushHostContext(workInProgress);
    if (current$$1 === null) {
      tryToClaimNextHydratableInstance(workInProgress);
    }
    var type = workInProgress.type;
    var nextProps = workInProgress.pendingProps;
    var prevProps = current$$1 !== null ? current$$1.memoizedProps : null;
    var nextChildren = nextProps.children;
    var isDirectTextChild = shouldSetTextContent(type, nextProps);
    if (isDirectTextChild) {
      nextChildren = null;
    } else if (prevProps !== null && shouldSetTextContent(type, prevProps)) {
      workInProgress.effectTag |= ContentReset;
    }
    markRef(current$$1, workInProgress);
    if (renderExpirationTime2 !== Never && workInProgress.mode & ConcurrentMode && shouldDeprioritizeSubtree(type, nextProps)) {
      workInProgress.expirationTime = Never;
      return null;
    }
    reconcileChildren(current$$1, workInProgress, nextChildren, renderExpirationTime2);
    return workInProgress.child;
  }
  function updateHostText(current$$1, workInProgress) {
    if (current$$1 === null) {
      tryToClaimNextHydratableInstance(workInProgress);
    }
    return null;
  }
  function mountLazyComponent(_current, workInProgress, elementType, updateExpirationTime, renderExpirationTime2) {
    if (_current !== null) {
      _current.alternate = null;
      workInProgress.alternate = null;
      workInProgress.effectTag |= Placement;
    }
    var props = workInProgress.pendingProps;
    cancelWorkTimer(workInProgress);
    var Component = readLazyComponentType(elementType);
    workInProgress.type = Component;
    var resolvedTag = workInProgress.tag = resolveLazyComponentTag(Component);
    startWorkTimer(workInProgress);
    var resolvedProps = resolveDefaultProps(Component, props);
    var child = void 0;
    switch (resolvedTag) {
      case FunctionComponent: {
        child = updateFunctionComponent(null, workInProgress, Component, resolvedProps, renderExpirationTime2);
        break;
      }
      case ClassComponent: {
        child = updateClassComponent(null, workInProgress, Component, resolvedProps, renderExpirationTime2);
        break;
      }
      case ForwardRef: {
        child = updateForwardRef(null, workInProgress, Component, resolvedProps, renderExpirationTime2);
        break;
      }
      case MemoComponent: {
        child = updateMemoComponent(
          null,
          workInProgress,
          Component,
          resolveDefaultProps(Component.type, resolvedProps),
          // The inner type can have defaults too
          updateExpirationTime,
          renderExpirationTime2
        );
        break;
      }
      default: {
        invariant(false, "Element type is invalid. Received a promise that resolves to: %s. Promise elements must resolve to a class or function.", Component);
      }
    }
    return child;
  }
  function mountIncompleteClassComponent(_current, workInProgress, Component, nextProps, renderExpirationTime2) {
    if (_current !== null) {
      _current.alternate = null;
      workInProgress.alternate = null;
      workInProgress.effectTag |= Placement;
    }
    workInProgress.tag = ClassComponent;
    var hasContext = void 0;
    if (isContextProvider(Component)) {
      hasContext = true;
      pushContextProvider(workInProgress);
    } else {
      hasContext = false;
    }
    prepareToReadContext(workInProgress, renderExpirationTime2);
    constructClassInstance(workInProgress, Component, nextProps, renderExpirationTime2);
    mountClassInstance(workInProgress, Component, nextProps, renderExpirationTime2);
    return finishClassComponent(null, workInProgress, Component, true, hasContext, renderExpirationTime2);
  }
  function mountIndeterminateComponent(_current, workInProgress, Component, renderExpirationTime2) {
    if (_current !== null) {
      _current.alternate = null;
      workInProgress.alternate = null;
      workInProgress.effectTag |= Placement;
    }
    var props = workInProgress.pendingProps;
    var unmaskedContext = getUnmaskedContext(workInProgress, Component, false);
    var context = getMaskedContext(workInProgress, unmaskedContext);
    prepareToReadContext(workInProgress, renderExpirationTime2);
    prepareToUseHooks(null, workInProgress, renderExpirationTime2);
    var value = void 0;
    {
      if (Component.prototype && typeof Component.prototype.render === "function") {
        var componentName = getComponentName(Component) || "Unknown";
        if (!didWarnAboutBadClass[componentName]) {
          warningWithoutStack$1(false, "The <%s /> component appears to have a render method, but doesn't extend React.Component. This is likely to cause errors. Change %s to extend React.Component instead.", componentName, componentName);
          didWarnAboutBadClass[componentName] = true;
        }
      }
      if (workInProgress.mode & StrictMode) {
        ReactStrictModeWarnings.recordLegacyContextWarning(workInProgress, null);
      }
      ReactCurrentOwner$3.current = workInProgress;
      value = Component(props, context);
    }
    workInProgress.effectTag |= PerformedWork;
    if (typeof value === "object" && value !== null && typeof value.render === "function" && value.$$typeof === void 0) {
      workInProgress.tag = ClassComponent;
      resetHooks();
      var hasContext = false;
      if (isContextProvider(Component)) {
        hasContext = true;
        pushContextProvider(workInProgress);
      } else {
        hasContext = false;
      }
      workInProgress.memoizedState = value.state !== null && value.state !== void 0 ? value.state : null;
      var getDerivedStateFromProps = Component.getDerivedStateFromProps;
      if (typeof getDerivedStateFromProps === "function") {
        applyDerivedStateFromProps(workInProgress, Component, getDerivedStateFromProps, props);
      }
      adoptClassInstance(workInProgress, value);
      mountClassInstance(workInProgress, Component, props, renderExpirationTime2);
      return finishClassComponent(null, workInProgress, Component, true, hasContext, renderExpirationTime2);
    } else {
      workInProgress.tag = FunctionComponent;
      value = finishHooks(Component, props, value, context);
      {
        if (Component) {
          !!Component.childContextTypes ? warningWithoutStack$1(false, "%s(...): childContextTypes cannot be defined on a function component.", Component.displayName || Component.name || "Component") : void 0;
        }
        if (workInProgress.ref !== null) {
          var info = "";
          var ownerName = getCurrentFiberOwnerNameInDevOrNull();
          if (ownerName) {
            info += "\n\nCheck the render method of `" + ownerName + "`.";
          }
          var warningKey = ownerName || workInProgress._debugID || "";
          var debugSource = workInProgress._debugSource;
          if (debugSource) {
            warningKey = debugSource.fileName + ":" + debugSource.lineNumber;
          }
          if (!didWarnAboutFunctionRefs[warningKey]) {
            didWarnAboutFunctionRefs[warningKey] = true;
            warning$1(false, "Function components cannot be given refs. Attempts to access this ref will fail.%s", info);
          }
        }
        if (typeof Component.getDerivedStateFromProps === "function") {
          var _componentName = getComponentName(Component) || "Unknown";
          if (!didWarnAboutGetDerivedStateOnFunctionComponent[_componentName]) {
            warningWithoutStack$1(false, "%s: Function components do not support getDerivedStateFromProps.", _componentName);
            didWarnAboutGetDerivedStateOnFunctionComponent[_componentName] = true;
          }
        }
        if (typeof Component.contextType === "object" && Component.contextType !== null) {
          var _componentName2 = getComponentName(Component) || "Unknown";
          if (!didWarnAboutContextTypeOnFunctionComponent[_componentName2]) {
            warningWithoutStack$1(false, "%s: Function components do not support contextType.", _componentName2);
            didWarnAboutContextTypeOnFunctionComponent[_componentName2] = true;
          }
        }
      }
      reconcileChildren(null, workInProgress, value, renderExpirationTime2);
      return workInProgress.child;
    }
  }
  function updateSuspenseComponent(current$$1, workInProgress, renderExpirationTime2) {
    var mode = workInProgress.mode;
    var nextProps = workInProgress.pendingProps;
    var nextState = workInProgress.memoizedState;
    var nextDidTimeout = void 0;
    if ((workInProgress.effectTag & DidCapture) === NoEffect) {
      nextState = null;
      nextDidTimeout = false;
    } else {
      nextState = {
        timedOutAt: nextState !== null ? nextState.timedOutAt : NoWork
      };
      nextDidTimeout = true;
      workInProgress.effectTag &= ~DidCapture;
    }
    var child = void 0;
    var next = void 0;
    if (current$$1 === null) {
      if (nextDidTimeout) {
        var nextFallbackChildren = nextProps.fallback;
        var primaryChildFragment = createFiberFromFragment(null, mode, NoWork, null);
        if ((workInProgress.mode & ConcurrentMode) === NoContext) {
          var progressedState = workInProgress.memoizedState;
          var progressedPrimaryChild = progressedState !== null ? workInProgress.child.child : workInProgress.child;
          primaryChildFragment.child = progressedPrimaryChild;
        }
        var fallbackChildFragment = createFiberFromFragment(nextFallbackChildren, mode, renderExpirationTime2, null);
        primaryChildFragment.sibling = fallbackChildFragment;
        child = primaryChildFragment;
        next = fallbackChildFragment;
        child.return = next.return = workInProgress;
      } else {
        var nextPrimaryChildren = nextProps.children;
        child = next = mountChildFibers(workInProgress, null, nextPrimaryChildren, renderExpirationTime2);
      }
    } else {
      var prevState = current$$1.memoizedState;
      var prevDidTimeout = prevState !== null;
      if (prevDidTimeout) {
        var currentPrimaryChildFragment = current$$1.child;
        var currentFallbackChildFragment = currentPrimaryChildFragment.sibling;
        if (nextDidTimeout) {
          var _nextFallbackChildren = nextProps.fallback;
          var _primaryChildFragment = createWorkInProgress(currentPrimaryChildFragment, currentPrimaryChildFragment.pendingProps, NoWork);
          if ((workInProgress.mode & ConcurrentMode) === NoContext) {
            var _progressedState = workInProgress.memoizedState;
            var _progressedPrimaryChild = _progressedState !== null ? workInProgress.child.child : workInProgress.child;
            if (_progressedPrimaryChild !== currentPrimaryChildFragment.child) {
              _primaryChildFragment.child = _progressedPrimaryChild;
            }
          }
          if (enableProfilerTimer && workInProgress.mode & ProfileMode) {
            var treeBaseDuration = 0;
            var hiddenChild = _primaryChildFragment.child;
            while (hiddenChild !== null) {
              treeBaseDuration += hiddenChild.treeBaseDuration;
              hiddenChild = hiddenChild.sibling;
            }
            _primaryChildFragment.treeBaseDuration = treeBaseDuration;
          }
          var _fallbackChildFragment = _primaryChildFragment.sibling = createWorkInProgress(currentFallbackChildFragment, _nextFallbackChildren, currentFallbackChildFragment.expirationTime);
          child = _primaryChildFragment;
          _primaryChildFragment.childExpirationTime = NoWork;
          next = _fallbackChildFragment;
          child.return = next.return = workInProgress;
        } else {
          var _nextPrimaryChildren = nextProps.children;
          var currentPrimaryChild = currentPrimaryChildFragment.child;
          var primaryChild = reconcileChildFibers(workInProgress, currentPrimaryChild, _nextPrimaryChildren, renderExpirationTime2);
          child = next = primaryChild;
        }
      } else {
        var _currentPrimaryChild = current$$1.child;
        if (nextDidTimeout) {
          var _nextFallbackChildren2 = nextProps.fallback;
          var _primaryChildFragment2 = createFiberFromFragment(
            // It shouldn't matter what the pending props are because we aren't
            // going to render this fragment.
            null,
            mode,
            NoWork,
            null
          );
          _primaryChildFragment2.child = _currentPrimaryChild;
          if ((workInProgress.mode & ConcurrentMode) === NoContext) {
            var _progressedState2 = workInProgress.memoizedState;
            var _progressedPrimaryChild2 = _progressedState2 !== null ? workInProgress.child.child : workInProgress.child;
            _primaryChildFragment2.child = _progressedPrimaryChild2;
          }
          if (enableProfilerTimer && workInProgress.mode & ProfileMode) {
            var _treeBaseDuration = 0;
            var _hiddenChild = _primaryChildFragment2.child;
            while (_hiddenChild !== null) {
              _treeBaseDuration += _hiddenChild.treeBaseDuration;
              _hiddenChild = _hiddenChild.sibling;
            }
            _primaryChildFragment2.treeBaseDuration = _treeBaseDuration;
          }
          var _fallbackChildFragment2 = _primaryChildFragment2.sibling = createFiberFromFragment(_nextFallbackChildren2, mode, renderExpirationTime2, null);
          _fallbackChildFragment2.effectTag |= Placement;
          child = _primaryChildFragment2;
          _primaryChildFragment2.childExpirationTime = NoWork;
          next = _fallbackChildFragment2;
          child.return = next.return = workInProgress;
        } else {
          var _nextPrimaryChildren2 = nextProps.children;
          next = child = reconcileChildFibers(workInProgress, _currentPrimaryChild, _nextPrimaryChildren2, renderExpirationTime2);
        }
      }
    }
    workInProgress.memoizedState = nextState;
    workInProgress.child = child;
    return next;
  }
  function updatePortalComponent(current$$1, workInProgress, renderExpirationTime2) {
    pushHostContainer(workInProgress, workInProgress.stateNode.containerInfo);
    var nextChildren = workInProgress.pendingProps;
    if (current$$1 === null) {
      workInProgress.child = reconcileChildFibers(workInProgress, null, nextChildren, renderExpirationTime2);
    } else {
      reconcileChildren(current$$1, workInProgress, nextChildren, renderExpirationTime2);
    }
    return workInProgress.child;
  }
  function updateContextProvider(current$$1, workInProgress, renderExpirationTime2) {
    var providerType = workInProgress.type;
    var context = providerType._context;
    var newProps = workInProgress.pendingProps;
    var oldProps = workInProgress.memoizedProps;
    var newValue = newProps.value;
    {
      var providerPropTypes = workInProgress.type.propTypes;
      if (providerPropTypes) {
        checkPropTypes_1(providerPropTypes, newProps, "prop", "Context.Provider", getCurrentFiberStackInDev);
      }
    }
    pushProvider(workInProgress, newValue);
    if (oldProps !== null) {
      var oldValue = oldProps.value;
      var changedBits = calculateChangedBits(context, newValue, oldValue);
      if (changedBits === 0) {
        if (oldProps.children === newProps.children && !hasContextChanged()) {
          return bailoutOnAlreadyFinishedWork(current$$1, workInProgress, renderExpirationTime2);
        }
      } else {
        propagateContextChange(workInProgress, context, changedBits, renderExpirationTime2);
      }
    }
    var newChildren = newProps.children;
    reconcileChildren(current$$1, workInProgress, newChildren, renderExpirationTime2);
    return workInProgress.child;
  }
  var hasWarnedAboutUsingContextAsConsumer = false;
  function updateContextConsumer(current$$1, workInProgress, renderExpirationTime2) {
    var context = workInProgress.type;
    {
      if (context._context === void 0) {
        if (context !== context.Consumer) {
          if (!hasWarnedAboutUsingContextAsConsumer) {
            hasWarnedAboutUsingContextAsConsumer = true;
            warning$1(false, "Rendering <Context> directly is not supported and will be removed in a future major release. Did you mean to render <Context.Consumer> instead?");
          }
        }
      } else {
        context = context._context;
      }
    }
    var newProps = workInProgress.pendingProps;
    var render2 = newProps.children;
    {
      !(typeof render2 === "function") ? warningWithoutStack$1(false, "A context consumer was rendered with multiple children, or a child that isn't a function. A context consumer expects a single child that is a function. If you did pass a function, make sure there is no trailing or leading whitespace around it.") : void 0;
    }
    prepareToReadContext(workInProgress, renderExpirationTime2);
    var newValue = readContext(context, newProps.unstable_observedBits);
    var newChildren = void 0;
    {
      ReactCurrentOwner$3.current = workInProgress;
      setCurrentPhase("render");
      newChildren = render2(newValue);
      setCurrentPhase(null);
    }
    workInProgress.effectTag |= PerformedWork;
    reconcileChildren(current$$1, workInProgress, newChildren, renderExpirationTime2);
    return workInProgress.child;
  }
  function bailoutOnAlreadyFinishedWork(current$$1, workInProgress, renderExpirationTime2) {
    cancelWorkTimer(workInProgress);
    if (current$$1 !== null) {
      workInProgress.firstContextDependency = current$$1.firstContextDependency;
    }
    if (enableProfilerTimer) {
      stopProfilerTimerIfRunning(workInProgress);
    }
    var childExpirationTime = workInProgress.childExpirationTime;
    if (childExpirationTime < renderExpirationTime2) {
      return null;
    } else {
      cloneChildFibers(current$$1, workInProgress);
      return workInProgress.child;
    }
  }
  function beginWork(current$$1, workInProgress, renderExpirationTime2) {
    var updateExpirationTime = workInProgress.expirationTime;
    if (current$$1 !== null) {
      var oldProps = current$$1.memoizedProps;
      var newProps = workInProgress.pendingProps;
      if (oldProps === newProps && !hasContextChanged() && updateExpirationTime < renderExpirationTime2) {
        switch (workInProgress.tag) {
          case HostRoot:
            pushHostRootContext(workInProgress);
            resetHydrationState();
            break;
          case HostComponent:
            pushHostContext(workInProgress);
            break;
          case ClassComponent: {
            var Component = workInProgress.type;
            if (isContextProvider(Component)) {
              pushContextProvider(workInProgress);
            }
            break;
          }
          case HostPortal:
            pushHostContainer(workInProgress, workInProgress.stateNode.containerInfo);
            break;
          case ContextProvider: {
            var newValue = workInProgress.memoizedProps.value;
            pushProvider(workInProgress, newValue);
            break;
          }
          case Profiler:
            if (enableProfilerTimer) {
              workInProgress.effectTag |= Update;
            }
            break;
          case SuspenseComponent: {
            var state = workInProgress.memoizedState;
            var didTimeout = state !== null;
            if (didTimeout) {
              var primaryChildFragment = workInProgress.child;
              var primaryChildExpirationTime = primaryChildFragment.childExpirationTime;
              if (primaryChildExpirationTime !== NoWork && primaryChildExpirationTime >= renderExpirationTime2) {
                return updateSuspenseComponent(current$$1, workInProgress, renderExpirationTime2);
              } else {
                var child = bailoutOnAlreadyFinishedWork(current$$1, workInProgress, renderExpirationTime2);
                if (child !== null) {
                  return child.sibling;
                } else {
                  return null;
                }
              }
            }
            break;
          }
        }
        return bailoutOnAlreadyFinishedWork(current$$1, workInProgress, renderExpirationTime2);
      }
    }
    workInProgress.expirationTime = NoWork;
    switch (workInProgress.tag) {
      case IndeterminateComponent: {
        var elementType = workInProgress.elementType;
        return mountIndeterminateComponent(current$$1, workInProgress, elementType, renderExpirationTime2);
      }
      case LazyComponent: {
        var _elementType = workInProgress.elementType;
        return mountLazyComponent(current$$1, workInProgress, _elementType, updateExpirationTime, renderExpirationTime2);
      }
      case FunctionComponent: {
        var _Component = workInProgress.type;
        var unresolvedProps = workInProgress.pendingProps;
        var resolvedProps = workInProgress.elementType === _Component ? unresolvedProps : resolveDefaultProps(_Component, unresolvedProps);
        return updateFunctionComponent(current$$1, workInProgress, _Component, resolvedProps, renderExpirationTime2);
      }
      case ClassComponent: {
        var _Component2 = workInProgress.type;
        var _unresolvedProps = workInProgress.pendingProps;
        var _resolvedProps = workInProgress.elementType === _Component2 ? _unresolvedProps : resolveDefaultProps(_Component2, _unresolvedProps);
        return updateClassComponent(current$$1, workInProgress, _Component2, _resolvedProps, renderExpirationTime2);
      }
      case HostRoot:
        return updateHostRoot(current$$1, workInProgress, renderExpirationTime2);
      case HostComponent:
        return updateHostComponent(current$$1, workInProgress, renderExpirationTime2);
      case HostText:
        return updateHostText(current$$1, workInProgress);
      case SuspenseComponent:
        return updateSuspenseComponent(current$$1, workInProgress, renderExpirationTime2);
      case HostPortal:
        return updatePortalComponent(current$$1, workInProgress, renderExpirationTime2);
      case ForwardRef: {
        var type = workInProgress.type;
        var _unresolvedProps2 = workInProgress.pendingProps;
        var _resolvedProps2 = workInProgress.elementType === type ? _unresolvedProps2 : resolveDefaultProps(type, _unresolvedProps2);
        return updateForwardRef(current$$1, workInProgress, type, _resolvedProps2, renderExpirationTime2);
      }
      case Fragment:
        return updateFragment(current$$1, workInProgress, renderExpirationTime2);
      case Mode:
        return updateMode(current$$1, workInProgress, renderExpirationTime2);
      case Profiler:
        return updateProfiler(current$$1, workInProgress, renderExpirationTime2);
      case ContextProvider:
        return updateContextProvider(current$$1, workInProgress, renderExpirationTime2);
      case ContextConsumer:
        return updateContextConsumer(current$$1, workInProgress, renderExpirationTime2);
      case MemoComponent: {
        var _type = workInProgress.type;
        var _unresolvedProps3 = workInProgress.pendingProps;
        var _resolvedProps3 = resolveDefaultProps(_type.type, _unresolvedProps3);
        return updateMemoComponent(current$$1, workInProgress, _type, _resolvedProps3, updateExpirationTime, renderExpirationTime2);
      }
      case SimpleMemoComponent: {
        return updateSimpleMemoComponent(current$$1, workInProgress, workInProgress.type, workInProgress.pendingProps, updateExpirationTime, renderExpirationTime2);
      }
      case IncompleteClassComponent: {
        var _Component3 = workInProgress.type;
        var _unresolvedProps4 = workInProgress.pendingProps;
        var _resolvedProps4 = workInProgress.elementType === _Component3 ? _unresolvedProps4 : resolveDefaultProps(_Component3, _unresolvedProps4);
        return mountIncompleteClassComponent(current$$1, workInProgress, _Component3, _resolvedProps4, renderExpirationTime2);
      }
      default:
        invariant(false, "Unknown unit of work tag. This error is likely caused by a bug in React. Please file an issue.");
    }
  }
  function markUpdate(workInProgress) {
    workInProgress.effectTag |= Update;
  }
  function markRef$1(workInProgress) {
    workInProgress.effectTag |= Ref;
  }
  var appendAllChildren = void 0;
  var updateHostContainer = void 0;
  var updateHostComponent$1 = void 0;
  var updateHostText$1 = void 0;
  if (supportsMutation) {
    appendAllChildren = function(parent, workInProgress, needsVisibilityToggle, isHidden) {
      var node = workInProgress.child;
      while (node !== null) {
        if (node.tag === HostComponent || node.tag === HostText) {
          appendInitialChild(parent, node.stateNode);
        } else if (node.tag === HostPortal) {
        } else if (node.child !== null) {
          node.child.return = node;
          node = node.child;
          continue;
        }
        if (node === workInProgress) {
          return;
        }
        while (node.sibling === null) {
          if (node.return === null || node.return === workInProgress) {
            return;
          }
          node = node.return;
        }
        node.sibling.return = node.return;
        node = node.sibling;
      }
    };
    updateHostContainer = function(workInProgress) {
    };
    updateHostComponent$1 = function(current2, workInProgress, type, newProps, rootContainerInstance) {
      var oldProps = current2.memoizedProps;
      if (oldProps === newProps) {
        return;
      }
      var instance = workInProgress.stateNode;
      var currentHostContext = getHostContext();
      var updatePayload = prepareUpdate(instance, type, oldProps, newProps, rootContainerInstance, currentHostContext);
      workInProgress.updateQueue = updatePayload;
      if (updatePayload) {
        markUpdate(workInProgress);
      }
    };
    updateHostText$1 = function(current2, workInProgress, oldText, newText) {
      if (oldText !== newText) {
        markUpdate(workInProgress);
      }
    };
  } else if (supportsPersistence) {
    appendAllChildren = function(parent, workInProgress, needsVisibilityToggle, isHidden) {
      var node = workInProgress.child;
      while (node !== null) {
        branches: if (node.tag === HostComponent) {
          var instance = node.stateNode;
          if (needsVisibilityToggle) {
            var props = node.memoizedProps;
            var type = node.type;
            if (isHidden) {
              instance = cloneHiddenInstance(instance, type, props, node);
            } else {
              instance = cloneUnhiddenInstance(instance, type, props, node);
            }
            node.stateNode = instance;
          }
          appendInitialChild(parent, instance);
        } else if (node.tag === HostText) {
          var _instance = node.stateNode;
          if (needsVisibilityToggle) {
            var text = node.memoizedProps;
            var rootContainerInstance = getRootHostContainer();
            var currentHostContext = getHostContext();
            if (isHidden) {
              _instance = createHiddenTextInstance(text, rootContainerInstance, currentHostContext, workInProgress);
            } else {
              _instance = createTextInstance(text, rootContainerInstance, currentHostContext, workInProgress);
            }
            node.stateNode = _instance;
          }
          appendInitialChild(parent, _instance);
        } else if (node.tag === HostPortal) {
        } else if (node.tag === SuspenseComponent) {
          var current2 = node.alternate;
          if (current2 !== null) {
            var oldState = current2.memoizedState;
            var newState = node.memoizedState;
            var oldIsHidden = oldState !== null;
            var newIsHidden = newState !== null;
            if (oldIsHidden !== newIsHidden) {
              var primaryChildParent = newIsHidden ? node.child : node;
              if (primaryChildParent !== null) {
                appendAllChildren(parent, primaryChildParent, true, newIsHidden);
              }
              break branches;
            }
          }
          if (node.child !== null) {
            node.child.return = node;
            node = node.child;
            continue;
          }
        } else if (node.child !== null) {
          node.child.return = node;
          node = node.child;
          continue;
        }
        node = node;
        if (node === workInProgress) {
          return;
        }
        while (node.sibling === null) {
          if (node.return === null || node.return === workInProgress) {
            return;
          }
          node = node.return;
        }
        node.sibling.return = node.return;
        node = node.sibling;
      }
    };
    var appendAllChildrenToContainer = function(containerChildSet, workInProgress, needsVisibilityToggle, isHidden) {
      var node = workInProgress.child;
      while (node !== null) {
        branches: if (node.tag === HostComponent) {
          var instance = node.stateNode;
          if (needsVisibilityToggle) {
            var props = node.memoizedProps;
            var type = node.type;
            if (isHidden) {
              instance = cloneHiddenInstance(instance, type, props, node);
            } else {
              instance = cloneUnhiddenInstance(instance, type, props, node);
            }
            node.stateNode = instance;
          }
          appendChildToContainerChildSet(containerChildSet, instance);
        } else if (node.tag === HostText) {
          var _instance2 = node.stateNode;
          if (needsVisibilityToggle) {
            var text = node.memoizedProps;
            var rootContainerInstance = getRootHostContainer();
            var currentHostContext = getHostContext();
            if (isHidden) {
              _instance2 = createHiddenTextInstance(text, rootContainerInstance, currentHostContext, workInProgress);
            } else {
              _instance2 = createTextInstance(text, rootContainerInstance, currentHostContext, workInProgress);
            }
            node.stateNode = _instance2;
          }
          appendChildToContainerChildSet(containerChildSet, _instance2);
        } else if (node.tag === HostPortal) {
        } else if (node.tag === SuspenseComponent) {
          var current2 = node.alternate;
          if (current2 !== null) {
            var oldState = current2.memoizedState;
            var newState = node.memoizedState;
            var oldIsHidden = oldState !== null;
            var newIsHidden = newState !== null;
            if (oldIsHidden !== newIsHidden) {
              var primaryChildParent = newIsHidden ? node.child : node;
              if (primaryChildParent !== null) {
                appendAllChildrenToContainer(containerChildSet, primaryChildParent, true, newIsHidden);
              }
              break branches;
            }
          }
          if (node.child !== null) {
            node.child.return = node;
            node = node.child;
            continue;
          }
        } else if (node.child !== null) {
          node.child.return = node;
          node = node.child;
          continue;
        }
        node = node;
        if (node === workInProgress) {
          return;
        }
        while (node.sibling === null) {
          if (node.return === null || node.return === workInProgress) {
            return;
          }
          node = node.return;
        }
        node.sibling.return = node.return;
        node = node.sibling;
      }
    };
    updateHostContainer = function(workInProgress) {
      var portalOrRoot = workInProgress.stateNode;
      var childrenUnchanged = workInProgress.firstEffect === null;
      if (childrenUnchanged) {
      } else {
        var container = portalOrRoot.containerInfo;
        var newChildSet = createContainerChildSet(container);
        appendAllChildrenToContainer(newChildSet, workInProgress, false, false);
        portalOrRoot.pendingChildren = newChildSet;
        markUpdate(workInProgress);
        finalizeContainerChildren(container, newChildSet);
      }
    };
    updateHostComponent$1 = function(current2, workInProgress, type, newProps, rootContainerInstance) {
      var currentInstance = current2.stateNode;
      var oldProps = current2.memoizedProps;
      var childrenUnchanged = workInProgress.firstEffect === null;
      if (childrenUnchanged && oldProps === newProps) {
        workInProgress.stateNode = currentInstance;
        return;
      }
      var recyclableInstance = workInProgress.stateNode;
      var currentHostContext = getHostContext();
      var updatePayload = null;
      if (oldProps !== newProps) {
        updatePayload = prepareUpdate(recyclableInstance, type, oldProps, newProps, rootContainerInstance, currentHostContext);
      }
      if (childrenUnchanged && updatePayload === null) {
        workInProgress.stateNode = currentInstance;
        return;
      }
      var newInstance = cloneInstance(currentInstance, updatePayload, type, oldProps, newProps, workInProgress, childrenUnchanged, recyclableInstance);
      if (finalizeInitialChildren(newInstance, type, newProps, rootContainerInstance, currentHostContext)) {
        markUpdate(workInProgress);
      }
      workInProgress.stateNode = newInstance;
      if (childrenUnchanged) {
        markUpdate(workInProgress);
      } else {
        appendAllChildren(newInstance, workInProgress, false, false);
      }
    };
    updateHostText$1 = function(current2, workInProgress, oldText, newText) {
      if (oldText !== newText) {
        var rootContainerInstance = getRootHostContainer();
        var currentHostContext = getHostContext();
        workInProgress.stateNode = createTextInstance(newText, rootContainerInstance, currentHostContext, workInProgress);
        markUpdate(workInProgress);
      }
    };
  } else {
    updateHostContainer = function(workInProgress) {
    };
    updateHostComponent$1 = function(current2, workInProgress, type, newProps, rootContainerInstance) {
    };
    updateHostText$1 = function(current2, workInProgress, oldText, newText) {
    };
  }
  function completeWork(current2, workInProgress, renderExpirationTime2) {
    var newProps = workInProgress.pendingProps;
    switch (workInProgress.tag) {
      case IndeterminateComponent:
        break;
      case LazyComponent:
        break;
      case SimpleMemoComponent:
      case FunctionComponent:
        break;
      case ClassComponent: {
        var Component = workInProgress.type;
        if (isContextProvider(Component)) {
          popContext(workInProgress);
        }
        break;
      }
      case HostRoot: {
        popHostContainer(workInProgress);
        popTopLevelContextObject(workInProgress);
        var fiberRoot = workInProgress.stateNode;
        if (fiberRoot.pendingContext) {
          fiberRoot.context = fiberRoot.pendingContext;
          fiberRoot.pendingContext = null;
        }
        if (current2 === null || current2.child === null) {
          popHydrationState(workInProgress);
          workInProgress.effectTag &= ~Placement;
        }
        updateHostContainer(workInProgress);
        break;
      }
      case HostComponent: {
        popHostContext(workInProgress);
        var rootContainerInstance = getRootHostContainer();
        var type = workInProgress.type;
        if (current2 !== null && workInProgress.stateNode != null) {
          updateHostComponent$1(current2, workInProgress, type, newProps, rootContainerInstance);
          if (current2.ref !== workInProgress.ref) {
            markRef$1(workInProgress);
          }
        } else {
          if (!newProps) {
            !(workInProgress.stateNode !== null) ? invariant(false, "We must have new props for new mounts. This error is likely caused by a bug in React. Please file an issue.") : void 0;
            break;
          }
          var currentHostContext = getHostContext();
          var wasHydrated = popHydrationState(workInProgress);
          if (wasHydrated) {
            if (prepareToHydrateHostInstance(workInProgress, rootContainerInstance, currentHostContext)) {
              markUpdate(workInProgress);
            }
          } else {
            var instance = createInstance(type, newProps, rootContainerInstance, currentHostContext, workInProgress);
            appendAllChildren(instance, workInProgress, false, false);
            if (finalizeInitialChildren(instance, type, newProps, rootContainerInstance, currentHostContext)) {
              markUpdate(workInProgress);
            }
            workInProgress.stateNode = instance;
          }
          if (workInProgress.ref !== null) {
            markRef$1(workInProgress);
          }
        }
        break;
      }
      case HostText: {
        var newText = newProps;
        if (current2 && workInProgress.stateNode != null) {
          var oldText = current2.memoizedProps;
          updateHostText$1(current2, workInProgress, oldText, newText);
        } else {
          if (typeof newText !== "string") {
            !(workInProgress.stateNode !== null) ? invariant(false, "We must have new props for new mounts. This error is likely caused by a bug in React. Please file an issue.") : void 0;
          }
          var _rootContainerInstance = getRootHostContainer();
          var _currentHostContext = getHostContext();
          var _wasHydrated = popHydrationState(workInProgress);
          if (_wasHydrated) {
            if (prepareToHydrateHostTextInstance(workInProgress)) {
              markUpdate(workInProgress);
            }
          } else {
            workInProgress.stateNode = createTextInstance(newText, _rootContainerInstance, _currentHostContext, workInProgress);
          }
        }
        break;
      }
      case ForwardRef:
        break;
      case SuspenseComponent: {
        var nextState = workInProgress.memoizedState;
        if ((workInProgress.effectTag & DidCapture) !== NoEffect) {
          workInProgress.expirationTime = renderExpirationTime2;
          return workInProgress;
        }
        var nextDidTimeout = nextState !== null;
        var prevDidTimeout = current2 !== null && current2.memoizedState !== null;
        if (current2 !== null && !nextDidTimeout && prevDidTimeout) {
          var currentFallbackChild = current2.child.sibling;
          if (currentFallbackChild !== null) {
            var first = workInProgress.firstEffect;
            if (first !== null) {
              workInProgress.firstEffect = currentFallbackChild;
              currentFallbackChild.nextEffect = first;
            } else {
              workInProgress.firstEffect = workInProgress.lastEffect = currentFallbackChild;
              currentFallbackChild.nextEffect = null;
            }
            currentFallbackChild.effectTag = Deletion;
          }
        }
        if (
          //
          nextDidTimeout !== prevDidTimeout || // Outside concurrent mode, the primary children commit in an
          // inconsistent state, even if they are hidden. So if they are hidden,
          // we need to schedule an effect to re-hide them, just in case.
          (workInProgress.effectTag & ConcurrentMode) === NoContext && nextDidTimeout
        ) {
          workInProgress.effectTag |= Update;
        }
        break;
      }
      case Fragment:
        break;
      case Mode:
        break;
      case Profiler:
        break;
      case HostPortal:
        popHostContainer(workInProgress);
        updateHostContainer(workInProgress);
        break;
      case ContextProvider:
        popProvider(workInProgress);
        break;
      case ContextConsumer:
        break;
      case MemoComponent:
        break;
      case IncompleteClassComponent: {
        var _Component = workInProgress.type;
        if (isContextProvider(_Component)) {
          popContext(workInProgress);
        }
        break;
      }
      default:
        invariant(false, "Unknown unit of work tag. This error is likely caused by a bug in React. Please file an issue.");
    }
    return null;
  }
  function shouldCaptureSuspense(current2, workInProgress) {
    if (workInProgress.memoizedProps.fallback === void 0) {
      return false;
    }
    var nextState = workInProgress.memoizedState;
    return nextState === null;
  }
  function showErrorDialog(capturedError) {
    return true;
  }
  function logCapturedError(capturedError) {
    var logError2 = showErrorDialog(capturedError);
    if (logError2 === false) {
      return;
    }
    var error = capturedError.error;
    {
      var componentName = capturedError.componentName, componentStack = capturedError.componentStack, errorBoundaryName = capturedError.errorBoundaryName, errorBoundaryFound = capturedError.errorBoundaryFound, willRetry = capturedError.willRetry;
      if (error != null && error._suppressLogging) {
        if (errorBoundaryFound && willRetry) {
          return;
        }
        console.error(error);
      }
      var componentNameMessage = componentName ? "The above error occurred in the <" + componentName + "> component:" : "The above error occurred in one of your React components:";
      var errorBoundaryMessage = void 0;
      if (errorBoundaryFound && errorBoundaryName) {
        if (willRetry) {
          errorBoundaryMessage = "React will try to recreate this component tree from scratch " + ("using the error boundary you provided, " + errorBoundaryName + ".");
        } else {
          errorBoundaryMessage = "This error was initially handled by the error boundary " + errorBoundaryName + ".\nRecreating the tree from scratch failed so React will unmount the tree.";
        }
      } else {
        errorBoundaryMessage = "Consider adding an error boundary to your tree to customize error handling behavior.\nVisit https://fb.me/react-error-boundaries to learn more about error boundaries.";
      }
      var combinedMessage = "" + componentNameMessage + componentStack + "\n\n" + ("" + errorBoundaryMessage);
      console.error(combinedMessage);
    }
  }
  var didWarnAboutUndefinedSnapshotBeforeUpdate = null;
  {
    didWarnAboutUndefinedSnapshotBeforeUpdate = /* @__PURE__ */ new Set();
  }
  function logError(boundary, errorInfo) {
    var source = errorInfo.source;
    var stack = errorInfo.stack;
    if (stack === null && source !== null) {
      stack = getStackByFiberInDevAndProd(source);
    }
    var capturedError = {
      componentName: source !== null ? getComponentName(source.type) : null,
      componentStack: stack !== null ? stack : "",
      error: errorInfo.value,
      errorBoundary: null,
      errorBoundaryName: null,
      errorBoundaryFound: false,
      willRetry: false
    };
    if (boundary !== null && boundary.tag === ClassComponent) {
      capturedError.errorBoundary = boundary.stateNode;
      capturedError.errorBoundaryName = getComponentName(boundary.type);
      capturedError.errorBoundaryFound = true;
      capturedError.willRetry = true;
    }
    try {
      logCapturedError(capturedError);
    } catch (e) {
      setTimeout(function() {
        throw e;
      });
    }
  }
  var callComponentWillUnmountWithTimer = function(current$$1, instance) {
    startPhaseTimer(current$$1, "componentWillUnmount");
    instance.props = current$$1.memoizedProps;
    instance.state = current$$1.memoizedState;
    instance.componentWillUnmount();
    stopPhaseTimer();
  };
  function safelyCallComponentWillUnmount(current$$1, instance) {
    {
      invokeGuardedCallback(null, callComponentWillUnmountWithTimer, null, current$$1, instance);
      if (hasCaughtError()) {
        var unmountError = clearCaughtError();
        captureCommitPhaseError(current$$1, unmountError);
      }
    }
  }
  function safelyDetachRef(current$$1) {
    var ref = current$$1.ref;
    if (ref !== null) {
      if (typeof ref === "function") {
        {
          invokeGuardedCallback(null, ref, null, null);
          if (hasCaughtError()) {
            var refError = clearCaughtError();
            captureCommitPhaseError(current$$1, refError);
          }
        }
      } else {
        ref.current = null;
      }
    }
  }
  function safelyCallDestroy(current$$1, destroy) {
    {
      invokeGuardedCallback(null, destroy, null);
      if (hasCaughtError()) {
        var error = clearCaughtError();
        captureCommitPhaseError(current$$1, error);
      }
    }
  }
  function commitBeforeMutationLifeCycles(current$$1, finishedWork) {
    switch (finishedWork.tag) {
      case FunctionComponent:
      case ForwardRef:
      case SimpleMemoComponent: {
        commitHookEffectList(UnmountSnapshot, NoEffect$1, finishedWork);
        return;
      }
      case ClassComponent: {
        if (finishedWork.effectTag & Snapshot) {
          if (current$$1 !== null) {
            var prevProps = current$$1.memoizedProps;
            var prevState = current$$1.memoizedState;
            startPhaseTimer(finishedWork, "getSnapshotBeforeUpdate");
            var instance = finishedWork.stateNode;
            {
              if (finishedWork.type === finishedWork.elementType) {
                !(instance.props === finishedWork.memoizedProps) ? warning$1(false, "Expected instance props to match memoized props before getSnapshotBeforeUpdate. This is likely due to a bug in React. Please file an issue.") : void 0;
                !(instance.state === finishedWork.memoizedState) ? warning$1(false, "Expected instance state to match memoized state before getSnapshotBeforeUpdate. This is likely due to a bug in React. Please file an issue.") : void 0;
              }
            }
            var snapshot = instance.getSnapshotBeforeUpdate(finishedWork.elementType === finishedWork.type ? prevProps : resolveDefaultProps(finishedWork.type, prevProps), prevState);
            {
              var didWarnSet = didWarnAboutUndefinedSnapshotBeforeUpdate;
              if (snapshot === void 0 && !didWarnSet.has(finishedWork.type)) {
                didWarnSet.add(finishedWork.type);
                warningWithoutStack$1(false, "%s.getSnapshotBeforeUpdate(): A snapshot value (or null) must be returned. You have returned undefined.", getComponentName(finishedWork.type));
              }
            }
            instance.__reactInternalSnapshotBeforeUpdate = snapshot;
            stopPhaseTimer();
          }
        }
        return;
      }
      case HostRoot:
      case HostComponent:
      case HostText:
      case HostPortal:
      case IncompleteClassComponent:
        return;
      default: {
        invariant(false, "This unit of work tag should not have side-effects. This error is likely caused by a bug in React. Please file an issue.");
      }
    }
  }
  function commitHookEffectList(unmountTag, mountTag, finishedWork) {
    if (!enableHooks) {
      return;
    }
    var updateQueue = finishedWork.updateQueue;
    var lastEffect = updateQueue !== null ? updateQueue.lastEffect : null;
    if (lastEffect !== null) {
      var firstEffect = lastEffect.next;
      var effect = firstEffect;
      do {
        if ((effect.tag & unmountTag) !== NoEffect$1) {
          var destroy = effect.destroy;
          effect.destroy = null;
          if (destroy !== null) {
            destroy();
          }
        }
        if ((effect.tag & mountTag) !== NoEffect$1) {
          var create = effect.create;
          var _destroy = create();
          if (typeof _destroy !== "function") {
            {
              if (_destroy !== null && _destroy !== void 0) {
                warningWithoutStack$1(false, "useEffect function must return a cleanup function or nothing.%s%s", typeof _destroy.then === "function" ? " Promises and useEffect(async () => ...) are not supported, but you can call an async function inside an effect." : "", getStackByFiberInDevAndProd(finishedWork));
              }
            }
            _destroy = null;
          }
          effect.destroy = _destroy;
        }
        effect = effect.next;
      } while (effect !== firstEffect);
    }
  }
  function commitPassiveHookEffects(finishedWork) {
    commitHookEffectList(UnmountPassive, NoEffect$1, finishedWork);
    commitHookEffectList(NoEffect$1, MountPassive, finishedWork);
  }
  function commitLifeCycles(finishedRoot, current$$1, finishedWork, committedExpirationTime) {
    switch (finishedWork.tag) {
      case FunctionComponent:
      case ForwardRef:
      case SimpleMemoComponent: {
        commitHookEffectList(UnmountLayout, MountLayout, finishedWork);
        break;
      }
      case ClassComponent: {
        var instance = finishedWork.stateNode;
        if (finishedWork.effectTag & Update) {
          if (current$$1 === null) {
            startPhaseTimer(finishedWork, "componentDidMount");
            {
              if (finishedWork.type === finishedWork.elementType) {
                !(instance.props === finishedWork.memoizedProps) ? warning$1(false, "Expected instance props to match memoized props before componentDidMount. This is likely due to a bug in React. Please file an issue.") : void 0;
                !(instance.state === finishedWork.memoizedState) ? warning$1(false, "Expected instance state to match memoized state before componentDidMount. This is likely due to a bug in React. Please file an issue.") : void 0;
              }
            }
            instance.componentDidMount();
            stopPhaseTimer();
          } else {
            var prevProps = finishedWork.elementType === finishedWork.type ? current$$1.memoizedProps : resolveDefaultProps(finishedWork.type, current$$1.memoizedProps);
            var prevState = current$$1.memoizedState;
            startPhaseTimer(finishedWork, "componentDidUpdate");
            {
              if (finishedWork.type === finishedWork.elementType) {
                !(instance.props === finishedWork.memoizedProps) ? warning$1(false, "Expected instance props to match memoized props before componentDidUpdate. This is likely due to a bug in React. Please file an issue.") : void 0;
                !(instance.state === finishedWork.memoizedState) ? warning$1(false, "Expected instance state to match memoized state before componentDidUpdate. This is likely due to a bug in React. Please file an issue.") : void 0;
              }
            }
            instance.componentDidUpdate(prevProps, prevState, instance.__reactInternalSnapshotBeforeUpdate);
            stopPhaseTimer();
          }
        }
        var updateQueue = finishedWork.updateQueue;
        if (updateQueue !== null) {
          {
            if (finishedWork.type === finishedWork.elementType) {
              !(instance.props === finishedWork.memoizedProps) ? warning$1(false, "Expected instance props to match memoized props before processing the update queue. This is likely due to a bug in React. Please file an issue.") : void 0;
              !(instance.state === finishedWork.memoizedState) ? warning$1(false, "Expected instance state to match memoized state before processing the update queue. This is likely due to a bug in React. Please file an issue.") : void 0;
            }
          }
          commitUpdateQueue(finishedWork, updateQueue, instance, committedExpirationTime);
        }
        return;
      }
      case HostRoot: {
        var _updateQueue = finishedWork.updateQueue;
        if (_updateQueue !== null) {
          var _instance = null;
          if (finishedWork.child !== null) {
            switch (finishedWork.child.tag) {
              case HostComponent:
                _instance = getPublicInstance(finishedWork.child.stateNode);
                break;
              case ClassComponent:
                _instance = finishedWork.child.stateNode;
                break;
            }
          }
          commitUpdateQueue(finishedWork, _updateQueue, _instance, committedExpirationTime);
        }
        return;
      }
      case HostComponent: {
        var _instance2 = finishedWork.stateNode;
        if (current$$1 === null && finishedWork.effectTag & Update) {
          var type = finishedWork.type;
          var props = finishedWork.memoizedProps;
          commitMount(_instance2, type, props, finishedWork);
        }
        return;
      }
      case HostText: {
        return;
      }
      case HostPortal: {
        return;
      }
      case Profiler: {
        if (enableProfilerTimer) {
          var onRender = finishedWork.memoizedProps.onRender;
          if (enableSchedulerTracing) {
            onRender(finishedWork.memoizedProps.id, current$$1 === null ? "mount" : "update", finishedWork.actualDuration, finishedWork.treeBaseDuration, finishedWork.actualStartTime, getCommitTime(), finishedRoot.memoizedInteractions);
          } else {
            onRender(finishedWork.memoizedProps.id, current$$1 === null ? "mount" : "update", finishedWork.actualDuration, finishedWork.treeBaseDuration, finishedWork.actualStartTime, getCommitTime());
          }
        }
        return;
      }
      case SuspenseComponent:
        break;
      case IncompleteClassComponent:
        break;
      default: {
        invariant(false, "This unit of work tag should not have side-effects. This error is likely caused by a bug in React. Please file an issue.");
      }
    }
  }
  function hideOrUnhideAllChildren(finishedWork, isHidden) {
    if (supportsMutation) {
      var node = finishedWork;
      while (true) {
        if (node.tag === HostComponent) {
          var instance = node.stateNode;
          if (isHidden) {
            hideInstance(instance);
          } else {
            unhideInstance(node.stateNode, node.memoizedProps);
          }
        } else if (node.tag === HostText) {
          var _instance3 = node.stateNode;
          if (isHidden) {
            hideTextInstance(_instance3);
          } else {
            unhideTextInstance(_instance3, node.memoizedProps);
          }
        } else if (node.tag === SuspenseComponent && node.memoizedState !== null) {
          var fallbackChildFragment = node.child.sibling;
          fallbackChildFragment.return = node;
          node = fallbackChildFragment;
          continue;
        } else if (node.child !== null) {
          node.child.return = node;
          node = node.child;
          continue;
        }
        if (node === finishedWork) {
          return;
        }
        while (node.sibling === null) {
          if (node.return === null || node.return === finishedWork) {
            return;
          }
          node = node.return;
        }
        node.sibling.return = node.return;
        node = node.sibling;
      }
    }
  }
  function commitAttachRef(finishedWork) {
    var ref = finishedWork.ref;
    if (ref !== null) {
      var instance = finishedWork.stateNode;
      var instanceToUse = void 0;
      switch (finishedWork.tag) {
        case HostComponent:
          instanceToUse = getPublicInstance(instance);
          break;
        default:
          instanceToUse = instance;
      }
      if (typeof ref === "function") {
        ref(instanceToUse);
      } else {
        {
          if (!ref.hasOwnProperty("current")) {
            warningWithoutStack$1(false, "Unexpected ref object provided for %s. Use either a ref-setter function or React.createRef().%s", getComponentName(finishedWork.type), getStackByFiberInDevAndProd(finishedWork));
          }
        }
        ref.current = instanceToUse;
      }
    }
  }
  function commitDetachRef(current$$1) {
    var currentRef = current$$1.ref;
    if (currentRef !== null) {
      if (typeof currentRef === "function") {
        currentRef(null);
      } else {
        currentRef.current = null;
      }
    }
  }
  function commitUnmount(current$$1) {
    onCommitUnmount(current$$1);
    switch (current$$1.tag) {
      case FunctionComponent:
      case ForwardRef:
      case MemoComponent:
      case SimpleMemoComponent: {
        var updateQueue = current$$1.updateQueue;
        if (updateQueue !== null) {
          var lastEffect = updateQueue.lastEffect;
          if (lastEffect !== null) {
            var firstEffect = lastEffect.next;
            var effect = firstEffect;
            do {
              var destroy = effect.destroy;
              if (destroy !== null) {
                safelyCallDestroy(current$$1, destroy);
              }
              effect = effect.next;
            } while (effect !== firstEffect);
          }
        }
        break;
      }
      case ClassComponent: {
        safelyDetachRef(current$$1);
        var instance = current$$1.stateNode;
        if (typeof instance.componentWillUnmount === "function") {
          safelyCallComponentWillUnmount(current$$1, instance);
        }
        return;
      }
      case HostComponent: {
        safelyDetachRef(current$$1);
        return;
      }
      case HostPortal: {
        if (supportsMutation) {
          unmountHostComponents(current$$1);
        } else if (supportsPersistence) {
          emptyPortalContainer(current$$1);
        }
        return;
      }
    }
  }
  function commitNestedUnmounts(root2) {
    var node = root2;
    while (true) {
      commitUnmount(node);
      if (node.child !== null && // If we use mutation we drill down into portals using commitUnmount above.
      // If we don't use mutation we drill down into portals here instead.
      (!supportsMutation || node.tag !== HostPortal)) {
        node.child.return = node;
        node = node.child;
        continue;
      }
      if (node === root2) {
        return;
      }
      while (node.sibling === null) {
        if (node.return === null || node.return === root2) {
          return;
        }
        node = node.return;
      }
      node.sibling.return = node.return;
      node = node.sibling;
    }
  }
  function detachFiber(current$$1) {
    current$$1.return = null;
    current$$1.child = null;
    if (current$$1.alternate) {
      current$$1.alternate.child = null;
      current$$1.alternate.return = null;
    }
  }
  function emptyPortalContainer(current$$1) {
    if (!supportsPersistence) {
      return;
    }
    var portal = current$$1.stateNode;
    var containerInfo = portal.containerInfo;
    var emptyChildSet = createContainerChildSet(containerInfo);
    replaceContainerChildren(containerInfo, emptyChildSet);
  }
  function commitContainer(finishedWork) {
    if (!supportsPersistence) {
      return;
    }
    switch (finishedWork.tag) {
      case ClassComponent: {
        return;
      }
      case HostComponent: {
        return;
      }
      case HostText: {
        return;
      }
      case HostRoot:
      case HostPortal: {
        var portalOrRoot = finishedWork.stateNode;
        var containerInfo = portalOrRoot.containerInfo, _pendingChildren = portalOrRoot.pendingChildren;
        replaceContainerChildren(containerInfo, _pendingChildren);
        return;
      }
      default: {
        invariant(false, "This unit of work tag should not have side-effects. This error is likely caused by a bug in React. Please file an issue.");
      }
    }
  }
  function getHostParentFiber(fiber) {
    var parent = fiber.return;
    while (parent !== null) {
      if (isHostParent(parent)) {
        return parent;
      }
      parent = parent.return;
    }
    invariant(false, "Expected to find a host parent. This error is likely caused by a bug in React. Please file an issue.");
  }
  function isHostParent(fiber) {
    return fiber.tag === HostComponent || fiber.tag === HostRoot || fiber.tag === HostPortal;
  }
  function getHostSibling(fiber) {
    var node = fiber;
    siblings: while (true) {
      while (node.sibling === null) {
        if (node.return === null || isHostParent(node.return)) {
          return null;
        }
        node = node.return;
      }
      node.sibling.return = node.return;
      node = node.sibling;
      while (node.tag !== HostComponent && node.tag !== HostText) {
        if (node.effectTag & Placement) {
          continue siblings;
        }
        if (node.child === null || node.tag === HostPortal) {
          continue siblings;
        } else {
          node.child.return = node;
          node = node.child;
        }
      }
      if (!(node.effectTag & Placement)) {
        return node.stateNode;
      }
    }
  }
  function commitPlacement(finishedWork) {
    if (!supportsMutation) {
      return;
    }
    var parentFiber = getHostParentFiber(finishedWork);
    var parent = void 0;
    var isContainer = void 0;
    switch (parentFiber.tag) {
      case HostComponent:
        parent = parentFiber.stateNode;
        isContainer = false;
        break;
      case HostRoot:
        parent = parentFiber.stateNode.containerInfo;
        isContainer = true;
        break;
      case HostPortal:
        parent = parentFiber.stateNode.containerInfo;
        isContainer = true;
        break;
      default:
        invariant(false, "Invalid host parent fiber. This error is likely caused by a bug in React. Please file an issue.");
    }
    if (parentFiber.effectTag & ContentReset) {
      resetTextContent(parent);
      parentFiber.effectTag &= ~ContentReset;
    }
    var before = getHostSibling(finishedWork);
    var node = finishedWork;
    while (true) {
      if (node.tag === HostComponent || node.tag === HostText) {
        if (before) {
          if (isContainer) {
            insertInContainerBefore(parent, node.stateNode, before);
          } else {
            insertBefore(parent, node.stateNode, before);
          }
        } else {
          if (isContainer) {
            appendChildToContainer(parent, node.stateNode);
          } else {
            appendChild(parent, node.stateNode);
          }
        }
      } else if (node.tag === HostPortal) {
      } else if (node.child !== null) {
        node.child.return = node;
        node = node.child;
        continue;
      }
      if (node === finishedWork) {
        return;
      }
      while (node.sibling === null) {
        if (node.return === null || node.return === finishedWork) {
          return;
        }
        node = node.return;
      }
      node.sibling.return = node.return;
      node = node.sibling;
    }
  }
  function unmountHostComponents(current$$1) {
    var node = current$$1;
    var currentParentIsValid = false;
    var currentParent = void 0;
    var currentParentIsContainer = void 0;
    while (true) {
      if (!currentParentIsValid) {
        var parent = node.return;
        findParent: while (true) {
          !(parent !== null) ? invariant(false, "Expected to find a host parent. This error is likely caused by a bug in React. Please file an issue.") : void 0;
          switch (parent.tag) {
            case HostComponent:
              currentParent = parent.stateNode;
              currentParentIsContainer = false;
              break findParent;
            case HostRoot:
              currentParent = parent.stateNode.containerInfo;
              currentParentIsContainer = true;
              break findParent;
            case HostPortal:
              currentParent = parent.stateNode.containerInfo;
              currentParentIsContainer = true;
              break findParent;
          }
          parent = parent.return;
        }
        currentParentIsValid = true;
      }
      if (node.tag === HostComponent || node.tag === HostText) {
        commitNestedUnmounts(node);
        if (currentParentIsContainer) {
          removeChildFromContainer(currentParent, node.stateNode);
        } else {
          removeChild(currentParent, node.stateNode);
        }
      } else if (node.tag === HostPortal) {
        currentParent = node.stateNode.containerInfo;
        currentParentIsContainer = true;
        if (node.child !== null) {
          node.child.return = node;
          node = node.child;
          continue;
        }
      } else {
        commitUnmount(node);
        if (node.child !== null) {
          node.child.return = node;
          node = node.child;
          continue;
        }
      }
      if (node === current$$1) {
        return;
      }
      while (node.sibling === null) {
        if (node.return === null || node.return === current$$1) {
          return;
        }
        node = node.return;
        if (node.tag === HostPortal) {
          currentParentIsValid = false;
        }
      }
      node.sibling.return = node.return;
      node = node.sibling;
    }
  }
  function commitDeletion(current$$1) {
    if (supportsMutation) {
      unmountHostComponents(current$$1);
    } else {
      commitNestedUnmounts(current$$1);
    }
    detachFiber(current$$1);
  }
  function commitWork(current$$1, finishedWork) {
    if (!supportsMutation) {
      switch (finishedWork.tag) {
        case FunctionComponent:
        case ForwardRef:
        case MemoComponent:
        case SimpleMemoComponent: {
          commitHookEffectList(UnmountMutation, MountMutation, finishedWork);
          return;
        }
      }
      commitContainer(finishedWork);
      return;
    }
    switch (finishedWork.tag) {
      case FunctionComponent:
      case ForwardRef:
      case MemoComponent:
      case SimpleMemoComponent: {
        commitHookEffectList(UnmountMutation, MountMutation, finishedWork);
        return;
      }
      case ClassComponent: {
        return;
      }
      case HostComponent: {
        var instance = finishedWork.stateNode;
        if (instance != null) {
          var newProps = finishedWork.memoizedProps;
          var oldProps = current$$1 !== null ? current$$1.memoizedProps : newProps;
          var type = finishedWork.type;
          var updatePayload = finishedWork.updateQueue;
          finishedWork.updateQueue = null;
          if (updatePayload !== null) {
            commitUpdate(instance, updatePayload, type, oldProps, newProps, finishedWork);
          }
        }
        return;
      }
      case HostText: {
        !(finishedWork.stateNode !== null) ? invariant(false, "This should have a text node initialized. This error is likely caused by a bug in React. Please file an issue.") : void 0;
        var textInstance = finishedWork.stateNode;
        var newText = finishedWork.memoizedProps;
        var oldText = current$$1 !== null ? current$$1.memoizedProps : newText;
        commitTextUpdate(textInstance, oldText, newText);
        return;
      }
      case HostRoot: {
        return;
      }
      case Profiler: {
        return;
      }
      case SuspenseComponent: {
        var newState = finishedWork.memoizedState;
        var newDidTimeout = void 0;
        var primaryChildParent = finishedWork;
        if (newState === null) {
          newDidTimeout = false;
        } else {
          newDidTimeout = true;
          primaryChildParent = finishedWork.child;
          if (newState.timedOutAt === NoWork) {
            newState.timedOutAt = requestCurrentTime();
          }
        }
        if (primaryChildParent !== null) {
          hideOrUnhideAllChildren(primaryChildParent, newDidTimeout);
        }
        return;
      }
      case IncompleteClassComponent: {
        return;
      }
      default: {
        invariant(false, "This unit of work tag should not have side-effects. This error is likely caused by a bug in React. Please file an issue.");
      }
    }
  }
  function commitResetTextContent(current$$1) {
    if (!supportsMutation) {
      return;
    }
    resetTextContent(current$$1.stateNode);
  }
  function createRootErrorUpdate(fiber, errorInfo, expirationTime) {
    var update = createUpdate(expirationTime);
    update.tag = CaptureUpdate;
    update.payload = { element: null };
    var error = errorInfo.value;
    update.callback = function() {
      onUncaughtError(error);
      logError(fiber, errorInfo);
    };
    return update;
  }
  function createClassErrorUpdate(fiber, errorInfo, expirationTime) {
    var update = createUpdate(expirationTime);
    update.tag = CaptureUpdate;
    var getDerivedStateFromError = fiber.type.getDerivedStateFromError;
    if (typeof getDerivedStateFromError === "function") {
      var error = errorInfo.value;
      update.payload = function() {
        return getDerivedStateFromError(error);
      };
    }
    var inst = fiber.stateNode;
    if (inst !== null && typeof inst.componentDidCatch === "function") {
      update.callback = function callback() {
        if (typeof getDerivedStateFromError !== "function") {
          markLegacyErrorBoundaryAsFailed(this);
        }
        var error2 = errorInfo.value;
        var stack = errorInfo.stack;
        logError(fiber, errorInfo);
        this.componentDidCatch(error2, {
          componentStack: stack !== null ? stack : ""
        });
        {
          if (typeof getDerivedStateFromError !== "function") {
            !(fiber.expirationTime === Sync) ? warningWithoutStack$1(false, "%s: Error boundaries should implement getDerivedStateFromError(). In that method, return a state update to display an error message or fallback UI.", getComponentName(fiber.type) || "Unknown") : void 0;
          }
        }
      };
    }
    return update;
  }
  function throwException(root2, returnFiber, sourceFiber, value, renderExpirationTime2) {
    sourceFiber.effectTag |= Incomplete;
    sourceFiber.firstEffect = sourceFiber.lastEffect = null;
    if (value !== null && typeof value === "object" && typeof value.then === "function") {
      var thenable = value;
      var _workInProgress = returnFiber;
      var earliestTimeoutMs = -1;
      var startTimeMs = -1;
      do {
        if (_workInProgress.tag === SuspenseComponent) {
          var current$$1 = _workInProgress.alternate;
          if (current$$1 !== null) {
            var currentState = current$$1.memoizedState;
            if (currentState !== null) {
              var timedOutAt = currentState.timedOutAt;
              startTimeMs = expirationTimeToMs(timedOutAt);
              break;
            }
          }
          var timeoutPropMs = _workInProgress.pendingProps.maxDuration;
          if (typeof timeoutPropMs === "number") {
            if (timeoutPropMs <= 0) {
              earliestTimeoutMs = 0;
            } else if (earliestTimeoutMs === -1 || timeoutPropMs < earliestTimeoutMs) {
              earliestTimeoutMs = timeoutPropMs;
            }
          }
        }
        _workInProgress = _workInProgress.return;
      } while (_workInProgress !== null);
      _workInProgress = returnFiber;
      do {
        if (_workInProgress.tag === SuspenseComponent && shouldCaptureSuspense(_workInProgress.alternate, _workInProgress)) {
          var pingTime = (_workInProgress.mode & ConcurrentMode) === NoEffect ? Sync : renderExpirationTime2;
          var onResolveOrReject = retrySuspendedRoot.bind(null, root2, _workInProgress, sourceFiber, pingTime);
          if (enableSchedulerTracing) {
            onResolveOrReject = unstable_wrap(onResolveOrReject);
          }
          thenable.then(onResolveOrReject, onResolveOrReject);
          if ((_workInProgress.mode & ConcurrentMode) === NoEffect) {
            _workInProgress.effectTag |= DidCapture;
            sourceFiber.effectTag &= ~(LifecycleEffectMask | Incomplete);
            if (sourceFiber.tag === ClassComponent) {
              var _current = sourceFiber.alternate;
              if (_current === null) {
                sourceFiber.tag = IncompleteClassComponent;
              }
            }
            sourceFiber.expirationTime = renderExpirationTime2;
            return;
          }
          var absoluteTimeoutMs = void 0;
          if (earliestTimeoutMs === -1) {
            absoluteTimeoutMs = maxSigned31BitInt;
          } else {
            if (startTimeMs === -1) {
              var earliestExpirationTime = findEarliestOutstandingPriorityLevel(root2, renderExpirationTime2);
              var earliestExpirationTimeMs = expirationTimeToMs(earliestExpirationTime);
              startTimeMs = earliestExpirationTimeMs - LOW_PRIORITY_EXPIRATION;
            }
            absoluteTimeoutMs = startTimeMs + earliestTimeoutMs;
          }
          renderDidSuspend(root2, absoluteTimeoutMs, renderExpirationTime2);
          _workInProgress.effectTag |= ShouldCapture;
          _workInProgress.expirationTime = renderExpirationTime2;
          return;
        }
        _workInProgress = _workInProgress.return;
      } while (_workInProgress !== null);
      value = new Error((getComponentName(sourceFiber.type) || "A React component") + " suspended while rendering, but no fallback UI was specified.\n\nAdd a <Suspense fallback=...> component higher in the tree to provide a loading indicator or placeholder to display." + getStackByFiberInDevAndProd(sourceFiber));
    }
    renderDidError();
    value = createCapturedValue(value, sourceFiber);
    var workInProgress = returnFiber;
    do {
      switch (workInProgress.tag) {
        case HostRoot: {
          var _errorInfo = value;
          workInProgress.effectTag |= ShouldCapture;
          workInProgress.expirationTime = renderExpirationTime2;
          var update = createRootErrorUpdate(workInProgress, _errorInfo, renderExpirationTime2);
          enqueueCapturedUpdate(workInProgress, update);
          return;
        }
        case ClassComponent:
          var errorInfo = value;
          var ctor = workInProgress.type;
          var instance = workInProgress.stateNode;
          if ((workInProgress.effectTag & DidCapture) === NoEffect && (typeof ctor.getDerivedStateFromError === "function" || instance !== null && typeof instance.componentDidCatch === "function" && !isAlreadyFailedLegacyErrorBoundary(instance))) {
            workInProgress.effectTag |= ShouldCapture;
            workInProgress.expirationTime = renderExpirationTime2;
            var _update = createClassErrorUpdate(workInProgress, errorInfo, renderExpirationTime2);
            enqueueCapturedUpdate(workInProgress, _update);
            return;
          }
          break;
        default:
          break;
      }
      workInProgress = workInProgress.return;
    } while (workInProgress !== null);
  }
  function unwindWork(workInProgress, renderExpirationTime2) {
    switch (workInProgress.tag) {
      case ClassComponent: {
        var Component = workInProgress.type;
        if (isContextProvider(Component)) {
          popContext(workInProgress);
        }
        var effectTag = workInProgress.effectTag;
        if (effectTag & ShouldCapture) {
          workInProgress.effectTag = effectTag & ~ShouldCapture | DidCapture;
          return workInProgress;
        }
        return null;
      }
      case HostRoot: {
        popHostContainer(workInProgress);
        popTopLevelContextObject(workInProgress);
        var _effectTag = workInProgress.effectTag;
        !((_effectTag & DidCapture) === NoEffect) ? invariant(false, "The root failed to unmount after an error. This is likely a bug in React. Please file an issue.") : void 0;
        workInProgress.effectTag = _effectTag & ~ShouldCapture | DidCapture;
        return workInProgress;
      }
      case HostComponent: {
        popHostContext(workInProgress);
        return null;
      }
      case SuspenseComponent: {
        var _effectTag2 = workInProgress.effectTag;
        if (_effectTag2 & ShouldCapture) {
          workInProgress.effectTag = _effectTag2 & ~ShouldCapture | DidCapture;
          return workInProgress;
        }
        return null;
      }
      case HostPortal:
        popHostContainer(workInProgress);
        return null;
      case ContextProvider:
        popProvider(workInProgress);
        return null;
      default:
        return null;
    }
  }
  function unwindInterruptedWork(interruptedWork) {
    switch (interruptedWork.tag) {
      case ClassComponent: {
        var childContextTypes = interruptedWork.type.childContextTypes;
        if (childContextTypes !== null && childContextTypes !== void 0) {
          popContext(interruptedWork);
        }
        break;
      }
      case HostRoot: {
        popHostContainer(interruptedWork);
        popTopLevelContextObject(interruptedWork);
        break;
      }
      case HostComponent: {
        popHostContext(interruptedWork);
        break;
      }
      case HostPortal:
        popHostContainer(interruptedWork);
        break;
      case ContextProvider:
        popProvider(interruptedWork);
        break;
      default:
        break;
    }
  }
  var Dispatcher = {
    readContext,
    useCallback,
    useContext,
    useEffect,
    useImperativeMethods,
    useLayoutEffect,
    useMemo,
    useMutationEffect,
    useReducer,
    useRef,
    useState
  };
  var DispatcherWithoutHooks = {
    readContext
  };
  var ReactCurrentOwner$2 = ReactSharedInternals.ReactCurrentOwner;
  var didWarnAboutStateTransition = void 0;
  var didWarnSetStateChildContext = void 0;
  var warnAboutUpdateOnUnmounted = void 0;
  var warnAboutInvalidUpdates = void 0;
  if (enableSchedulerTracing) {
    !(__interactionsRef != null && __interactionsRef.current != null) ? invariant(false, "It is not supported to run the profiling version of a renderer (for example, `react-dom/profiling`) without also replacing the `scheduler/tracing` module with `scheduler/tracing-profiling`. Your bundler might have a setting for aliasing both modules. Learn more at http://fb.me/react-profiling") : void 0;
  }
  {
    didWarnAboutStateTransition = false;
    didWarnSetStateChildContext = false;
    var didWarnStateUpdateForUnmountedComponent = {};
    warnAboutUpdateOnUnmounted = function(fiber, isClass) {
      var componentName = getComponentName(fiber.type) || "ReactComponent";
      if (didWarnStateUpdateForUnmountedComponent[componentName]) {
        return;
      }
      warningWithoutStack$1(false, "Can't perform a React state update on an unmounted component. This is a no-op, but it indicates a memory leak in your application. To fix, cancel all subscriptions and asynchronous tasks in %s.%s", isClass ? "the componentWillUnmount method" : "a useEffect cleanup function", getStackByFiberInDevAndProd(fiber));
      didWarnStateUpdateForUnmountedComponent[componentName] = true;
    };
    warnAboutInvalidUpdates = function(instance) {
      switch (phase) {
        case "getChildContext":
          if (didWarnSetStateChildContext) {
            return;
          }
          warningWithoutStack$1(false, "setState(...): Cannot call setState() inside getChildContext()");
          didWarnSetStateChildContext = true;
          break;
        case "render":
          if (didWarnAboutStateTransition) {
            return;
          }
          warningWithoutStack$1(false, "Cannot update during an existing state transition (such as within `render`). Render methods should be a pure function of props and state.");
          didWarnAboutStateTransition = true;
          break;
      }
    };
  }
  var lastUniqueAsyncExpiration = Sync - 1;
  var expirationContext = NoWork;
  var isWorking = false;
  var nextUnitOfWork = null;
  var nextRoot = null;
  var nextRenderExpirationTime = NoWork;
  var nextLatestAbsoluteTimeoutMs = -1;
  var nextRenderDidError = false;
  var nextEffect = null;
  var isCommitting$1 = false;
  var rootWithPendingPassiveEffects = null;
  var passiveEffectCallbackHandle = null;
  var passiveEffectCallback = null;
  var legacyErrorBoundariesThatAlreadyFailed = null;
  var interruptedBy = null;
  var stashedWorkInProgressProperties = void 0;
  var replayUnitOfWork = void 0;
  var mayReplayFailedUnitOfWork = void 0;
  var isReplayingFailedUnitOfWork = void 0;
  var originalReplayError = void 0;
  var rethrowOriginalError = void 0;
  if (replayFailedUnitOfWorkWithInvokeGuardedCallback) {
    stashedWorkInProgressProperties = null;
    mayReplayFailedUnitOfWork = true;
    isReplayingFailedUnitOfWork = false;
    originalReplayError = null;
    replayUnitOfWork = function(failedUnitOfWork, thrownValue, isYieldy) {
      if (thrownValue !== null && typeof thrownValue === "object" && typeof thrownValue.then === "function") {
        return;
      }
      if (stashedWorkInProgressProperties === null) {
        warningWithoutStack$1(false, "Could not replay rendering after an error. This is likely a bug in React. Please file an issue.");
        return;
      }
      assignFiberPropertiesInDEV(failedUnitOfWork, stashedWorkInProgressProperties);
      switch (failedUnitOfWork.tag) {
        case HostRoot:
          popHostContainer(failedUnitOfWork);
          popTopLevelContextObject(failedUnitOfWork);
          break;
        case HostComponent:
          popHostContext(failedUnitOfWork);
          break;
        case ClassComponent: {
          var Component = failedUnitOfWork.type;
          if (isContextProvider(Component)) {
            popContext(failedUnitOfWork);
          }
          break;
        }
        case HostPortal:
          popHostContainer(failedUnitOfWork);
          break;
        case ContextProvider:
          popProvider(failedUnitOfWork);
          break;
      }
      isReplayingFailedUnitOfWork = true;
      originalReplayError = thrownValue;
      invokeGuardedCallback(null, workLoop, null, isYieldy);
      isReplayingFailedUnitOfWork = false;
      originalReplayError = null;
      if (hasCaughtError()) {
        var replayError = clearCaughtError();
        if (replayError != null && thrownValue != null) {
          try {
            if (replayError._suppressLogging) {
              thrownValue._suppressLogging = true;
            }
          } catch (inner) {
          }
        }
      } else {
        nextUnitOfWork = failedUnitOfWork;
      }
    };
    rethrowOriginalError = function() {
      throw originalReplayError;
    };
  }
  function resetStack() {
    if (nextUnitOfWork !== null) {
      var interruptedWork = nextUnitOfWork.return;
      while (interruptedWork !== null) {
        unwindInterruptedWork(interruptedWork);
        interruptedWork = interruptedWork.return;
      }
    }
    {
      ReactStrictModeWarnings.discardPendingWarnings();
      checkThatStackIsEmpty();
    }
    nextRoot = null;
    nextRenderExpirationTime = NoWork;
    nextLatestAbsoluteTimeoutMs = -1;
    nextRenderDidError = false;
    nextUnitOfWork = null;
  }
  function commitAllHostEffects() {
    while (nextEffect !== null) {
      {
        setCurrentFiber(nextEffect);
      }
      recordEffect();
      var effectTag = nextEffect.effectTag;
      if (effectTag & ContentReset) {
        commitResetTextContent(nextEffect);
      }
      if (effectTag & Ref) {
        var current$$1 = nextEffect.alternate;
        if (current$$1 !== null) {
          commitDetachRef(current$$1);
        }
      }
      var primaryEffectTag = effectTag & (Placement | Update | Deletion);
      switch (primaryEffectTag) {
        case Placement: {
          commitPlacement(nextEffect);
          nextEffect.effectTag &= ~Placement;
          break;
        }
        case PlacementAndUpdate: {
          commitPlacement(nextEffect);
          nextEffect.effectTag &= ~Placement;
          var _current = nextEffect.alternate;
          commitWork(_current, nextEffect);
          break;
        }
        case Update: {
          var _current2 = nextEffect.alternate;
          commitWork(_current2, nextEffect);
          break;
        }
        case Deletion: {
          commitDeletion(nextEffect);
          break;
        }
      }
      nextEffect = nextEffect.nextEffect;
    }
    {
      resetCurrentFiber();
    }
  }
  function commitBeforeMutationLifecycles() {
    while (nextEffect !== null) {
      {
        setCurrentFiber(nextEffect);
      }
      var effectTag = nextEffect.effectTag;
      if (effectTag & Snapshot) {
        recordEffect();
        var current$$1 = nextEffect.alternate;
        commitBeforeMutationLifeCycles(current$$1, nextEffect);
      }
      nextEffect = nextEffect.nextEffect;
    }
    {
      resetCurrentFiber();
    }
  }
  function commitAllLifeCycles(finishedRoot, committedExpirationTime) {
    {
      ReactStrictModeWarnings.flushPendingUnsafeLifecycleWarnings();
      ReactStrictModeWarnings.flushLegacyContextWarning();
      if (warnAboutDeprecatedLifecycles) {
        ReactStrictModeWarnings.flushPendingDeprecationWarnings();
      }
    }
    while (nextEffect !== null) {
      var effectTag = nextEffect.effectTag;
      if (effectTag & (Update | Callback)) {
        recordEffect();
        var current$$1 = nextEffect.alternate;
        commitLifeCycles(finishedRoot, current$$1, nextEffect, committedExpirationTime);
      }
      if (effectTag & Ref) {
        recordEffect();
        commitAttachRef(nextEffect);
      }
      if (enableHooks && effectTag & Passive) {
        rootWithPendingPassiveEffects = finishedRoot;
      }
      nextEffect = nextEffect.nextEffect;
    }
  }
  function commitPassiveEffects(root2, firstEffect) {
    rootWithPendingPassiveEffects = null;
    passiveEffectCallbackHandle = null;
    passiveEffectCallback = null;
    var previousIsRendering = isRendering;
    isRendering = true;
    var effect = firstEffect;
    do {
      if (effect.effectTag & Passive) {
        var didError = false;
        var error = void 0;
        {
          invokeGuardedCallback(null, commitPassiveHookEffects, null, effect);
          if (hasCaughtError()) {
            didError = true;
            error = clearCaughtError();
          }
        }
        if (didError) {
          captureCommitPhaseError(effect, error);
        }
      }
      effect = effect.nextEffect;
    } while (effect !== null);
    isRendering = previousIsRendering;
    var rootExpirationTime = root2.expirationTime;
    if (rootExpirationTime !== NoWork) {
      requestWork(root2, rootExpirationTime);
    }
  }
  function isAlreadyFailedLegacyErrorBoundary(instance) {
    return legacyErrorBoundariesThatAlreadyFailed !== null && legacyErrorBoundariesThatAlreadyFailed.has(instance);
  }
  function markLegacyErrorBoundaryAsFailed(instance) {
    if (legacyErrorBoundariesThatAlreadyFailed === null) {
      legacyErrorBoundariesThatAlreadyFailed = /* @__PURE__ */ new Set([instance]);
    } else {
      legacyErrorBoundariesThatAlreadyFailed.add(instance);
    }
  }
  function flushPassiveEffects() {
    if (passiveEffectCallback !== null) {
      unstable_cancelCallback(passiveEffectCallbackHandle);
      passiveEffectCallback();
    }
  }
  function commitRoot(root2, finishedWork) {
    isWorking = true;
    isCommitting$1 = true;
    startCommitTimer();
    !(root2.current !== finishedWork) ? invariant(false, "Cannot commit the same tree as before. This is probably a bug related to the return field. This error is likely caused by a bug in React. Please file an issue.") : void 0;
    var committedExpirationTime = root2.pendingCommitExpirationTime;
    !(committedExpirationTime !== NoWork) ? invariant(false, "Cannot commit an incomplete root. This error is likely caused by a bug in React. Please file an issue.") : void 0;
    root2.pendingCommitExpirationTime = NoWork;
    var updateExpirationTimeBeforeCommit = finishedWork.expirationTime;
    var childExpirationTimeBeforeCommit = finishedWork.childExpirationTime;
    var earliestRemainingTimeBeforeCommit = childExpirationTimeBeforeCommit > updateExpirationTimeBeforeCommit ? childExpirationTimeBeforeCommit : updateExpirationTimeBeforeCommit;
    markCommittedPriorityLevels(root2, earliestRemainingTimeBeforeCommit);
    var prevInteractions = null;
    if (enableSchedulerTracing) {
      prevInteractions = __interactionsRef.current;
      __interactionsRef.current = root2.memoizedInteractions;
    }
    ReactCurrentOwner$2.current = null;
    var firstEffect = void 0;
    if (finishedWork.effectTag > PerformedWork) {
      if (finishedWork.lastEffect !== null) {
        finishedWork.lastEffect.nextEffect = finishedWork;
        firstEffect = finishedWork.firstEffect;
      } else {
        firstEffect = finishedWork;
      }
    } else {
      firstEffect = finishedWork.firstEffect;
    }
    prepareForCommit(root2.containerInfo);
    nextEffect = firstEffect;
    startCommitSnapshotEffectsTimer();
    while (nextEffect !== null) {
      var didError = false;
      var error = void 0;
      {
        invokeGuardedCallback(null, commitBeforeMutationLifecycles, null);
        if (hasCaughtError()) {
          didError = true;
          error = clearCaughtError();
        }
      }
      if (didError) {
        !(nextEffect !== null) ? invariant(false, "Should have next effect. This error is likely caused by a bug in React. Please file an issue.") : void 0;
        captureCommitPhaseError(nextEffect, error);
        if (nextEffect !== null) {
          nextEffect = nextEffect.nextEffect;
        }
      }
    }
    stopCommitSnapshotEffectsTimer();
    if (enableProfilerTimer) {
      recordCommitTime();
    }
    nextEffect = firstEffect;
    startCommitHostEffectsTimer();
    while (nextEffect !== null) {
      var _didError = false;
      var _error = void 0;
      {
        invokeGuardedCallback(null, commitAllHostEffects, null);
        if (hasCaughtError()) {
          _didError = true;
          _error = clearCaughtError();
        }
      }
      if (_didError) {
        !(nextEffect !== null) ? invariant(false, "Should have next effect. This error is likely caused by a bug in React. Please file an issue.") : void 0;
        captureCommitPhaseError(nextEffect, _error);
        if (nextEffect !== null) {
          nextEffect = nextEffect.nextEffect;
        }
      }
    }
    stopCommitHostEffectsTimer();
    resetAfterCommit(root2.containerInfo);
    root2.current = finishedWork;
    nextEffect = firstEffect;
    startCommitLifeCyclesTimer();
    while (nextEffect !== null) {
      var _didError2 = false;
      var _error2 = void 0;
      {
        invokeGuardedCallback(null, commitAllLifeCycles, null, root2, committedExpirationTime);
        if (hasCaughtError()) {
          _didError2 = true;
          _error2 = clearCaughtError();
        }
      }
      if (_didError2) {
        !(nextEffect !== null) ? invariant(false, "Should have next effect. This error is likely caused by a bug in React. Please file an issue.") : void 0;
        captureCommitPhaseError(nextEffect, _error2);
        if (nextEffect !== null) {
          nextEffect = nextEffect.nextEffect;
        }
      }
    }
    if (enableHooks && firstEffect !== null && rootWithPendingPassiveEffects !== null) {
      var callback = commitPassiveEffects.bind(null, root2, firstEffect);
      if (enableSchedulerTracing) {
        callback = unstable_wrap(callback);
      }
      passiveEffectCallbackHandle = unstable_scheduleCallback(callback);
      passiveEffectCallback = callback;
    }
    isCommitting$1 = false;
    isWorking = false;
    stopCommitLifeCyclesTimer();
    stopCommitTimer();
    onCommitRoot(finishedWork.stateNode);
    if (ReactFiberInstrumentation_1.debugTool) {
      ReactFiberInstrumentation_1.debugTool.onCommitWork(finishedWork);
    }
    var updateExpirationTimeAfterCommit = finishedWork.expirationTime;
    var childExpirationTimeAfterCommit = finishedWork.childExpirationTime;
    var earliestRemainingTimeAfterCommit = childExpirationTimeAfterCommit > updateExpirationTimeAfterCommit ? childExpirationTimeAfterCommit : updateExpirationTimeAfterCommit;
    if (earliestRemainingTimeAfterCommit === NoWork) {
      legacyErrorBoundariesThatAlreadyFailed = null;
    }
    onCommit(root2, earliestRemainingTimeAfterCommit);
    if (enableSchedulerTracing) {
      __interactionsRef.current = prevInteractions;
      var subscriber = void 0;
      try {
        subscriber = __subscriberRef.current;
        if (subscriber !== null && root2.memoizedInteractions.size > 0) {
          var threadID = computeThreadID(committedExpirationTime, root2.interactionThreadID);
          subscriber.onWorkStopped(root2.memoizedInteractions, threadID);
        }
      } catch (error2) {
        if (!hasUnhandledError) {
          hasUnhandledError = true;
          unhandledError = error2;
        }
      } finally {
        var pendingInteractionMap = root2.pendingInteractionMap;
        pendingInteractionMap.forEach(function(scheduledInteractions, scheduledExpirationTime) {
          if (scheduledExpirationTime > earliestRemainingTimeAfterCommit) {
            pendingInteractionMap.delete(scheduledExpirationTime);
            scheduledInteractions.forEach(function(interaction) {
              interaction.__count--;
              if (subscriber !== null && interaction.__count === 0) {
                try {
                  subscriber.onInteractionScheduledWorkCompleted(interaction);
                } catch (error2) {
                  if (!hasUnhandledError) {
                    hasUnhandledError = true;
                    unhandledError = error2;
                  }
                }
              }
            });
          }
        });
      }
    }
  }
  function resetChildExpirationTime(workInProgress, renderTime) {
    if (renderTime !== Never && workInProgress.childExpirationTime === Never) {
      return;
    }
    var newChildExpirationTime = NoWork;
    if (enableProfilerTimer && workInProgress.mode & ProfileMode) {
      var actualDuration = workInProgress.actualDuration;
      var treeBaseDuration = workInProgress.selfBaseDuration;
      var shouldBubbleActualDurations = workInProgress.alternate === null || workInProgress.child !== workInProgress.alternate.child;
      var child = workInProgress.child;
      while (child !== null) {
        var childUpdateExpirationTime = child.expirationTime;
        var childChildExpirationTime = child.childExpirationTime;
        if (childUpdateExpirationTime > newChildExpirationTime) {
          newChildExpirationTime = childUpdateExpirationTime;
        }
        if (childChildExpirationTime > newChildExpirationTime) {
          newChildExpirationTime = childChildExpirationTime;
        }
        if (shouldBubbleActualDurations) {
          actualDuration += child.actualDuration;
        }
        treeBaseDuration += child.treeBaseDuration;
        child = child.sibling;
      }
      workInProgress.actualDuration = actualDuration;
      workInProgress.treeBaseDuration = treeBaseDuration;
    } else {
      var _child = workInProgress.child;
      while (_child !== null) {
        var _childUpdateExpirationTime = _child.expirationTime;
        var _childChildExpirationTime = _child.childExpirationTime;
        if (_childUpdateExpirationTime > newChildExpirationTime) {
          newChildExpirationTime = _childUpdateExpirationTime;
        }
        if (_childChildExpirationTime > newChildExpirationTime) {
          newChildExpirationTime = _childChildExpirationTime;
        }
        _child = _child.sibling;
      }
    }
    workInProgress.childExpirationTime = newChildExpirationTime;
  }
  function completeUnitOfWork(workInProgress) {
    while (true) {
      var current$$1 = workInProgress.alternate;
      {
        setCurrentFiber(workInProgress);
      }
      var returnFiber = workInProgress.return;
      var siblingFiber = workInProgress.sibling;
      if ((workInProgress.effectTag & Incomplete) === NoEffect) {
        if (replayFailedUnitOfWorkWithInvokeGuardedCallback) {
          mayReplayFailedUnitOfWork = false;
        }
        nextUnitOfWork = workInProgress;
        if (enableProfilerTimer) {
          if (workInProgress.mode & ProfileMode) {
            startProfilerTimer(workInProgress);
          }
          nextUnitOfWork = completeWork(current$$1, workInProgress, nextRenderExpirationTime);
          if (workInProgress.mode & ProfileMode) {
            stopProfilerTimerIfRunningAndRecordDelta(workInProgress, false);
          }
        } else {
          nextUnitOfWork = completeWork(current$$1, workInProgress, nextRenderExpirationTime);
        }
        if (replayFailedUnitOfWorkWithInvokeGuardedCallback) {
          mayReplayFailedUnitOfWork = true;
        }
        stopWorkTimer(workInProgress);
        resetChildExpirationTime(workInProgress, nextRenderExpirationTime);
        {
          resetCurrentFiber();
        }
        if (nextUnitOfWork !== null) {
          return nextUnitOfWork;
        }
        if (returnFiber !== null && // Do not append effects to parents if a sibling failed to complete
        (returnFiber.effectTag & Incomplete) === NoEffect) {
          if (returnFiber.firstEffect === null) {
            returnFiber.firstEffect = workInProgress.firstEffect;
          }
          if (workInProgress.lastEffect !== null) {
            if (returnFiber.lastEffect !== null) {
              returnFiber.lastEffect.nextEffect = workInProgress.firstEffect;
            }
            returnFiber.lastEffect = workInProgress.lastEffect;
          }
          var effectTag = workInProgress.effectTag;
          if (effectTag > PerformedWork) {
            if (returnFiber.lastEffect !== null) {
              returnFiber.lastEffect.nextEffect = workInProgress;
            } else {
              returnFiber.firstEffect = workInProgress;
            }
            returnFiber.lastEffect = workInProgress;
          }
        }
        if (ReactFiberInstrumentation_1.debugTool) {
          ReactFiberInstrumentation_1.debugTool.onCompleteWork(workInProgress);
        }
        if (siblingFiber !== null) {
          return siblingFiber;
        } else if (returnFiber !== null) {
          workInProgress = returnFiber;
          continue;
        } else {
          return null;
        }
      } else {
        if (enableProfilerTimer && workInProgress.mode & ProfileMode) {
          stopProfilerTimerIfRunningAndRecordDelta(workInProgress, false);
          var actualDuration = workInProgress.actualDuration;
          var child = workInProgress.child;
          while (child !== null) {
            actualDuration += child.actualDuration;
            child = child.sibling;
          }
          workInProgress.actualDuration = actualDuration;
        }
        var next = unwindWork(workInProgress, nextRenderExpirationTime);
        if (workInProgress.effectTag & DidCapture) {
          stopFailedWorkTimer(workInProgress);
        } else {
          stopWorkTimer(workInProgress);
        }
        {
          resetCurrentFiber();
        }
        if (next !== null) {
          stopWorkTimer(workInProgress);
          if (ReactFiberInstrumentation_1.debugTool) {
            ReactFiberInstrumentation_1.debugTool.onCompleteWork(workInProgress);
          }
          next.effectTag &= HostEffectMask;
          return next;
        }
        if (returnFiber !== null) {
          returnFiber.firstEffect = returnFiber.lastEffect = null;
          returnFiber.effectTag |= Incomplete;
        }
        if (ReactFiberInstrumentation_1.debugTool) {
          ReactFiberInstrumentation_1.debugTool.onCompleteWork(workInProgress);
        }
        if (siblingFiber !== null) {
          return siblingFiber;
        } else if (returnFiber !== null) {
          workInProgress = returnFiber;
          continue;
        } else {
          return null;
        }
      }
    }
    return null;
  }
  function performUnitOfWork(workInProgress) {
    var current$$1 = workInProgress.alternate;
    startWorkTimer(workInProgress);
    {
      setCurrentFiber(workInProgress);
    }
    if (replayFailedUnitOfWorkWithInvokeGuardedCallback) {
      stashedWorkInProgressProperties = assignFiberPropertiesInDEV(stashedWorkInProgressProperties, workInProgress);
    }
    var next = void 0;
    if (enableProfilerTimer) {
      if (workInProgress.mode & ProfileMode) {
        startProfilerTimer(workInProgress);
      }
      next = beginWork(current$$1, workInProgress, nextRenderExpirationTime);
      workInProgress.memoizedProps = workInProgress.pendingProps;
      if (workInProgress.mode & ProfileMode) {
        stopProfilerTimerIfRunningAndRecordDelta(workInProgress, true);
      }
    } else {
      next = beginWork(current$$1, workInProgress, nextRenderExpirationTime);
      workInProgress.memoizedProps = workInProgress.pendingProps;
    }
    {
      resetCurrentFiber();
      if (isReplayingFailedUnitOfWork) {
        rethrowOriginalError();
      }
    }
    if (ReactFiberInstrumentation_1.debugTool) {
      ReactFiberInstrumentation_1.debugTool.onBeginWork(workInProgress);
    }
    if (next === null) {
      next = completeUnitOfWork(workInProgress);
    }
    ReactCurrentOwner$2.current = null;
    return next;
  }
  function workLoop(isYieldy) {
    if (!isYieldy) {
      while (nextUnitOfWork !== null) {
        nextUnitOfWork = performUnitOfWork(nextUnitOfWork);
      }
    } else {
      while (nextUnitOfWork !== null && !shouldYieldToRenderer()) {
        nextUnitOfWork = performUnitOfWork(nextUnitOfWork);
      }
    }
  }
  function renderRoot(root2, isYieldy) {
    !!isWorking ? invariant(false, "renderRoot was called recursively. This error is likely caused by a bug in React. Please file an issue.") : void 0;
    flushPassiveEffects();
    isWorking = true;
    if (enableHooks) {
      ReactCurrentOwner$2.currentDispatcher = Dispatcher;
    } else {
      ReactCurrentOwner$2.currentDispatcher = DispatcherWithoutHooks;
    }
    var expirationTime = root2.nextExpirationTimeToWorkOn;
    if (expirationTime !== nextRenderExpirationTime || root2 !== nextRoot || nextUnitOfWork === null) {
      resetStack();
      nextRoot = root2;
      nextRenderExpirationTime = expirationTime;
      nextUnitOfWork = createWorkInProgress(nextRoot.current, null, nextRenderExpirationTime);
      root2.pendingCommitExpirationTime = NoWork;
      if (enableSchedulerTracing) {
        var interactions = /* @__PURE__ */ new Set();
        root2.pendingInteractionMap.forEach(function(scheduledInteractions, scheduledExpirationTime) {
          if (scheduledExpirationTime >= expirationTime) {
            scheduledInteractions.forEach(function(interaction) {
              return interactions.add(interaction);
            });
          }
        });
        root2.memoizedInteractions = interactions;
        if (interactions.size > 0) {
          var subscriber = __subscriberRef.current;
          if (subscriber !== null) {
            var threadID = computeThreadID(expirationTime, root2.interactionThreadID);
            try {
              subscriber.onWorkStarted(interactions, threadID);
            } catch (error) {
              if (!hasUnhandledError) {
                hasUnhandledError = true;
                unhandledError = error;
              }
            }
          }
        }
      }
    }
    var prevInteractions = null;
    if (enableSchedulerTracing) {
      prevInteractions = __interactionsRef.current;
      __interactionsRef.current = root2.memoizedInteractions;
    }
    var didFatal = false;
    startWorkLoopTimer(nextUnitOfWork);
    do {
      try {
        workLoop(isYieldy);
      } catch (thrownValue) {
        resetContextDependences();
        resetHooks();
        var mayReplay = void 0;
        if (replayFailedUnitOfWorkWithInvokeGuardedCallback) {
          mayReplay = mayReplayFailedUnitOfWork;
          mayReplayFailedUnitOfWork = true;
        }
        if (nextUnitOfWork === null) {
          didFatal = true;
          onUncaughtError(thrownValue);
        } else {
          if (enableProfilerTimer && nextUnitOfWork.mode & ProfileMode) {
            stopProfilerTimerIfRunningAndRecordDelta(nextUnitOfWork, true);
          }
          {
            resetCurrentlyProcessingQueue();
          }
          if (replayFailedUnitOfWorkWithInvokeGuardedCallback) {
            if (mayReplay) {
              var failedUnitOfWork = nextUnitOfWork;
              replayUnitOfWork(failedUnitOfWork, thrownValue, isYieldy);
            }
          }
          !(nextUnitOfWork !== null) ? invariant(false, "Failed to replay rendering after an error. This is likely caused by a bug in React. Please file an issue with a reproducing case to help us find it.") : void 0;
          var sourceFiber = nextUnitOfWork;
          var returnFiber = sourceFiber.return;
          if (returnFiber === null) {
            didFatal = true;
            onUncaughtError(thrownValue);
          } else {
            throwException(root2, returnFiber, sourceFiber, thrownValue, nextRenderExpirationTime);
            nextUnitOfWork = completeUnitOfWork(sourceFiber);
            continue;
          }
        }
      }
      break;
    } while (true);
    if (enableSchedulerTracing) {
      __interactionsRef.current = prevInteractions;
    }
    isWorking = false;
    ReactCurrentOwner$2.currentDispatcher = null;
    resetContextDependences();
    resetHooks();
    if (didFatal) {
      var _didCompleteRoot = false;
      stopWorkLoopTimer(interruptedBy, _didCompleteRoot);
      interruptedBy = null;
      {
        resetStackAfterFatalErrorInDev();
      }
      nextRoot = null;
      onFatal(root2);
      return;
    }
    if (nextUnitOfWork !== null) {
      var _didCompleteRoot2 = false;
      stopWorkLoopTimer(interruptedBy, _didCompleteRoot2);
      interruptedBy = null;
      onYield(root2);
      return;
    }
    var didCompleteRoot = true;
    stopWorkLoopTimer(interruptedBy, didCompleteRoot);
    var rootWorkInProgress = root2.current.alternate;
    !(rootWorkInProgress !== null) ? invariant(false, "Finished root should have a work-in-progress. This error is likely caused by a bug in React. Please file an issue.") : void 0;
    nextRoot = null;
    interruptedBy = null;
    if (nextRenderDidError) {
      if (hasLowerPriorityWork(root2, expirationTime)) {
        markSuspendedPriorityLevel(root2, expirationTime);
        var suspendedExpirationTime = expirationTime;
        var rootExpirationTime = root2.expirationTime;
        onSuspend(
          root2,
          rootWorkInProgress,
          suspendedExpirationTime,
          rootExpirationTime,
          -1
          // Indicates no timeout
        );
        return;
      } else if (
        // There's no lower priority work, but we're rendering asynchronously.
        // Synchronsouly attempt to render the same level one more time. This is
        // similar to a suspend, but without a timeout because we're not waiting
        // for a promise to resolve.
        !root2.didError && isYieldy
      ) {
        root2.didError = true;
        var _suspendedExpirationTime = root2.nextExpirationTimeToWorkOn = expirationTime;
        var _rootExpirationTime = root2.expirationTime = Sync;
        onSuspend(
          root2,
          rootWorkInProgress,
          _suspendedExpirationTime,
          _rootExpirationTime,
          -1
          // Indicates no timeout
        );
        return;
      }
    }
    if (isYieldy && nextLatestAbsoluteTimeoutMs !== -1) {
      var _suspendedExpirationTime2 = expirationTime;
      markSuspendedPriorityLevel(root2, _suspendedExpirationTime2);
      var earliestExpirationTime = findEarliestOutstandingPriorityLevel(root2, expirationTime);
      var earliestExpirationTimeMs = expirationTimeToMs(earliestExpirationTime);
      if (earliestExpirationTimeMs < nextLatestAbsoluteTimeoutMs) {
        nextLatestAbsoluteTimeoutMs = earliestExpirationTimeMs;
      }
      var currentTimeMs = expirationTimeToMs(requestCurrentTime());
      var msUntilTimeout = nextLatestAbsoluteTimeoutMs - currentTimeMs;
      msUntilTimeout = msUntilTimeout < 0 ? 0 : msUntilTimeout;
      var _rootExpirationTime2 = root2.expirationTime;
      onSuspend(root2, rootWorkInProgress, _suspendedExpirationTime2, _rootExpirationTime2, msUntilTimeout);
      return;
    }
    onComplete(root2, rootWorkInProgress, expirationTime);
  }
  function captureCommitPhaseError(sourceFiber, value) {
    var expirationTime = Sync;
    var fiber = sourceFiber.return;
    while (fiber !== null) {
      switch (fiber.tag) {
        case ClassComponent:
          var ctor = fiber.type;
          var instance = fiber.stateNode;
          if (typeof ctor.getDerivedStateFromError === "function" || typeof instance.componentDidCatch === "function" && !isAlreadyFailedLegacyErrorBoundary(instance)) {
            var errorInfo = createCapturedValue(value, sourceFiber);
            var update = createClassErrorUpdate(fiber, errorInfo, expirationTime);
            enqueueUpdate(fiber, update);
            scheduleWork(fiber, expirationTime);
            return;
          }
          break;
        case HostRoot: {
          var _errorInfo = createCapturedValue(value, sourceFiber);
          var _update = createRootErrorUpdate(fiber, _errorInfo, expirationTime);
          enqueueUpdate(fiber, _update);
          scheduleWork(fiber, expirationTime);
          return;
        }
      }
      fiber = fiber.return;
    }
    if (sourceFiber.tag === HostRoot) {
      var rootFiber = sourceFiber;
      var _errorInfo2 = createCapturedValue(value, rootFiber);
      var _update2 = createRootErrorUpdate(rootFiber, _errorInfo2, expirationTime);
      enqueueUpdate(rootFiber, _update2);
      scheduleWork(rootFiber, expirationTime);
    }
  }
  function computeThreadID(expirationTime, interactionThreadID) {
    return expirationTime * 1e3 + interactionThreadID;
  }
  function computeUniqueAsyncExpiration() {
    var currentTime = requestCurrentTime();
    var result = computeAsyncExpiration(currentTime);
    if (result >= lastUniqueAsyncExpiration) {
      result = lastUniqueAsyncExpiration - 1;
    }
    lastUniqueAsyncExpiration = result;
    return lastUniqueAsyncExpiration;
  }
  function computeExpirationForFiber(currentTime, fiber) {
    var expirationTime = void 0;
    if (expirationContext !== NoWork) {
      expirationTime = expirationContext;
    } else if (isWorking) {
      if (isCommitting$1) {
        expirationTime = Sync;
      } else {
        expirationTime = nextRenderExpirationTime;
      }
    } else {
      if (fiber.mode & ConcurrentMode) {
        if (isBatchingInteractiveUpdates) {
          expirationTime = computeInteractiveExpiration(currentTime);
        } else {
          expirationTime = computeAsyncExpiration(currentTime);
        }
        if (nextRoot !== null && expirationTime === nextRenderExpirationTime) {
          expirationTime -= 1;
        }
      } else {
        expirationTime = Sync;
      }
    }
    if (isBatchingInteractiveUpdates) {
      if (lowestPriorityPendingInteractiveExpirationTime === NoWork || expirationTime < lowestPriorityPendingInteractiveExpirationTime) {
        lowestPriorityPendingInteractiveExpirationTime = expirationTime;
      }
    }
    return expirationTime;
  }
  function renderDidSuspend(root2, absoluteTimeoutMs, suspendedTime) {
    if (absoluteTimeoutMs >= 0 && nextLatestAbsoluteTimeoutMs < absoluteTimeoutMs) {
      nextLatestAbsoluteTimeoutMs = absoluteTimeoutMs;
    }
  }
  function renderDidError() {
    nextRenderDidError = true;
  }
  function retrySuspendedRoot(root2, boundaryFiber, sourceFiber, suspendedTime) {
    var retryTime = void 0;
    if (isPriorityLevelSuspended(root2, suspendedTime)) {
      retryTime = suspendedTime;
      markPingedPriorityLevel(root2, retryTime);
    } else {
      var currentTime = requestCurrentTime();
      retryTime = computeExpirationForFiber(currentTime, boundaryFiber);
      markPendingPriorityLevel(root2, retryTime);
    }
    if ((boundaryFiber.mode & ConcurrentMode) !== NoContext) {
      if (root2 === nextRoot && nextRenderExpirationTime === suspendedTime) {
        nextRoot = null;
      }
    }
    scheduleWorkToRoot(boundaryFiber, retryTime);
    if ((boundaryFiber.mode & ConcurrentMode) === NoContext) {
      scheduleWorkToRoot(sourceFiber, retryTime);
      var sourceTag = sourceFiber.tag;
      if (sourceTag === ClassComponent && sourceFiber.stateNode !== null) {
        var update = createUpdate(retryTime);
        update.tag = ForceUpdate;
        enqueueUpdate(sourceFiber, update);
      }
    }
    var rootExpirationTime = root2.expirationTime;
    if (rootExpirationTime !== NoWork) {
      requestWork(root2, rootExpirationTime);
    }
  }
  function scheduleWorkToRoot(fiber, expirationTime) {
    recordScheduleUpdate();
    {
      if (fiber.tag === ClassComponent) {
        var instance = fiber.stateNode;
        warnAboutInvalidUpdates(instance);
      }
    }
    if (fiber.expirationTime < expirationTime) {
      fiber.expirationTime = expirationTime;
    }
    var alternate = fiber.alternate;
    if (alternate !== null && alternate.expirationTime < expirationTime) {
      alternate.expirationTime = expirationTime;
    }
    var node = fiber.return;
    var root2 = null;
    if (node === null && fiber.tag === HostRoot) {
      root2 = fiber.stateNode;
    } else {
      while (node !== null) {
        alternate = node.alternate;
        if (node.childExpirationTime < expirationTime) {
          node.childExpirationTime = expirationTime;
          if (alternate !== null && alternate.childExpirationTime < expirationTime) {
            alternate.childExpirationTime = expirationTime;
          }
        } else if (alternate !== null && alternate.childExpirationTime < expirationTime) {
          alternate.childExpirationTime = expirationTime;
        }
        if (node.return === null && node.tag === HostRoot) {
          root2 = node.stateNode;
          break;
        }
        node = node.return;
      }
    }
    if (enableSchedulerTracing) {
      if (root2 !== null) {
        var interactions = __interactionsRef.current;
        if (interactions.size > 0) {
          var pendingInteractionMap = root2.pendingInteractionMap;
          var pendingInteractions = pendingInteractionMap.get(expirationTime);
          if (pendingInteractions != null) {
            interactions.forEach(function(interaction) {
              if (!pendingInteractions.has(interaction)) {
                interaction.__count++;
              }
              pendingInteractions.add(interaction);
            });
          } else {
            pendingInteractionMap.set(expirationTime, new Set(interactions));
            interactions.forEach(function(interaction) {
              interaction.__count++;
            });
          }
          var subscriber = __subscriberRef.current;
          if (subscriber !== null) {
            var threadID = computeThreadID(expirationTime, root2.interactionThreadID);
            subscriber.onWorkScheduled(interactions, threadID);
          }
        }
      }
    }
    return root2;
  }
  function scheduleWork(fiber, expirationTime) {
    var root2 = scheduleWorkToRoot(fiber, expirationTime);
    if (root2 === null) {
      {
        switch (fiber.tag) {
          case ClassComponent:
            warnAboutUpdateOnUnmounted(fiber, true);
            break;
          case FunctionComponent:
          case ForwardRef:
          case MemoComponent:
          case SimpleMemoComponent:
            warnAboutUpdateOnUnmounted(fiber, false);
            break;
        }
      }
      return;
    }
    if (!isWorking && nextRenderExpirationTime !== NoWork && expirationTime > nextRenderExpirationTime) {
      interruptedBy = fiber;
      resetStack();
    }
    markPendingPriorityLevel(root2, expirationTime);
    if (
      // If we're in the render phase, we don't need to schedule this root
      // for an update, because we'll do it before we exit...
      !isWorking || isCommitting$1 || // ...unless this is a different root than the one we're rendering.
      nextRoot !== root2
    ) {
      var rootExpirationTime = root2.expirationTime;
      requestWork(root2, rootExpirationTime);
    }
    if (nestedUpdateCount > NESTED_UPDATE_LIMIT) {
      nestedUpdateCount = 0;
      invariant(false, "Maximum update depth exceeded. This can happen when a component repeatedly calls setState inside componentWillUpdate or componentDidUpdate. React limits the number of nested updates to prevent infinite loops.");
    }
  }
  function syncUpdates(fn, a, b, c, d) {
    var previousExpirationContext = expirationContext;
    expirationContext = Sync;
    try {
      return fn(a, b, c, d);
    } finally {
      expirationContext = previousExpirationContext;
    }
  }
  var firstScheduledRoot = null;
  var lastScheduledRoot = null;
  var callbackExpirationTime = NoWork;
  var callbackID = void 0;
  var isRendering = false;
  var nextFlushedRoot = null;
  var nextFlushedExpirationTime = NoWork;
  var lowestPriorityPendingInteractiveExpirationTime = NoWork;
  var hasUnhandledError = false;
  var unhandledError = null;
  var isBatchingUpdates = false;
  var isUnbatchingUpdates = false;
  var isBatchingInteractiveUpdates = false;
  var completedBatches = null;
  var originalStartTimeMs = unstable_now();
  var currentRendererTime = msToExpirationTime(originalStartTimeMs);
  var currentSchedulerTime = currentRendererTime;
  var NESTED_UPDATE_LIMIT = 50;
  var nestedUpdateCount = 0;
  var lastCommittedRootDuringThisBatch = null;
  function recomputeCurrentRendererTime() {
    var currentTimeMs = unstable_now() - originalStartTimeMs;
    currentRendererTime = msToExpirationTime(currentTimeMs);
  }
  function scheduleCallbackWithExpirationTime(root2, expirationTime) {
    if (callbackExpirationTime !== NoWork) {
      if (expirationTime < callbackExpirationTime) {
        return;
      } else {
        if (callbackID !== null) {
          unstable_cancelCallback(callbackID);
        }
      }
    } else {
      startRequestCallbackTimer();
    }
    callbackExpirationTime = expirationTime;
    var currentMs = unstable_now() - originalStartTimeMs;
    var expirationTimeMs = expirationTimeToMs(expirationTime);
    var timeout = expirationTimeMs - currentMs;
    callbackID = unstable_scheduleCallback(performAsyncWork, { timeout });
  }
  function onFatal(root2) {
    root2.finishedWork = null;
  }
  function onComplete(root2, finishedWork, expirationTime) {
    root2.pendingCommitExpirationTime = expirationTime;
    root2.finishedWork = finishedWork;
  }
  function onSuspend(root2, finishedWork, suspendedExpirationTime, rootExpirationTime, msUntilTimeout) {
    root2.expirationTime = rootExpirationTime;
    if (msUntilTimeout === 0 && !shouldYieldToRenderer()) {
      root2.pendingCommitExpirationTime = suspendedExpirationTime;
      root2.finishedWork = finishedWork;
    } else if (msUntilTimeout > 0) {
      root2.timeoutHandle = scheduleTimeout(onTimeout.bind(null, root2, finishedWork, suspendedExpirationTime), msUntilTimeout);
    }
  }
  function onYield(root2) {
    root2.finishedWork = null;
  }
  function onTimeout(root2, finishedWork, suspendedExpirationTime) {
    root2.pendingCommitExpirationTime = suspendedExpirationTime;
    root2.finishedWork = finishedWork;
    recomputeCurrentRendererTime();
    currentSchedulerTime = currentRendererTime;
    flushRoot(root2, suspendedExpirationTime);
  }
  function onCommit(root2, expirationTime) {
    root2.expirationTime = expirationTime;
    root2.finishedWork = null;
  }
  function requestCurrentTime() {
    if (isRendering) {
      return currentSchedulerTime;
    }
    findHighestPriorityRoot();
    if (nextFlushedExpirationTime === NoWork || nextFlushedExpirationTime === Never) {
      recomputeCurrentRendererTime();
      currentSchedulerTime = currentRendererTime;
      return currentSchedulerTime;
    }
    return currentSchedulerTime;
  }
  function requestWork(root2, expirationTime) {
    addRootToSchedule(root2, expirationTime);
    if (isRendering) {
      return;
    }
    if (isBatchingUpdates) {
      if (isUnbatchingUpdates) {
        nextFlushedRoot = root2;
        nextFlushedExpirationTime = Sync;
        performWorkOnRoot(root2, Sync, false);
      }
      return;
    }
    if (expirationTime === Sync) {
      performSyncWork();
    } else {
      scheduleCallbackWithExpirationTime(root2, expirationTime);
    }
  }
  function addRootToSchedule(root2, expirationTime) {
    if (root2.nextScheduledRoot === null) {
      root2.expirationTime = expirationTime;
      if (lastScheduledRoot === null) {
        firstScheduledRoot = lastScheduledRoot = root2;
        root2.nextScheduledRoot = root2;
      } else {
        lastScheduledRoot.nextScheduledRoot = root2;
        lastScheduledRoot = root2;
        lastScheduledRoot.nextScheduledRoot = firstScheduledRoot;
      }
    } else {
      var remainingExpirationTime2 = root2.expirationTime;
      if (expirationTime > remainingExpirationTime2) {
        root2.expirationTime = expirationTime;
      }
    }
  }
  function findHighestPriorityRoot() {
    var highestPriorityWork = NoWork;
    var highestPriorityRoot = null;
    if (lastScheduledRoot !== null) {
      var previousScheduledRoot = lastScheduledRoot;
      var root2 = firstScheduledRoot;
      while (root2 !== null) {
        var remainingExpirationTime2 = root2.expirationTime;
        if (remainingExpirationTime2 === NoWork) {
          !(previousScheduledRoot !== null && lastScheduledRoot !== null) ? invariant(false, "Should have a previous and last root. This error is likely caused by a bug in React. Please file an issue.") : void 0;
          if (root2 === root2.nextScheduledRoot) {
            root2.nextScheduledRoot = null;
            firstScheduledRoot = lastScheduledRoot = null;
            break;
          } else if (root2 === firstScheduledRoot) {
            var next = root2.nextScheduledRoot;
            firstScheduledRoot = next;
            lastScheduledRoot.nextScheduledRoot = next;
            root2.nextScheduledRoot = null;
          } else if (root2 === lastScheduledRoot) {
            lastScheduledRoot = previousScheduledRoot;
            lastScheduledRoot.nextScheduledRoot = firstScheduledRoot;
            root2.nextScheduledRoot = null;
            break;
          } else {
            previousScheduledRoot.nextScheduledRoot = root2.nextScheduledRoot;
            root2.nextScheduledRoot = null;
          }
          root2 = previousScheduledRoot.nextScheduledRoot;
        } else {
          if (remainingExpirationTime2 > highestPriorityWork) {
            highestPriorityWork = remainingExpirationTime2;
            highestPriorityRoot = root2;
          }
          if (root2 === lastScheduledRoot) {
            break;
          }
          if (highestPriorityWork === Sync) {
            break;
          }
          previousScheduledRoot = root2;
          root2 = root2.nextScheduledRoot;
        }
      }
    }
    nextFlushedRoot = highestPriorityRoot;
    nextFlushedExpirationTime = highestPriorityWork;
  }
  var didYield = false;
  function shouldYieldToRenderer() {
    if (didYield) {
      return true;
    }
    if (unstable_shouldYield()) {
      didYield = true;
      return true;
    }
    return false;
  }
  function performAsyncWork() {
    try {
      if (!shouldYieldToRenderer()) {
        if (firstScheduledRoot !== null) {
          recomputeCurrentRendererTime();
          var root2 = firstScheduledRoot;
          do {
            didExpireAtExpirationTime(root2, currentRendererTime);
            root2 = root2.nextScheduledRoot;
          } while (root2 !== firstScheduledRoot);
        }
      }
      performWork(NoWork, true);
    } finally {
      didYield = false;
    }
  }
  function performSyncWork() {
    performWork(Sync, false);
  }
  function performWork(minExpirationTime, isYieldy) {
    findHighestPriorityRoot();
    if (isYieldy) {
      recomputeCurrentRendererTime();
      currentSchedulerTime = currentRendererTime;
      if (enableUserTimingAPI) {
        var didExpire = nextFlushedExpirationTime > currentRendererTime;
        var timeout = expirationTimeToMs(nextFlushedExpirationTime);
        stopRequestCallbackTimer(didExpire, timeout);
      }
      while (nextFlushedRoot !== null && nextFlushedExpirationTime !== NoWork && minExpirationTime <= nextFlushedExpirationTime && !(didYield && currentRendererTime > nextFlushedExpirationTime)) {
        performWorkOnRoot(nextFlushedRoot, nextFlushedExpirationTime, currentRendererTime > nextFlushedExpirationTime);
        findHighestPriorityRoot();
        recomputeCurrentRendererTime();
        currentSchedulerTime = currentRendererTime;
      }
    } else {
      while (nextFlushedRoot !== null && nextFlushedExpirationTime !== NoWork && minExpirationTime <= nextFlushedExpirationTime) {
        performWorkOnRoot(nextFlushedRoot, nextFlushedExpirationTime, false);
        findHighestPriorityRoot();
      }
    }
    if (isYieldy) {
      callbackExpirationTime = NoWork;
      callbackID = null;
    }
    if (nextFlushedExpirationTime !== NoWork) {
      scheduleCallbackWithExpirationTime(nextFlushedRoot, nextFlushedExpirationTime);
    }
    finishRendering();
  }
  function flushRoot(root2, expirationTime) {
    !!isRendering ? invariant(false, "work.commit(): Cannot commit while already rendering. This likely means you attempted to commit from inside a lifecycle method.") : void 0;
    nextFlushedRoot = root2;
    nextFlushedExpirationTime = expirationTime;
    performWorkOnRoot(root2, expirationTime, false);
    performSyncWork();
  }
  function finishRendering() {
    nestedUpdateCount = 0;
    lastCommittedRootDuringThisBatch = null;
    if (completedBatches !== null) {
      var batches = completedBatches;
      completedBatches = null;
      for (var i = 0; i < batches.length; i++) {
        var batch = batches[i];
        try {
          batch._onComplete();
        } catch (error2) {
          if (!hasUnhandledError) {
            hasUnhandledError = true;
            unhandledError = error2;
          }
        }
      }
    }
    if (hasUnhandledError) {
      var error = unhandledError;
      unhandledError = null;
      hasUnhandledError = false;
      throw error;
    }
  }
  function performWorkOnRoot(root2, expirationTime, isYieldy) {
    !!isRendering ? invariant(false, "performWorkOnRoot was called recursively. This error is likely caused by a bug in React. Please file an issue.") : void 0;
    isRendering = true;
    if (!isYieldy) {
      var finishedWork = root2.finishedWork;
      if (finishedWork !== null) {
        completeRoot(root2, finishedWork, expirationTime);
      } else {
        root2.finishedWork = null;
        var timeoutHandle = root2.timeoutHandle;
        if (timeoutHandle !== noTimeout) {
          root2.timeoutHandle = noTimeout;
          cancelTimeout(timeoutHandle);
        }
        renderRoot(root2, isYieldy);
        finishedWork = root2.finishedWork;
        if (finishedWork !== null) {
          completeRoot(root2, finishedWork, expirationTime);
        }
      }
    } else {
      var _finishedWork = root2.finishedWork;
      if (_finishedWork !== null) {
        completeRoot(root2, _finishedWork, expirationTime);
      } else {
        root2.finishedWork = null;
        var _timeoutHandle = root2.timeoutHandle;
        if (_timeoutHandle !== noTimeout) {
          root2.timeoutHandle = noTimeout;
          cancelTimeout(_timeoutHandle);
        }
        renderRoot(root2, isYieldy);
        _finishedWork = root2.finishedWork;
        if (_finishedWork !== null) {
          if (!shouldYieldToRenderer()) {
            completeRoot(root2, _finishedWork, expirationTime);
          } else {
            root2.finishedWork = _finishedWork;
          }
        }
      }
    }
    isRendering = false;
  }
  function completeRoot(root2, finishedWork, expirationTime) {
    var firstBatch = root2.firstBatch;
    if (firstBatch !== null && firstBatch._expirationTime >= expirationTime) {
      if (completedBatches === null) {
        completedBatches = [firstBatch];
      } else {
        completedBatches.push(firstBatch);
      }
      if (firstBatch._defer) {
        root2.finishedWork = finishedWork;
        root2.expirationTime = NoWork;
        return;
      }
    }
    root2.finishedWork = null;
    if (root2 === lastCommittedRootDuringThisBatch) {
      nestedUpdateCount++;
    } else {
      lastCommittedRootDuringThisBatch = root2;
      nestedUpdateCount = 0;
    }
    commitRoot(root2, finishedWork);
  }
  function onUncaughtError(error) {
    !(nextFlushedRoot !== null) ? invariant(false, "Should be working on a root. This error is likely caused by a bug in React. Please file an issue.") : void 0;
    nextFlushedRoot.expirationTime = NoWork;
    if (!hasUnhandledError) {
      hasUnhandledError = true;
      unhandledError = error;
    }
  }
  function batchedUpdates$1(fn, a) {
    var previousIsBatchingUpdates = isBatchingUpdates;
    isBatchingUpdates = true;
    try {
      return fn(a);
    } finally {
      isBatchingUpdates = previousIsBatchingUpdates;
      if (!isBatchingUpdates && !isRendering) {
        performSyncWork();
      }
    }
  }
  function unbatchedUpdates(fn, a) {
    if (isBatchingUpdates && !isUnbatchingUpdates) {
      isUnbatchingUpdates = true;
      try {
        return fn(a);
      } finally {
        isUnbatchingUpdates = false;
      }
    }
    return fn(a);
  }
  function flushSync2(fn, a) {
    !!isRendering ? invariant(false, "flushSync was called from inside a lifecycle method. It cannot be called when React is already rendering.") : void 0;
    var previousIsBatchingUpdates = isBatchingUpdates;
    isBatchingUpdates = true;
    try {
      return syncUpdates(fn, a);
    } finally {
      isBatchingUpdates = previousIsBatchingUpdates;
      performSyncWork();
    }
  }
  function interactiveUpdates$1(fn, a, b) {
    if (isBatchingInteractiveUpdates) {
      return fn(a, b);
    }
    if (!isBatchingUpdates && !isRendering && lowestPriorityPendingInteractiveExpirationTime !== NoWork) {
      performWork(lowestPriorityPendingInteractiveExpirationTime, false);
      lowestPriorityPendingInteractiveExpirationTime = NoWork;
    }
    var previousIsBatchingInteractiveUpdates = isBatchingInteractiveUpdates;
    var previousIsBatchingUpdates = isBatchingUpdates;
    isBatchingInteractiveUpdates = true;
    isBatchingUpdates = true;
    try {
      return fn(a, b);
    } finally {
      isBatchingInteractiveUpdates = previousIsBatchingInteractiveUpdates;
      isBatchingUpdates = previousIsBatchingUpdates;
      if (!isBatchingUpdates && !isRendering) {
        performSyncWork();
      }
    }
  }
  function flushInteractiveUpdates$1() {
    if (!isRendering && lowestPriorityPendingInteractiveExpirationTime !== NoWork) {
      performWork(lowestPriorityPendingInteractiveExpirationTime, false);
      lowestPriorityPendingInteractiveExpirationTime = NoWork;
    }
  }
  function flushControlled(fn) {
    var previousIsBatchingUpdates = isBatchingUpdates;
    isBatchingUpdates = true;
    try {
      syncUpdates(fn);
    } finally {
      isBatchingUpdates = previousIsBatchingUpdates;
      if (!isBatchingUpdates && !isRendering) {
        performSyncWork();
      }
    }
  }
  var didWarnAboutNestedUpdates = void 0;
  var didWarnAboutFindNodeInStrictMode = void 0;
  {
    didWarnAboutNestedUpdates = false;
    didWarnAboutFindNodeInStrictMode = {};
  }
  function getContextForSubtree(parentComponent) {
    if (!parentComponent) {
      return emptyContextObject;
    }
    var fiber = get(parentComponent);
    var parentContext = findCurrentUnmaskedContext(fiber);
    if (fiber.tag === ClassComponent) {
      var Component = fiber.type;
      if (isContextProvider(Component)) {
        return processChildContext(fiber, Component, parentContext);
      }
    }
    return parentContext;
  }
  function scheduleRootUpdate(current$$1, element, expirationTime, callback) {
    {
      if (phase === "render" && current !== null && !didWarnAboutNestedUpdates) {
        didWarnAboutNestedUpdates = true;
        warningWithoutStack$1(false, "Render methods should be a pure function of props and state; triggering nested component updates from render is not allowed. If necessary, trigger nested updates in componentDidUpdate.\n\nCheck the render method of %s.", getComponentName(current.type) || "Unknown");
      }
    }
    var update = createUpdate(expirationTime);
    update.payload = { element };
    callback = callback === void 0 ? null : callback;
    if (callback !== null) {
      !(typeof callback === "function") ? warningWithoutStack$1(false, "render(...): Expected the last optional `callback` argument to be a function. Instead received: %s.", callback) : void 0;
      update.callback = callback;
    }
    flushPassiveEffects();
    enqueueUpdate(current$$1, update);
    scheduleWork(current$$1, expirationTime);
    return expirationTime;
  }
  function updateContainerAtExpirationTime(element, container, parentComponent, expirationTime, callback) {
    var current$$1 = container.current;
    {
      if (ReactFiberInstrumentation_1.debugTool) {
        if (current$$1.alternate === null) {
          ReactFiberInstrumentation_1.debugTool.onMountContainer(container);
        } else if (element === null) {
          ReactFiberInstrumentation_1.debugTool.onUnmountContainer(container);
        } else {
          ReactFiberInstrumentation_1.debugTool.onUpdateContainer(container);
        }
      }
    }
    var context = getContextForSubtree(parentComponent);
    if (container.context === null) {
      container.context = context;
    } else {
      container.pendingContext = context;
    }
    return scheduleRootUpdate(current$$1, element, expirationTime, callback);
  }
  function findHostInstance(component) {
    var fiber = get(component);
    if (fiber === void 0) {
      if (typeof component.render === "function") {
        invariant(false, "Unable to find node on an unmounted component.");
      } else {
        invariant(false, "Argument appears to not be a ReactComponent. Keys: %s", Object.keys(component));
      }
    }
    var hostFiber = findCurrentHostFiber(fiber);
    if (hostFiber === null) {
      return null;
    }
    return hostFiber.stateNode;
  }
  function findHostInstanceWithWarning(component, methodName) {
    {
      var fiber = get(component);
      if (fiber === void 0) {
        if (typeof component.render === "function") {
          invariant(false, "Unable to find node on an unmounted component.");
        } else {
          invariant(false, "Argument appears to not be a ReactComponent. Keys: %s", Object.keys(component));
        }
      }
      var hostFiber = findCurrentHostFiber(fiber);
      if (hostFiber === null) {
        return null;
      }
      if (hostFiber.mode & StrictMode) {
        var componentName = getComponentName(fiber.type) || "Component";
        if (!didWarnAboutFindNodeInStrictMode[componentName]) {
          didWarnAboutFindNodeInStrictMode[componentName] = true;
          if (fiber.mode & StrictMode) {
            warningWithoutStack$1(false, "%s is deprecated in StrictMode. %s was passed an instance of %s which is inside StrictMode. Instead, add a ref directly to the element you want to reference.\n%s\n\nLearn more about using refs safely here:\nhttps://fb.me/react-strict-mode-find-node", methodName, methodName, componentName, getStackByFiberInDevAndProd(hostFiber));
          } else {
            warningWithoutStack$1(false, "%s is deprecated in StrictMode. %s was passed an instance of %s which renders StrictMode children. Instead, add a ref directly to the element you want to reference.\n%s\n\nLearn more about using refs safely here:\nhttps://fb.me/react-strict-mode-find-node", methodName, methodName, componentName, getStackByFiberInDevAndProd(hostFiber));
          }
        }
      }
      return hostFiber.stateNode;
    }
    return findHostInstance(component);
  }
  function createContainer(containerInfo, isConcurrent, hydrate2) {
    return createFiberRoot(containerInfo, isConcurrent, hydrate2);
  }
  function updateContainer(element, container, parentComponent, callback) {
    var current$$1 = container.current;
    var currentTime = requestCurrentTime();
    var expirationTime = computeExpirationForFiber(currentTime, current$$1);
    return updateContainerAtExpirationTime(element, container, parentComponent, expirationTime, callback);
  }
  function getPublicRootInstance(container) {
    var containerFiber = container.current;
    if (!containerFiber.child) {
      return null;
    }
    switch (containerFiber.child.tag) {
      case HostComponent:
        return getPublicInstance(containerFiber.child.stateNode);
      default:
        return containerFiber.child.stateNode;
    }
  }
  function findHostInstanceWithNoPortals(fiber) {
    var hostFiber = findCurrentHostFiberWithNoPortals(fiber);
    if (hostFiber === null) {
      return null;
    }
    return hostFiber.stateNode;
  }
  function injectIntoDevTools(devToolsConfig) {
    var findFiberByHostInstance = devToolsConfig.findFiberByHostInstance;
    return injectInternals(_assign({}, devToolsConfig, {
      findHostInstanceByFiber: function(fiber) {
        var hostFiber = findCurrentHostFiber(fiber);
        if (hostFiber === null) {
          return null;
        }
        return hostFiber.stateNode;
      },
      findFiberByHostInstance: function(instance) {
        if (!findFiberByHostInstance) {
          return null;
        }
        return findFiberByHostInstance(instance);
      }
    }));
  }
  function createPortal$1(children, containerInfo, implementation) {
    var key = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : null;
    return {
      // This tag allow us to uniquely identify this as a React Portal
      $$typeof: REACT_PORTAL_TYPE,
      key: key == null ? null : "" + key,
      children,
      containerInfo,
      implementation
    };
  }
  var ReactVersion = "16.6.3";
  var ReactCurrentOwner = ReactSharedInternals.ReactCurrentOwner;
  var topLevelUpdateWarnings = void 0;
  var warnOnInvalidCallback = void 0;
  var didWarnAboutUnstableCreatePortal = false;
  {
    if (typeof Map !== "function" || // $FlowIssue Flow incorrectly thinks Map has no prototype
    Map.prototype == null || typeof Map.prototype.forEach !== "function" || typeof Set !== "function" || // $FlowIssue Flow incorrectly thinks Set has no prototype
    Set.prototype == null || typeof Set.prototype.clear !== "function" || typeof Set.prototype.forEach !== "function") {
      warningWithoutStack$1(false, "React depends on Map and Set built-in types. Make sure that you load a polyfill in older browsers. https://fb.me/react-polyfills");
    }
    topLevelUpdateWarnings = function(container) {
      if (container._reactRootContainer && container.nodeType !== COMMENT_NODE) {
        var hostInstance = findHostInstanceWithNoPortals(container._reactRootContainer._internalRoot.current);
        if (hostInstance) {
          !(hostInstance.parentNode === container) ? warningWithoutStack$1(false, "render(...): It looks like the React-rendered content of this container was removed without using React. This is not supported and will cause errors. Instead, call ReactDOM.unmountComponentAtNode to empty a container.") : void 0;
        }
      }
      var isRootRenderedBySomeReact = !!container._reactRootContainer;
      var rootEl = getReactRootElementInContainer(container);
      var hasNonRootReactChild = !!(rootEl && getInstanceFromNode$1(rootEl));
      !(!hasNonRootReactChild || isRootRenderedBySomeReact) ? warningWithoutStack$1(false, "render(...): Replacing React-rendered children with a new root component. If you intended to update the children of this node, you should instead have the existing children update their state and render the new components instead of calling ReactDOM.render.") : void 0;
      !(container.nodeType !== ELEMENT_NODE || !container.tagName || container.tagName.toUpperCase() !== "BODY") ? warningWithoutStack$1(false, "render(): Rendering components directly into document.body is discouraged, since its children are often manipulated by third-party scripts and browser extensions. This may lead to subtle reconciliation issues. Try rendering into a container element created for your app.") : void 0;
    };
    warnOnInvalidCallback = function(callback, callerName) {
      !(callback === null || typeof callback === "function") ? warningWithoutStack$1(false, "%s(...): Expected the last optional `callback` argument to be a function. Instead received: %s.", callerName, callback) : void 0;
    };
  }
  setRestoreImplementation(restoreControlledState$1);
  function ReactBatch(root2) {
    var expirationTime = computeUniqueAsyncExpiration();
    this._expirationTime = expirationTime;
    this._root = root2;
    this._next = null;
    this._callbacks = null;
    this._didComplete = false;
    this._hasChildren = false;
    this._children = null;
    this._defer = true;
  }
  ReactBatch.prototype.render = function(children) {
    !this._defer ? invariant(false, "batch.render: Cannot render a batch that already committed.") : void 0;
    this._hasChildren = true;
    this._children = children;
    var internalRoot = this._root._internalRoot;
    var expirationTime = this._expirationTime;
    var work = new ReactWork();
    updateContainerAtExpirationTime(children, internalRoot, null, expirationTime, work._onCommit);
    return work;
  };
  ReactBatch.prototype.then = function(onComplete2) {
    if (this._didComplete) {
      onComplete2();
      return;
    }
    var callbacks = this._callbacks;
    if (callbacks === null) {
      callbacks = this._callbacks = [];
    }
    callbacks.push(onComplete2);
  };
  ReactBatch.prototype.commit = function() {
    var internalRoot = this._root._internalRoot;
    var firstBatch = internalRoot.firstBatch;
    !(this._defer && firstBatch !== null) ? invariant(false, "batch.commit: Cannot commit a batch multiple times.") : void 0;
    if (!this._hasChildren) {
      this._next = null;
      this._defer = false;
      return;
    }
    var expirationTime = this._expirationTime;
    if (firstBatch !== this) {
      if (this._hasChildren) {
        expirationTime = this._expirationTime = firstBatch._expirationTime;
        this.render(this._children);
      }
      var previous = null;
      var batch = firstBatch;
      while (batch !== this) {
        previous = batch;
        batch = batch._next;
      }
      !(previous !== null) ? invariant(false, "batch.commit: Cannot commit a batch multiple times.") : void 0;
      previous._next = batch._next;
      this._next = firstBatch;
      firstBatch = internalRoot.firstBatch = this;
    }
    this._defer = false;
    flushRoot(internalRoot, expirationTime);
    var next = this._next;
    this._next = null;
    firstBatch = internalRoot.firstBatch = next;
    if (firstBatch !== null && firstBatch._hasChildren) {
      firstBatch.render(firstBatch._children);
    }
  };
  ReactBatch.prototype._onComplete = function() {
    if (this._didComplete) {
      return;
    }
    this._didComplete = true;
    var callbacks = this._callbacks;
    if (callbacks === null) {
      return;
    }
    for (var i = 0; i < callbacks.length; i++) {
      var _callback = callbacks[i];
      _callback();
    }
  };
  function ReactWork() {
    this._callbacks = null;
    this._didCommit = false;
    this._onCommit = this._onCommit.bind(this);
  }
  ReactWork.prototype.then = function(onCommit2) {
    if (this._didCommit) {
      onCommit2();
      return;
    }
    var callbacks = this._callbacks;
    if (callbacks === null) {
      callbacks = this._callbacks = [];
    }
    callbacks.push(onCommit2);
  };
  ReactWork.prototype._onCommit = function() {
    if (this._didCommit) {
      return;
    }
    this._didCommit = true;
    var callbacks = this._callbacks;
    if (callbacks === null) {
      return;
    }
    for (var i = 0; i < callbacks.length; i++) {
      var _callback2 = callbacks[i];
      !(typeof _callback2 === "function") ? invariant(false, "Invalid argument passed as callback. Expected a function. Instead received: %s", _callback2) : void 0;
      _callback2();
    }
  };
  function ReactRoot(container, isConcurrent, hydrate2) {
    var root2 = createContainer(container, isConcurrent, hydrate2);
    this._internalRoot = root2;
  }
  ReactRoot.prototype.render = function(children, callback) {
    var root2 = this._internalRoot;
    var work = new ReactWork();
    callback = callback === void 0 ? null : callback;
    {
      warnOnInvalidCallback(callback, "render");
    }
    if (callback !== null) {
      work.then(callback);
    }
    updateContainer(children, root2, null, work._onCommit);
    return work;
  };
  ReactRoot.prototype.unmount = function(callback) {
    var root2 = this._internalRoot;
    var work = new ReactWork();
    callback = callback === void 0 ? null : callback;
    {
      warnOnInvalidCallback(callback, "render");
    }
    if (callback !== null) {
      work.then(callback);
    }
    updateContainer(null, root2, null, work._onCommit);
    return work;
  };
  ReactRoot.prototype.legacy_renderSubtreeIntoContainer = function(parentComponent, children, callback) {
    var root2 = this._internalRoot;
    var work = new ReactWork();
    callback = callback === void 0 ? null : callback;
    {
      warnOnInvalidCallback(callback, "render");
    }
    if (callback !== null) {
      work.then(callback);
    }
    updateContainer(children, root2, parentComponent, work._onCommit);
    return work;
  };
  ReactRoot.prototype.createBatch = function() {
    var batch = new ReactBatch(this);
    var expirationTime = batch._expirationTime;
    var internalRoot = this._internalRoot;
    var firstBatch = internalRoot.firstBatch;
    if (firstBatch === null) {
      internalRoot.firstBatch = batch;
      batch._next = null;
    } else {
      var insertAfter = null;
      var insertBefore2 = firstBatch;
      while (insertBefore2 !== null && insertBefore2._expirationTime >= expirationTime) {
        insertAfter = insertBefore2;
        insertBefore2 = insertBefore2._next;
      }
      batch._next = insertBefore2;
      if (insertAfter !== null) {
        insertAfter._next = batch;
      }
    }
    return batch;
  };
  function isValidContainer(node) {
    return !!(node && (node.nodeType === ELEMENT_NODE || node.nodeType === DOCUMENT_NODE || node.nodeType === DOCUMENT_FRAGMENT_NODE || node.nodeType === COMMENT_NODE && node.nodeValue === " react-mount-point-unstable "));
  }
  function getReactRootElementInContainer(container) {
    if (!container) {
      return null;
    }
    if (container.nodeType === DOCUMENT_NODE) {
      return container.documentElement;
    } else {
      return container.firstChild;
    }
  }
  function shouldHydrateDueToLegacyHeuristic(container) {
    var rootElement = getReactRootElementInContainer(container);
    return !!(rootElement && rootElement.nodeType === ELEMENT_NODE && rootElement.hasAttribute(ROOT_ATTRIBUTE_NAME));
  }
  setBatchingImplementation(batchedUpdates$1, interactiveUpdates$1, flushInteractiveUpdates$1);
  var warnedAboutHydrateAPI = false;
  function legacyCreateRootFromDOMContainer(container, forceHydrate) {
    var shouldHydrate = forceHydrate || shouldHydrateDueToLegacyHeuristic(container);
    if (!shouldHydrate) {
      var warned = false;
      var rootSibling = void 0;
      while (rootSibling = container.lastChild) {
        {
          if (!warned && rootSibling.nodeType === ELEMENT_NODE && rootSibling.hasAttribute(ROOT_ATTRIBUTE_NAME)) {
            warned = true;
            warningWithoutStack$1(false, "render(): Target node has markup rendered by React, but there are unrelated nodes as well. This is most commonly caused by white-space inserted around server-rendered markup.");
          }
        }
        container.removeChild(rootSibling);
      }
    }
    {
      if (shouldHydrate && !forceHydrate && !warnedAboutHydrateAPI) {
        warnedAboutHydrateAPI = true;
        lowPriorityWarning$1(false, "render(): Calling ReactDOM.render() to hydrate server-rendered markup will stop working in React v17. Replace the ReactDOM.render() call with ReactDOM.hydrate() if you want React to attach to the server HTML.");
      }
    }
    var isConcurrent = false;
    return new ReactRoot(container, isConcurrent, shouldHydrate);
  }
  function legacyRenderSubtreeIntoContainer(parentComponent, children, container, forceHydrate, callback) {
    !isValidContainer(container) ? invariant(false, "Target container is not a DOM element.") : void 0;
    {
      topLevelUpdateWarnings(container);
    }
    var root2 = container._reactRootContainer;
    if (!root2) {
      root2 = container._reactRootContainer = legacyCreateRootFromDOMContainer(container, forceHydrate);
      if (typeof callback === "function") {
        var originalCallback = callback;
        callback = function() {
          var instance = getPublicRootInstance(root2._internalRoot);
          originalCallback.call(instance);
        };
      }
      unbatchedUpdates(function() {
        if (parentComponent != null) {
          root2.legacy_renderSubtreeIntoContainer(parentComponent, children, callback);
        } else {
          root2.render(children, callback);
        }
      });
    } else {
      if (typeof callback === "function") {
        var _originalCallback = callback;
        callback = function() {
          var instance = getPublicRootInstance(root2._internalRoot);
          _originalCallback.call(instance);
        };
      }
      if (parentComponent != null) {
        root2.legacy_renderSubtreeIntoContainer(parentComponent, children, callback);
      } else {
        root2.render(children, callback);
      }
    }
    return getPublicRootInstance(root2._internalRoot);
  }
  function createPortal2(children, container) {
    var key = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : null;
    !isValidContainer(container) ? invariant(false, "Target container is not a DOM element.") : void 0;
    return createPortal$1(children, container, null, key);
  }
  var ReactDOM2 = {
    createPortal: createPortal2,
    findDOMNode: function(componentOrElement) {
      {
        var owner = ReactCurrentOwner.current;
        if (owner !== null && owner.stateNode !== null) {
          var warnedAboutRefsInRender = owner.stateNode._warnedAboutRefsInRender;
          !warnedAboutRefsInRender ? warningWithoutStack$1(false, "%s is accessing findDOMNode inside its render(). render() should be a pure function of props and state. It should never access something that requires stale data from the previous render, such as refs. Move this logic to componentDidMount and componentDidUpdate instead.", getComponentName(owner.type) || "A component") : void 0;
          owner.stateNode._warnedAboutRefsInRender = true;
        }
      }
      if (componentOrElement == null) {
        return null;
      }
      if (componentOrElement.nodeType === ELEMENT_NODE) {
        return componentOrElement;
      }
      {
        return findHostInstanceWithWarning(componentOrElement, "findDOMNode");
      }
      return findHostInstance(componentOrElement);
    },
    hydrate: function(element, container, callback) {
      return legacyRenderSubtreeIntoContainer(null, element, container, true, callback);
    },
    render: function(element, container, callback) {
      return legacyRenderSubtreeIntoContainer(null, element, container, false, callback);
    },
    unstable_renderSubtreeIntoContainer: function(parentComponent, element, containerNode, callback) {
      !(parentComponent != null && has(parentComponent)) ? invariant(false, "parentComponent must be a valid React Component") : void 0;
      return legacyRenderSubtreeIntoContainer(parentComponent, element, containerNode, false, callback);
    },
    unmountComponentAtNode: function(container) {
      !isValidContainer(container) ? invariant(false, "unmountComponentAtNode(...): Target container is not a DOM element.") : void 0;
      if (container._reactRootContainer) {
        {
          var rootEl = getReactRootElementInContainer(container);
          var renderedByDifferentReact = rootEl && !getInstanceFromNode$1(rootEl);
          !!renderedByDifferentReact ? warningWithoutStack$1(false, "unmountComponentAtNode(): The node you're attempting to unmount was rendered by another copy of React.") : void 0;
        }
        unbatchedUpdates(function() {
          legacyRenderSubtreeIntoContainer(null, null, container, false, function() {
            container._reactRootContainer = null;
          });
        });
        return true;
      } else {
        {
          var _rootEl = getReactRootElementInContainer(container);
          var hasNonRootReactChild = !!(_rootEl && getInstanceFromNode$1(_rootEl));
          var isContainerReactRoot = container.nodeType === ELEMENT_NODE && isValidContainer(container.parentNode) && !!container.parentNode._reactRootContainer;
          !!hasNonRootReactChild ? warningWithoutStack$1(false, "unmountComponentAtNode(): The node you're attempting to unmount was rendered by React and is not a top-level container. %s", isContainerReactRoot ? "You may have accidentally passed in a React root node instead of its container." : "Instead, have the parent component update its state and rerender in order to remove this component.") : void 0;
        }
        return false;
      }
    },
    // Temporary alias since we already shipped React 16 RC with it.
    // TODO: remove in React 17.
    unstable_createPortal: function() {
      if (!didWarnAboutUnstableCreatePortal) {
        didWarnAboutUnstableCreatePortal = true;
        lowPriorityWarning$1(false, 'The ReactDOM.unstable_createPortal() alias has been deprecated, and will be removed in React 17+. Update your code to use ReactDOM.createPortal() instead. It has the exact same API, but without the "unstable_" prefix.');
      }
      return createPortal2.apply(void 0, arguments);
    },
    unstable_batchedUpdates: batchedUpdates$1,
    unstable_interactiveUpdates: interactiveUpdates$1,
    flushSync: flushSync2,
    unstable_flushControlled: flushControlled,
    __SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED: {
      // Keep in sync with ReactDOMUnstableNativeDependencies.js
      // and ReactTestUtils.js. This is an array for better minification.
      Events: [getInstanceFromNode$1, getNodeFromInstance$1, getFiberCurrentPropsFromNode$1, injection.injectEventPluginsByName, eventNameDispatchConfigs, accumulateTwoPhaseDispatches, accumulateDirectDispatches, enqueueStateRestore, restoreStateIfNeeded, dispatchEvent, runEventsInBatch]
    }
  };
  function createRoot(container, options) {
    var functionName = enableStableConcurrentModeAPIs ? "createRoot" : "unstable_createRoot";
    !isValidContainer(container) ? invariant(false, "%s(...): Target container is not a DOM element.", functionName) : void 0;
    var hydrate2 = options != null && options.hydrate === true;
    return new ReactRoot(container, true, hydrate2);
  }
  if (enableStableConcurrentModeAPIs) {
    ReactDOM2.createRoot = createRoot;
  } else {
    ReactDOM2.unstable_createRoot = createRoot;
  }
  var foundDevTools = injectIntoDevTools({
    findFiberByHostInstance: getClosestInstanceFromNode,
    bundleType: 1,
    version: ReactVersion,
    rendererPackageName: "react-dom"
  });
  {
    if (!foundDevTools && canUseDOM && window.top === window.self) {
      if (navigator.userAgent.indexOf("Chrome") > -1 && navigator.userAgent.indexOf("Edge") === -1 || navigator.userAgent.indexOf("Firefox") > -1) {
        var protocol = window.location.protocol;
        if (/^(https?|file):$/.test(protocol)) {
          console.info("%cDownload the React DevTools for a better development experience: https://fb.me/react-devtools" + (protocol === "file:" ? "\nYou might need to use a local HTTP server (instead of file://): https://fb.me/react-devtools-faq" : ""), "font-weight:bold");
        }
      }
    }
  }
  var ReactDOM$2 = Object.freeze({
    default: ReactDOM2
  });
  var ReactDOM$3 = ReactDOM$2 && ReactDOM2 || ReactDOM$2;
  var reactDom = ReactDOM$3.default || ReactDOM$3;
  return reactDom;
}(React);
const { createPortal, findDOMNode, hydrate, render, unstable_renderSubtreeIntoContainer, unmountComponentAtNode, unstable_createPortal, unstable_batchedUpdates, unstable_interactiveUpdates, flushSync, unstable_flushControlled, __SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED, unstable_createRoot } = ReactDOM;
export default ReactDOM;
export { createPortal, findDOMNode, hydrate, render, unstable_renderSubtreeIntoContainer, unmountComponentAtNode, unstable_createPortal, unstable_batchedUpdates, unstable_interactiveUpdates, flushSync, unstable_flushControlled, __SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED, unstable_createRoot };