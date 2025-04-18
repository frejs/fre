/** @license React v16.0.0
 * react.development.js
 *
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
const React = function() {
  "use strict";
  var ReactVersion = "16.6.3";
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
  var enableHooks = false;
  var enableSchedulerTracing = true;
  var enableStableConcurrentModeAPIs = false;
  /*
  object-assign
  (c) Sindre Sorhus
  @license MIT
  */
  var getOwnPropertySymbols = Object.getOwnPropertySymbols;
  var hasOwnProperty = Object.prototype.hasOwnProperty;
  var propIsEnumerable = Object.prototype.propertyIsEnumerable;
  function toObject(val) {
    if (val === null || val === void 0) {
      throw new TypeError("Object.assign cannot be called with null or undefined");
    }
    return Object(val);
  }
  function shouldUseNative() {
    try {
      if (!Object.assign) {
        return false;
      }
      var test1 = new String("abc");
      test1[5] = "de";
      if (Object.getOwnPropertyNames(test1)[0] === "5") {
        return false;
      }
      var test2 = {};
      for (var i = 0; i < 10; i++) {
        test2["_" + String.fromCharCode(i)] = i;
      }
      var order2 = Object.getOwnPropertyNames(test2).map(function(n) {
        return test2[n];
      });
      if (order2.join("") !== "0123456789") {
        return false;
      }
      var test3 = {};
      "abcdefghijklmnopqrst".split("").forEach(function(letter) {
        test3[letter] = letter;
      });
      if (Object.keys(Object.assign({}, test3)).join("") !== "abcdefghijklmnopqrst") {
        return false;
      }
      return true;
    } catch (err) {
      return false;
    }
  }
  var objectAssign = shouldUseNative() ? Object.assign : function(target, source) {
    var from;
    var to = toObject(target);
    var symbols;
    for (var s = 1; s < arguments.length; s++) {
      from = Object(arguments[s]);
      for (var key in from) {
        if (hasOwnProperty.call(from, key)) {
          to[key] = from[key];
        }
      }
      if (getOwnPropertySymbols) {
        symbols = getOwnPropertySymbols(from);
        for (var i = 0; i < symbols.length; i++) {
          if (propIsEnumerable.call(from, symbols[i])) {
            to[symbols[i]] = from[symbols[i]];
          }
        }
      }
    }
    return to;
  };
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
  var lowPriorityWarning = function() {
  };
  {
    var printWarning = function(format) {
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
        printWarning.apply(void 0, [format].concat(args));
      }
    };
  }
  var lowPriorityWarning$1 = lowPriorityWarning;
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
  var didWarnStateUpdateForUnmountedComponent = {};
  function warnNoop(publicInstance, callerName) {
    {
      var _constructor = publicInstance.constructor;
      var componentName = _constructor && (_constructor.displayName || _constructor.name) || "ReactClass";
      var warningKey = componentName + "." + callerName;
      if (didWarnStateUpdateForUnmountedComponent[warningKey]) {
        return;
      }
      warningWithoutStack$1(false, "Can't call %s on a component that is not yet mounted. This is a no-op, but it might indicate a bug in your application. Instead, assign to `this.state` directly or define a `state = {};` class property with the desired state in the %s component.", callerName, componentName);
      didWarnStateUpdateForUnmountedComponent[warningKey] = true;
    }
  }
  var ReactNoopUpdateQueue = {
    /**
     * Checks whether or not this composite component is mounted.
     * @param {ReactClass} publicInstance The instance we want to test.
     * @return {boolean} True if mounted, false otherwise.
     * @protected
     * @final
     */
    isMounted: function(publicInstance) {
      return false;
    },
    /**
     * Forces an update. This should only be invoked when it is known with
     * certainty that we are **not** in a DOM transaction.
     *
     * You may want to call this when you know that some deeper aspect of the
     * component's state has changed but `setState` was not called.
     *
     * This will not invoke `shouldComponentUpdate`, but it will invoke
     * `componentWillUpdate` and `componentDidUpdate`.
     *
     * @param {ReactClass} publicInstance The instance that should rerender.
     * @param {?function} callback Called after component is updated.
     * @param {?string} callerName name of the calling function in the public API.
     * @internal
     */
    enqueueForceUpdate: function(publicInstance, callback, callerName) {
      warnNoop(publicInstance, "forceUpdate");
    },
    /**
     * Replaces all of the state. Always use this or `setState` to mutate state.
     * You should treat `this.state` as immutable.
     *
     * There is no guarantee that `this.state` will be immediately updated, so
     * accessing `this.state` after calling this method may return the old value.
     *
     * @param {ReactClass} publicInstance The instance that should rerender.
     * @param {object} completeState Next state.
     * @param {?function} callback Called after component is updated.
     * @param {?string} callerName name of the calling function in the public API.
     * @internal
     */
    enqueueReplaceState: function(publicInstance, completeState, callback, callerName) {
      warnNoop(publicInstance, "replaceState");
    },
    /**
     * Sets a subset of the state. This only exists because _pendingState is
     * internal. This provides a merging strategy that is not available to deep
     * properties which is confusing. TODO: Expose pendingState or don't use it
     * during the merge.
     *
     * @param {ReactClass} publicInstance The instance that should rerender.
     * @param {object} partialState Next partial state to be merged with state.
     * @param {?function} callback Called after component is updated.
     * @param {?string} Name of the calling function in the public API.
     * @internal
     */
    enqueueSetState: function(publicInstance, partialState, callback, callerName) {
      warnNoop(publicInstance, "setState");
    }
  };
  var emptyObject = {};
  {
    Object.freeze(emptyObject);
  }
  function Component2(props, context, updater) {
    this.props = props;
    this.context = context;
    this.refs = emptyObject;
    this.updater = updater || ReactNoopUpdateQueue;
  }
  Component2.prototype.isReactComponent = {};
  Component2.prototype.setState = function(partialState, callback) {
    !(typeof partialState === "object" || typeof partialState === "function" || partialState == null) ? invariant(false, "setState(...): takes an object of state variables to update or a function which returns an object of state variables.") : void 0;
    this.updater.enqueueSetState(this, partialState, callback, "setState");
  };
  Component2.prototype.forceUpdate = function(callback) {
    this.updater.enqueueForceUpdate(this, callback, "forceUpdate");
  };
  {
    var deprecatedAPIs = {
      isMounted: ["isMounted", "Instead, make sure to clean up subscriptions and pending requests in componentWillUnmount to prevent memory leaks."],
      replaceState: ["replaceState", "Refactor your code to use setState instead (see https://github.com/facebook/react/issues/3236)."]
    };
    var defineDeprecationWarning = function(methodName, info) {
      Object.defineProperty(Component2.prototype, methodName, {
        get: function() {
          lowPriorityWarning$1(false, "%s(...) is deprecated in plain JavaScript React classes. %s", info[0], info[1]);
          return void 0;
        }
      });
    };
    for (var fnName in deprecatedAPIs) {
      if (deprecatedAPIs.hasOwnProperty(fnName)) {
        defineDeprecationWarning(fnName, deprecatedAPIs[fnName]);
      }
    }
  }
  function ComponentDummy() {
  }
  ComponentDummy.prototype = Component2.prototype;
  function PureComponent2(props, context, updater) {
    this.props = props;
    this.context = context;
    this.refs = emptyObject;
    this.updater = updater || ReactNoopUpdateQueue;
  }
  var pureComponentPrototype = PureComponent2.prototype = new ComponentDummy();
  pureComponentPrototype.constructor = PureComponent2;
  objectAssign(pureComponentPrototype, Component2.prototype);
  pureComponentPrototype.isPureReactComponent = true;
  function createRef2() {
    var refObject = {
      current: null
    };
    {
      Object.seal(refObject);
    }
    return refObject;
  }
  var ImmediatePriority = 1;
  var UserBlockingPriority = 2;
  var NormalPriority = 3;
  var LowPriority = 4;
  var IdlePriority = 5;
  var maxSigned31BitInt = 1073741823;
  var IMMEDIATE_PRIORITY_TIMEOUT = -1;
  var USER_BLOCKING_PRIORITY = 250;
  var NORMAL_PRIORITY_TIMEOUT = 5e3;
  var LOW_PRIORITY_TIMEOUT = 1e4;
  var IDLE_PRIORITY = maxSigned31BitInt;
  var firstCallbackNode = null;
  var currentDidTimeout = false;
  var currentPriorityLevel = NormalPriority;
  var currentEventStartTime = -1;
  var currentExpirationTime = -1;
  var isExecutingCallback = false;
  var isHostCallbackScheduled = false;
  var hasNativePerformanceNow = typeof performance === "object" && typeof performance.now === "function";
  function ensureHostCallbackIsScheduled() {
    if (isExecutingCallback) {
      return;
    }
    var expirationTime = firstCallbackNode.expirationTime;
    if (!isHostCallbackScheduled) {
      isHostCallbackScheduled = true;
    } else {
      cancelHostCallback();
    }
    requestHostCallback(flushWork, expirationTime);
  }
  function flushFirstCallback() {
    var flushedNode = firstCallbackNode;
    var next = firstCallbackNode.next;
    if (firstCallbackNode === next) {
      firstCallbackNode = null;
      next = null;
    } else {
      var lastCallbackNode = firstCallbackNode.previous;
      firstCallbackNode = lastCallbackNode.next = next;
      next.previous = lastCallbackNode;
    }
    flushedNode.next = flushedNode.previous = null;
    var callback = flushedNode.callback;
    var expirationTime = flushedNode.expirationTime;
    var priorityLevel = flushedNode.priorityLevel;
    var previousPriorityLevel = currentPriorityLevel;
    var previousExpirationTime = currentExpirationTime;
    currentPriorityLevel = priorityLevel;
    currentExpirationTime = expirationTime;
    var continuationCallback;
    try {
      continuationCallback = callback();
    } finally {
      currentPriorityLevel = previousPriorityLevel;
      currentExpirationTime = previousExpirationTime;
    }
    if (typeof continuationCallback === "function") {
      var continuationNode = {
        callback: continuationCallback,
        priorityLevel,
        expirationTime,
        next: null,
        previous: null
      };
      if (firstCallbackNode === null) {
        firstCallbackNode = continuationNode.next = continuationNode.previous = continuationNode;
      } else {
        var nextAfterContinuation = null;
        var node = firstCallbackNode;
        do {
          if (node.expirationTime >= expirationTime) {
            nextAfterContinuation = node;
            break;
          }
          node = node.next;
        } while (node !== firstCallbackNode);
        if (nextAfterContinuation === null) {
          nextAfterContinuation = firstCallbackNode;
        } else if (nextAfterContinuation === firstCallbackNode) {
          firstCallbackNode = continuationNode;
          ensureHostCallbackIsScheduled();
        }
        var previous = nextAfterContinuation.previous;
        previous.next = nextAfterContinuation.previous = continuationNode;
        continuationNode.next = nextAfterContinuation;
        continuationNode.previous = previous;
      }
    }
  }
  function flushImmediateWork() {
    if (
      // Confirm we've exited the outer most event handler
      currentEventStartTime === -1 && firstCallbackNode !== null && firstCallbackNode.priorityLevel === ImmediatePriority
    ) {
      isExecutingCallback = true;
      try {
        do {
          flushFirstCallback();
        } while (
          // Keep flushing until there are no more immediate callbacks
          firstCallbackNode !== null && firstCallbackNode.priorityLevel === ImmediatePriority
        );
      } finally {
        isExecutingCallback = false;
        if (firstCallbackNode !== null) {
          ensureHostCallbackIsScheduled();
        } else {
          isHostCallbackScheduled = false;
        }
      }
    }
  }
  function flushWork(didTimeout) {
    isExecutingCallback = true;
    var previousDidTimeout = currentDidTimeout;
    currentDidTimeout = didTimeout;
    try {
      if (didTimeout) {
        while (firstCallbackNode !== null) {
          var currentTime = getCurrentTime();
          if (firstCallbackNode.expirationTime <= currentTime) {
            do {
              flushFirstCallback();
            } while (firstCallbackNode !== null && firstCallbackNode.expirationTime <= currentTime);
            continue;
          }
          break;
        }
      } else {
        if (firstCallbackNode !== null) {
          do {
            flushFirstCallback();
          } while (firstCallbackNode !== null && !shouldYieldToHost());
        }
      }
    } finally {
      isExecutingCallback = false;
      currentDidTimeout = previousDidTimeout;
      if (firstCallbackNode !== null) {
        ensureHostCallbackIsScheduled();
      } else {
        isHostCallbackScheduled = false;
      }
      flushImmediateWork();
    }
  }
  function unstable_runWithPriority(priorityLevel, eventHandler) {
    switch (priorityLevel) {
      case ImmediatePriority:
      case UserBlockingPriority:
      case NormalPriority:
      case LowPriority:
      case IdlePriority:
        break;
      default:
        priorityLevel = NormalPriority;
    }
    var previousPriorityLevel = currentPriorityLevel;
    var previousEventStartTime = currentEventStartTime;
    currentPriorityLevel = priorityLevel;
    currentEventStartTime = getCurrentTime();
    try {
      return eventHandler();
    } finally {
      currentPriorityLevel = previousPriorityLevel;
      currentEventStartTime = previousEventStartTime;
      flushImmediateWork();
    }
  }
  function unstable_wrapCallback(callback) {
    var parentPriorityLevel = currentPriorityLevel;
    return function() {
      var previousPriorityLevel = currentPriorityLevel;
      var previousEventStartTime = currentEventStartTime;
      currentPriorityLevel = parentPriorityLevel;
      currentEventStartTime = getCurrentTime();
      try {
        return callback.apply(this, arguments);
      } finally {
        currentPriorityLevel = previousPriorityLevel;
        currentEventStartTime = previousEventStartTime;
        flushImmediateWork();
      }
    };
  }
  function unstable_scheduleCallback(callback, deprecated_options) {
    var startTime = currentEventStartTime !== -1 ? currentEventStartTime : getCurrentTime();
    var expirationTime;
    if (typeof deprecated_options === "object" && deprecated_options !== null && typeof deprecated_options.timeout === "number") {
      expirationTime = startTime + deprecated_options.timeout;
    } else {
      switch (currentPriorityLevel) {
        case ImmediatePriority:
          expirationTime = startTime + IMMEDIATE_PRIORITY_TIMEOUT;
          break;
        case UserBlockingPriority:
          expirationTime = startTime + USER_BLOCKING_PRIORITY;
          break;
        case IdlePriority:
          expirationTime = startTime + IDLE_PRIORITY;
          break;
        case LowPriority:
          expirationTime = startTime + LOW_PRIORITY_TIMEOUT;
          break;
        case NormalPriority:
        default:
          expirationTime = startTime + NORMAL_PRIORITY_TIMEOUT;
      }
    }
    var newNode = {
      callback,
      priorityLevel: currentPriorityLevel,
      expirationTime,
      next: null,
      previous: null
    };
    if (firstCallbackNode === null) {
      firstCallbackNode = newNode.next = newNode.previous = newNode;
      ensureHostCallbackIsScheduled();
    } else {
      var next = null;
      var node = firstCallbackNode;
      do {
        if (node.expirationTime > expirationTime) {
          next = node;
          break;
        }
        node = node.next;
      } while (node !== firstCallbackNode);
      if (next === null) {
        next = firstCallbackNode;
      } else if (next === firstCallbackNode) {
        firstCallbackNode = newNode;
        ensureHostCallbackIsScheduled();
      }
      var previous = next.previous;
      previous.next = next.previous = newNode;
      newNode.next = next;
      newNode.previous = previous;
    }
    return newNode;
  }
  function unstable_cancelCallback(callbackNode) {
    var next = callbackNode.next;
    if (next === null) {
      return;
    }
    if (next === callbackNode) {
      firstCallbackNode = null;
    } else {
      if (callbackNode === firstCallbackNode) {
        firstCallbackNode = next;
      }
      var previous = callbackNode.previous;
      previous.next = next;
      next.previous = previous;
    }
    callbackNode.next = callbackNode.previous = null;
  }
  function unstable_getCurrentPriorityLevel() {
    return currentPriorityLevel;
  }
  function unstable_shouldYield() {
    return !currentDidTimeout && (firstCallbackNode !== null && firstCallbackNode.expirationTime < currentExpirationTime || shouldYieldToHost());
  }
  var localDate = Date;
  var localSetTimeout = typeof setTimeout === "function" ? setTimeout : void 0;
  var localClearTimeout = typeof clearTimeout === "function" ? clearTimeout : void 0;
  var localRequestAnimationFrame = typeof requestAnimationFrame === "function" ? requestAnimationFrame : void 0;
  var localCancelAnimationFrame = typeof cancelAnimationFrame === "function" ? cancelAnimationFrame : void 0;
  var getCurrentTime;
  var ANIMATION_FRAME_TIMEOUT = 100;
  var rAFID;
  var rAFTimeoutID;
  var requestAnimationFrameWithTimeout = function(callback) {
    rAFID = localRequestAnimationFrame(function(timestamp) {
      localClearTimeout(rAFTimeoutID);
      callback(timestamp);
    });
    rAFTimeoutID = localSetTimeout(function() {
      localCancelAnimationFrame(rAFID);
      callback(getCurrentTime());
    }, ANIMATION_FRAME_TIMEOUT);
  };
  if (hasNativePerformanceNow) {
    var Performance = performance;
    getCurrentTime = function() {
      return Performance.now();
    };
  } else {
    getCurrentTime = function() {
      return localDate.now();
    };
  }
  var requestHostCallback;
  var cancelHostCallback;
  var shouldYieldToHost;
  if (typeof window !== "undefined" && window._schedMock) {
    var impl = window._schedMock;
    requestHostCallback = impl[0];
    cancelHostCallback = impl[1];
    shouldYieldToHost = impl[2];
  } else if (
    // If Scheduler runs in a non-DOM environment, it falls back to a naive
    // implementation using setTimeout.
    typeof window === "undefined" || // "addEventListener" might not be available on the window object
    // if this is a mocked "window" object. So we need to validate that too.
    typeof window.addEventListener !== "function"
  ) {
    var _callback = null;
    var _currentTime = -1;
    var _flushCallback = function(didTimeout, ms) {
      if (_callback !== null) {
        var cb = _callback;
        _callback = null;
        try {
          _currentTime = ms;
          cb(didTimeout);
        } finally {
          _currentTime = -1;
        }
      }
    };
    requestHostCallback = function(cb, ms) {
      if (_currentTime !== -1) {
        setTimeout(requestHostCallback, 0, cb, ms);
      } else {
        _callback = cb;
        setTimeout(_flushCallback, ms, true, ms);
        setTimeout(_flushCallback, maxSigned31BitInt, false, maxSigned31BitInt);
      }
    };
    cancelHostCallback = function() {
      _callback = null;
    };
    shouldYieldToHost = function() {
      return false;
    };
    getCurrentTime = function() {
      return _currentTime === -1 ? 0 : _currentTime;
    };
  } else {
    if (typeof console !== "undefined") {
      if (typeof localRequestAnimationFrame !== "function") {
        console.error("This browser doesn't support requestAnimationFrame. Make sure that you load a polyfill in older browsers. https://fb.me/react-polyfills");
      }
      if (typeof localCancelAnimationFrame !== "function") {
        console.error("This browser doesn't support cancelAnimationFrame. Make sure that you load a polyfill in older browsers. https://fb.me/react-polyfills");
      }
    }
    var scheduledHostCallback = null;
    var isMessageEventScheduled = false;
    var timeoutTime = -1;
    var isAnimationFrameScheduled = false;
    var isFlushingHostCallback = false;
    var frameDeadline = 0;
    var previousFrameTime = 33;
    var activeFrameTime = 33;
    shouldYieldToHost = function() {
      return frameDeadline <= getCurrentTime();
    };
    var messageKey = "__reactIdleCallback$" + Math.random().toString(36).slice(2);
    var idleTick = function(event) {
      if (event.source !== window || event.data !== messageKey) {
        return;
      }
      isMessageEventScheduled = false;
      var prevScheduledCallback = scheduledHostCallback;
      var prevTimeoutTime = timeoutTime;
      scheduledHostCallback = null;
      timeoutTime = -1;
      var currentTime = getCurrentTime();
      var didTimeout = false;
      if (frameDeadline - currentTime <= 0) {
        if (prevTimeoutTime !== -1 && prevTimeoutTime <= currentTime) {
          didTimeout = true;
        } else {
          if (!isAnimationFrameScheduled) {
            isAnimationFrameScheduled = true;
            requestAnimationFrameWithTimeout(animationTick);
          }
          scheduledHostCallback = prevScheduledCallback;
          timeoutTime = prevTimeoutTime;
          return;
        }
      }
      if (prevScheduledCallback !== null) {
        isFlushingHostCallback = true;
        try {
          prevScheduledCallback(didTimeout);
        } finally {
          isFlushingHostCallback = false;
        }
      }
    };
    window.addEventListener("message", idleTick, false);
    var animationTick = function(rafTime) {
      if (scheduledHostCallback !== null) {
        requestAnimationFrameWithTimeout(animationTick);
      } else {
        isAnimationFrameScheduled = false;
        return;
      }
      var nextFrameTime = rafTime - frameDeadline + activeFrameTime;
      if (nextFrameTime < activeFrameTime && previousFrameTime < activeFrameTime) {
        if (nextFrameTime < 8) {
          nextFrameTime = 8;
        }
        activeFrameTime = nextFrameTime < previousFrameTime ? previousFrameTime : nextFrameTime;
      } else {
        previousFrameTime = nextFrameTime;
      }
      frameDeadline = rafTime + activeFrameTime;
      if (!isMessageEventScheduled) {
        isMessageEventScheduled = true;
        window.postMessage(messageKey, "*");
      }
    };
    requestHostCallback = function(callback, absoluteTimeout) {
      scheduledHostCallback = callback;
      timeoutTime = absoluteTimeout;
      if (isFlushingHostCallback || absoluteTimeout < 0) {
        window.postMessage(messageKey, "*");
      } else if (!isAnimationFrameScheduled) {
        isAnimationFrameScheduled = true;
        requestAnimationFrameWithTimeout(animationTick);
      }
    };
    cancelHostCallback = function() {
      scheduledHostCallback = null;
      isMessageEventScheduled = false;
      timeoutTime = -1;
    };
  }
  var DEFAULT_THREAD_ID = 0;
  var interactionIDCounter = 0;
  var threadIDCounter = 0;
  var interactionsRef = null;
  var subscriberRef = null;
  if (enableSchedulerTracing) {
    interactionsRef = {
      current: /* @__PURE__ */ new Set()
    };
    subscriberRef = {
      current: null
    };
  }
  function unstable_clear(callback) {
    if (!enableSchedulerTracing) {
      return callback();
    }
    var prevInteractions = interactionsRef.current;
    interactionsRef.current = /* @__PURE__ */ new Set();
    try {
      return callback();
    } finally {
      interactionsRef.current = prevInteractions;
    }
  }
  function unstable_getCurrent() {
    if (!enableSchedulerTracing) {
      return null;
    } else {
      return interactionsRef.current;
    }
  }
  function unstable_getThreadID() {
    return ++threadIDCounter;
  }
  function unstable_trace(name, timestamp, callback) {
    var threadID = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : DEFAULT_THREAD_ID;
    if (!enableSchedulerTracing) {
      return callback();
    }
    var interaction = {
      __count: 1,
      id: interactionIDCounter++,
      name,
      timestamp
    };
    var prevInteractions = interactionsRef.current;
    var interactions = new Set(prevInteractions);
    interactions.add(interaction);
    interactionsRef.current = interactions;
    var subscriber = subscriberRef.current;
    var returnValue = void 0;
    try {
      if (subscriber !== null) {
        subscriber.onInteractionTraced(interaction);
      }
    } finally {
      try {
        if (subscriber !== null) {
          subscriber.onWorkStarted(interactions, threadID);
        }
      } finally {
        try {
          returnValue = callback();
        } finally {
          interactionsRef.current = prevInteractions;
          try {
            if (subscriber !== null) {
              subscriber.onWorkStopped(interactions, threadID);
            }
          } finally {
            interaction.__count--;
            if (subscriber !== null && interaction.__count === 0) {
              subscriber.onInteractionScheduledWorkCompleted(interaction);
            }
          }
        }
      }
    }
    return returnValue;
  }
  function unstable_wrap(callback) {
    var threadID = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : DEFAULT_THREAD_ID;
    if (!enableSchedulerTracing) {
      return callback;
    }
    var wrappedInteractions = interactionsRef.current;
    var subscriber = subscriberRef.current;
    if (subscriber !== null) {
      subscriber.onWorkScheduled(wrappedInteractions, threadID);
    }
    wrappedInteractions.forEach(function(interaction) {
      interaction.__count++;
    });
    var hasRun = false;
    function wrapped() {
      var prevInteractions = interactionsRef.current;
      interactionsRef.current = wrappedInteractions;
      subscriber = subscriberRef.current;
      try {
        var returnValue = void 0;
        try {
          if (subscriber !== null) {
            subscriber.onWorkStarted(wrappedInteractions, threadID);
          }
        } finally {
          try {
            returnValue = callback.apply(void 0, arguments);
          } finally {
            interactionsRef.current = prevInteractions;
            if (subscriber !== null) {
              subscriber.onWorkStopped(wrappedInteractions, threadID);
            }
          }
        }
        return returnValue;
      } finally {
        if (!hasRun) {
          hasRun = true;
          wrappedInteractions.forEach(function(interaction) {
            interaction.__count--;
            if (subscriber !== null && interaction.__count === 0) {
              subscriber.onInteractionScheduledWorkCompleted(interaction);
            }
          });
        }
      }
    }
    wrapped.cancel = function cancel() {
      subscriber = subscriberRef.current;
      try {
        if (subscriber !== null) {
          subscriber.onWorkCanceled(wrappedInteractions, threadID);
        }
      } finally {
        wrappedInteractions.forEach(function(interaction) {
          interaction.__count--;
          if (subscriber && interaction.__count === 0) {
            subscriber.onInteractionScheduledWorkCompleted(interaction);
          }
        });
      }
    };
    return wrapped;
  }
  var subscribers = null;
  if (enableSchedulerTracing) {
    subscribers = /* @__PURE__ */ new Set();
  }
  function unstable_subscribe(subscriber) {
    if (enableSchedulerTracing) {
      subscribers.add(subscriber);
      if (subscribers.size === 1) {
        subscriberRef.current = {
          onInteractionScheduledWorkCompleted,
          onInteractionTraced,
          onWorkCanceled,
          onWorkScheduled,
          onWorkStarted,
          onWorkStopped
        };
      }
    }
  }
  function unstable_unsubscribe(subscriber) {
    if (enableSchedulerTracing) {
      subscribers.delete(subscriber);
      if (subscribers.size === 0) {
        subscriberRef.current = null;
      }
    }
  }
  function onInteractionTraced(interaction) {
    var didCatchError = false;
    var caughtError = null;
    subscribers.forEach(function(subscriber) {
      try {
        subscriber.onInteractionTraced(interaction);
      } catch (error) {
        if (!didCatchError) {
          didCatchError = true;
          caughtError = error;
        }
      }
    });
    if (didCatchError) {
      throw caughtError;
    }
  }
  function onInteractionScheduledWorkCompleted(interaction) {
    var didCatchError = false;
    var caughtError = null;
    subscribers.forEach(function(subscriber) {
      try {
        subscriber.onInteractionScheduledWorkCompleted(interaction);
      } catch (error) {
        if (!didCatchError) {
          didCatchError = true;
          caughtError = error;
        }
      }
    });
    if (didCatchError) {
      throw caughtError;
    }
  }
  function onWorkScheduled(interactions, threadID) {
    var didCatchError = false;
    var caughtError = null;
    subscribers.forEach(function(subscriber) {
      try {
        subscriber.onWorkScheduled(interactions, threadID);
      } catch (error) {
        if (!didCatchError) {
          didCatchError = true;
          caughtError = error;
        }
      }
    });
    if (didCatchError) {
      throw caughtError;
    }
  }
  function onWorkStarted(interactions, threadID) {
    var didCatchError = false;
    var caughtError = null;
    subscribers.forEach(function(subscriber) {
      try {
        subscriber.onWorkStarted(interactions, threadID);
      } catch (error) {
        if (!didCatchError) {
          didCatchError = true;
          caughtError = error;
        }
      }
    });
    if (didCatchError) {
      throw caughtError;
    }
  }
  function onWorkStopped(interactions, threadID) {
    var didCatchError = false;
    var caughtError = null;
    subscribers.forEach(function(subscriber) {
      try {
        subscriber.onWorkStopped(interactions, threadID);
      } catch (error) {
        if (!didCatchError) {
          didCatchError = true;
          caughtError = error;
        }
      }
    });
    if (didCatchError) {
      throw caughtError;
    }
  }
  function onWorkCanceled(interactions, threadID) {
    var didCatchError = false;
    var caughtError = null;
    subscribers.forEach(function(subscriber) {
      try {
        subscriber.onWorkCanceled(interactions, threadID);
      } catch (error) {
        if (!didCatchError) {
          didCatchError = true;
          caughtError = error;
        }
      }
    });
    if (didCatchError) {
      throw caughtError;
    }
  }
  var ReactCurrentOwner = {
    /**
     * @internal
     * @type {ReactComponent}
     */
    current: null,
    currentDispatcher: null
  };
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
  var Resolved = 1;
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
  var ReactDebugCurrentFrame = {};
  var currentlyValidatingElement = null;
  function setCurrentlyValidatingElement(element) {
    {
      currentlyValidatingElement = element;
    }
  }
  {
    ReactDebugCurrentFrame.getCurrentStack = null;
    ReactDebugCurrentFrame.getStackAddendum = function() {
      var stack = "";
      if (currentlyValidatingElement) {
        var name = getComponentName(currentlyValidatingElement.type);
        var owner = currentlyValidatingElement._owner;
        stack += describeComponentFrame(name, currentlyValidatingElement._source, owner && getComponentName(owner.type));
      }
      var impl2 = ReactDebugCurrentFrame.getCurrentStack;
      if (impl2) {
        stack += impl2() || "";
      }
      return stack;
    };
  }
  var ReactSharedInternals = {
    ReactCurrentOwner,
    // Used by renderers to avoid bundling object-assign twice in UMD bundles:
    assign: objectAssign
  };
  {
    objectAssign(ReactSharedInternals, {
      Scheduler: {
        unstable_cancelCallback,
        unstable_shouldYield,
        unstable_now: getCurrentTime,
        unstable_scheduleCallback,
        unstable_runWithPriority,
        unstable_wrapCallback,
        unstable_getCurrentPriorityLevel
      },
      SchedulerTracing: {
        __interactionsRef: interactionsRef,
        __subscriberRef: subscriberRef,
        unstable_clear,
        unstable_getCurrent,
        unstable_getThreadID,
        unstable_subscribe,
        unstable_trace,
        unstable_unsubscribe,
        unstable_wrap
      }
    });
  }
  {
    objectAssign(ReactSharedInternals, {
      // These should not be included in production.
      ReactDebugCurrentFrame,
      // Shim for React DOM 16.0.0 which still destructured (but not used) this.
      // TODO: remove in React 17.0.
      ReactComponentTreeHook: {}
    });
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
  var hasOwnProperty$1 = Object.prototype.hasOwnProperty;
  var RESERVED_PROPS = {
    key: true,
    ref: true,
    __self: true,
    __source: true
  };
  var specialPropKeyWarningShown = void 0;
  var specialPropRefWarningShown = void 0;
  function hasValidRef(config) {
    {
      if (hasOwnProperty$1.call(config, "ref")) {
        var getter = Object.getOwnPropertyDescriptor(config, "ref").get;
        if (getter && getter.isReactWarning) {
          return false;
        }
      }
    }
    return config.ref !== void 0;
  }
  function hasValidKey(config) {
    {
      if (hasOwnProperty$1.call(config, "key")) {
        var getter = Object.getOwnPropertyDescriptor(config, "key").get;
        if (getter && getter.isReactWarning) {
          return false;
        }
      }
    }
    return config.key !== void 0;
  }
  function defineKeyPropWarningGetter(props, displayName) {
    var warnAboutAccessingKey = function() {
      if (!specialPropKeyWarningShown) {
        specialPropKeyWarningShown = true;
        warningWithoutStack$1(false, "%s: `key` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://fb.me/react-special-props)", displayName);
      }
    };
    warnAboutAccessingKey.isReactWarning = true;
    Object.defineProperty(props, "key", {
      get: warnAboutAccessingKey,
      configurable: true
    });
  }
  function defineRefPropWarningGetter(props, displayName) {
    var warnAboutAccessingRef = function() {
      if (!specialPropRefWarningShown) {
        specialPropRefWarningShown = true;
        warningWithoutStack$1(false, "%s: `ref` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://fb.me/react-special-props)", displayName);
      }
    };
    warnAboutAccessingRef.isReactWarning = true;
    Object.defineProperty(props, "ref", {
      get: warnAboutAccessingRef,
      configurable: true
    });
  }
  var ReactElement = function(type, key, ref, self, source, owner, props) {
    var element = {
      // This tag allows us to uniquely identify this as a React Element
      $$typeof: REACT_ELEMENT_TYPE,
      // Built-in properties that belong on the element
      type,
      key,
      ref,
      props,
      // Record the component responsible for creating this element.
      _owner: owner
    };
    {
      element._store = {};
      Object.defineProperty(element._store, "validated", {
        configurable: false,
        enumerable: false,
        writable: true,
        value: false
      });
      Object.defineProperty(element, "_self", {
        configurable: false,
        enumerable: false,
        writable: false,
        value: self
      });
      Object.defineProperty(element, "_source", {
        configurable: false,
        enumerable: false,
        writable: false,
        value: source
      });
      if (Object.freeze) {
        Object.freeze(element.props);
        Object.freeze(element);
      }
    }
    return element;
  };
  function createElement2(type, config, children) {
    var propName = void 0;
    var props = {};
    var key = null;
    var ref = null;
    var self = null;
    var source = null;
    if (config != null) {
      if (hasValidRef(config)) {
        ref = config.ref;
      }
      if (hasValidKey(config)) {
        key = "" + config.key;
      }
      self = config.__self === void 0 ? null : config.__self;
      source = config.__source === void 0 ? null : config.__source;
      for (propName in config) {
        if (hasOwnProperty$1.call(config, propName) && !RESERVED_PROPS.hasOwnProperty(propName)) {
          props[propName] = config[propName];
        }
      }
    }
    var childrenLength = arguments.length - 2;
    if (childrenLength === 1) {
      props.children = children;
    } else if (childrenLength > 1) {
      var childArray = Array(childrenLength);
      for (var i = 0; i < childrenLength; i++) {
        childArray[i] = arguments[i + 2];
      }
      {
        if (Object.freeze) {
          Object.freeze(childArray);
        }
      }
      props.children = childArray;
    }
    if (type && type.defaultProps) {
      var defaultProps = type.defaultProps;
      for (propName in defaultProps) {
        if (props[propName] === void 0) {
          props[propName] = defaultProps[propName];
        }
      }
    }
    {
      if (key || ref) {
        var displayName = typeof type === "function" ? type.displayName || type.name || "Unknown" : type;
        if (key) {
          defineKeyPropWarningGetter(props, displayName);
        }
        if (ref) {
          defineRefPropWarningGetter(props, displayName);
        }
      }
    }
    return ReactElement(type, key, ref, self, source, ReactCurrentOwner.current, props);
  }
  function cloneAndReplaceKey(oldElement, newKey) {
    var newElement = ReactElement(oldElement.type, newKey, oldElement.ref, oldElement._self, oldElement._source, oldElement._owner, oldElement.props);
    return newElement;
  }
  function cloneElement2(element, config, children) {
    !!(element === null || element === void 0) ? invariant(false, "React.cloneElement(...): The argument must be a React element, but you passed %s.", element) : void 0;
    var propName = void 0;
    var props = objectAssign({}, element.props);
    var key = element.key;
    var ref = element.ref;
    var self = element._self;
    var source = element._source;
    var owner = element._owner;
    if (config != null) {
      if (hasValidRef(config)) {
        ref = config.ref;
        owner = ReactCurrentOwner.current;
      }
      if (hasValidKey(config)) {
        key = "" + config.key;
      }
      var defaultProps = void 0;
      if (element.type && element.type.defaultProps) {
        defaultProps = element.type.defaultProps;
      }
      for (propName in config) {
        if (hasOwnProperty$1.call(config, propName) && !RESERVED_PROPS.hasOwnProperty(propName)) {
          if (config[propName] === void 0 && defaultProps !== void 0) {
            props[propName] = defaultProps[propName];
          } else {
            props[propName] = config[propName];
          }
        }
      }
    }
    var childrenLength = arguments.length - 2;
    if (childrenLength === 1) {
      props.children = children;
    } else if (childrenLength > 1) {
      var childArray = Array(childrenLength);
      for (var i = 0; i < childrenLength; i++) {
        childArray[i] = arguments[i + 2];
      }
      props.children = childArray;
    }
    return ReactElement(element.type, key, ref, self, source, owner, props);
  }
  function isValidElement2(object) {
    return typeof object === "object" && object !== null && object.$$typeof === REACT_ELEMENT_TYPE;
  }
  var SEPARATOR = ".";
  var SUBSEPARATOR = ":";
  function escape(key) {
    var escapeRegex = /[=:]/g;
    var escaperLookup = {
      "=": "=0",
      ":": "=2"
    };
    var escapedString = ("" + key).replace(escapeRegex, function(match) {
      return escaperLookup[match];
    });
    return "$" + escapedString;
  }
  var didWarnAboutMaps = false;
  var userProvidedKeyEscapeRegex = /\/+/g;
  function escapeUserProvidedKey(text) {
    return ("" + text).replace(userProvidedKeyEscapeRegex, "$&/");
  }
  var POOL_SIZE = 10;
  var traverseContextPool = [];
  function getPooledTraverseContext(mapResult, keyPrefix, mapFunction, mapContext) {
    if (traverseContextPool.length) {
      var traverseContext = traverseContextPool.pop();
      traverseContext.result = mapResult;
      traverseContext.keyPrefix = keyPrefix;
      traverseContext.func = mapFunction;
      traverseContext.context = mapContext;
      traverseContext.count = 0;
      return traverseContext;
    } else {
      return {
        result: mapResult,
        keyPrefix,
        func: mapFunction,
        context: mapContext,
        count: 0
      };
    }
  }
  function releaseTraverseContext(traverseContext) {
    traverseContext.result = null;
    traverseContext.keyPrefix = null;
    traverseContext.func = null;
    traverseContext.context = null;
    traverseContext.count = 0;
    if (traverseContextPool.length < POOL_SIZE) {
      traverseContextPool.push(traverseContext);
    }
  }
  function traverseAllChildrenImpl(children, nameSoFar, callback, traverseContext) {
    var type = typeof children;
    if (type === "undefined" || type === "boolean") {
      children = null;
    }
    var invokeCallback = false;
    if (children === null) {
      invokeCallback = true;
    } else {
      switch (type) {
        case "string":
        case "number":
          invokeCallback = true;
          break;
        case "object":
          switch (children.$$typeof) {
            case REACT_ELEMENT_TYPE:
            case REACT_PORTAL_TYPE:
              invokeCallback = true;
          }
      }
    }
    if (invokeCallback) {
      callback(
        traverseContext,
        children,
        // If it's the only child, treat the name as if it was wrapped in an array
        // so that it's consistent if the number of children grows.
        nameSoFar === "" ? SEPARATOR + getComponentKey(children, 0) : nameSoFar
      );
      return 1;
    }
    var child = void 0;
    var nextName = void 0;
    var subtreeCount = 0;
    var nextNamePrefix = nameSoFar === "" ? SEPARATOR : nameSoFar + SUBSEPARATOR;
    if (Array.isArray(children)) {
      for (var i = 0; i < children.length; i++) {
        child = children[i];
        nextName = nextNamePrefix + getComponentKey(child, i);
        subtreeCount += traverseAllChildrenImpl(child, nextName, callback, traverseContext);
      }
    } else {
      var iteratorFn = getIteratorFn(children);
      if (typeof iteratorFn === "function") {
        {
          if (iteratorFn === children.entries) {
            !didWarnAboutMaps ? warning$1(false, "Using Maps as children is unsupported and will likely yield unexpected results. Convert it to a sequence/iterable of keyed ReactElements instead.") : void 0;
            didWarnAboutMaps = true;
          }
        }
        var iterator = iteratorFn.call(children);
        var step = void 0;
        var ii = 0;
        while (!(step = iterator.next()).done) {
          child = step.value;
          nextName = nextNamePrefix + getComponentKey(child, ii++);
          subtreeCount += traverseAllChildrenImpl(child, nextName, callback, traverseContext);
        }
      } else if (type === "object") {
        var addendum = "";
        {
          addendum = " If you meant to render a collection of children, use an array instead." + ReactDebugCurrentFrame.getStackAddendum();
        }
        var childrenString = "" + children;
        invariant(false, "Objects are not valid as a React child (found: %s).%s", childrenString === "[object Object]" ? "object with keys {" + Object.keys(children).join(", ") + "}" : childrenString, addendum);
      }
    }
    return subtreeCount;
  }
  function traverseAllChildren(children, callback, traverseContext) {
    if (children == null) {
      return 0;
    }
    return traverseAllChildrenImpl(children, "", callback, traverseContext);
  }
  function getComponentKey(component, index) {
    if (typeof component === "object" && component !== null && component.key != null) {
      return escape(component.key);
    }
    return index.toString(36);
  }
  function forEachSingleChild(bookKeeping, child, name) {
    var func = bookKeeping.func, context = bookKeeping.context;
    func.call(context, child, bookKeeping.count++);
  }
  function forEachChildren(children, forEachFunc, forEachContext) {
    if (children == null) {
      return children;
    }
    var traverseContext = getPooledTraverseContext(null, null, forEachFunc, forEachContext);
    traverseAllChildren(children, forEachSingleChild, traverseContext);
    releaseTraverseContext(traverseContext);
  }
  function mapSingleChildIntoContext(bookKeeping, child, childKey) {
    var result = bookKeeping.result, keyPrefix = bookKeeping.keyPrefix, func = bookKeeping.func, context = bookKeeping.context;
    var mappedChild = func.call(context, child, bookKeeping.count++);
    if (Array.isArray(mappedChild)) {
      mapIntoWithKeyPrefixInternal(mappedChild, result, childKey, function(c) {
        return c;
      });
    } else if (mappedChild != null) {
      if (isValidElement2(mappedChild)) {
        mappedChild = cloneAndReplaceKey(
          mappedChild,
          // Keep both the (mapped) and old keys if they differ, just as
          // traverseAllChildren used to do for objects as children
          keyPrefix + (mappedChild.key && (!child || child.key !== mappedChild.key) ? escapeUserProvidedKey(mappedChild.key) + "/" : "") + childKey
        );
      }
      result.push(mappedChild);
    }
  }
  function mapIntoWithKeyPrefixInternal(children, array, prefix, func, context) {
    var escapedPrefix = "";
    if (prefix != null) {
      escapedPrefix = escapeUserProvidedKey(prefix) + "/";
    }
    var traverseContext = getPooledTraverseContext(array, escapedPrefix, func, context);
    traverseAllChildren(children, mapSingleChildIntoContext, traverseContext);
    releaseTraverseContext(traverseContext);
  }
  function mapChildren(children, func, context) {
    if (children == null) {
      return children;
    }
    var result = [];
    mapIntoWithKeyPrefixInternal(children, result, null, func, context);
    return result;
  }
  function countChildren(children) {
    return traverseAllChildren(children, function() {
      return null;
    }, null);
  }
  function toArray(children) {
    var result = [];
    mapIntoWithKeyPrefixInternal(children, result, null, function(child) {
      return child;
    });
    return result;
  }
  function onlyChild(children) {
    !isValidElement2(children) ? invariant(false, "React.Children.only expected to receive a single React element child.") : void 0;
    return children;
  }
  function createContext2(defaultValue, calculateChangedBits) {
    if (calculateChangedBits === void 0) {
      calculateChangedBits = null;
    } else {
      {
        !(calculateChangedBits === null || typeof calculateChangedBits === "function") ? warningWithoutStack$1(false, "createContext: Expected the optional second argument to be a function. Instead received: %s", calculateChangedBits) : void 0;
      }
    }
    var context = {
      $$typeof: REACT_CONTEXT_TYPE,
      _calculateChangedBits: calculateChangedBits,
      // As a workaround to support multiple concurrent renderers, we categorize
      // some renderers as primary and others as secondary. We only expect
      // there to be two concurrent renderers at most: React Native (primary) and
      // Fabric (secondary); React DOM (primary) and React ART (secondary).
      // Secondary renderers store their context values on separate fields.
      _currentValue: defaultValue,
      _currentValue2: defaultValue,
      // Used to track how many concurrent renderers this context currently
      // supports within in a single renderer. Such as parallel server rendering.
      _threadCount: 0,
      // These are circular
      Provider: null,
      Consumer: null
    };
    context.Provider = {
      $$typeof: REACT_PROVIDER_TYPE,
      _context: context
    };
    var hasWarnedAboutUsingNestedContextConsumers = false;
    var hasWarnedAboutUsingConsumerProvider = false;
    {
      var Consumer = {
        $$typeof: REACT_CONTEXT_TYPE,
        _context: context,
        _calculateChangedBits: context._calculateChangedBits
      };
      Object.defineProperties(Consumer, {
        Provider: {
          get: function() {
            if (!hasWarnedAboutUsingConsumerProvider) {
              hasWarnedAboutUsingConsumerProvider = true;
              warning$1(false, "Rendering <Context.Consumer.Provider> is not supported and will be removed in a future major release. Did you mean to render <Context.Provider> instead?");
            }
            return context.Provider;
          },
          set: function(_Provider) {
            context.Provider = _Provider;
          }
        },
        _currentValue: {
          get: function() {
            return context._currentValue;
          },
          set: function(_currentValue) {
            context._currentValue = _currentValue;
          }
        },
        _currentValue2: {
          get: function() {
            return context._currentValue2;
          },
          set: function(_currentValue2) {
            context._currentValue2 = _currentValue2;
          }
        },
        _threadCount: {
          get: function() {
            return context._threadCount;
          },
          set: function(_threadCount) {
            context._threadCount = _threadCount;
          }
        },
        Consumer: {
          get: function() {
            if (!hasWarnedAboutUsingNestedContextConsumers) {
              hasWarnedAboutUsingNestedContextConsumers = true;
              warning$1(false, "Rendering <Context.Consumer.Consumer> is not supported and will be removed in a future major release. Did you mean to render <Context.Consumer> instead?");
            }
            return context.Consumer;
          }
        }
      });
      context.Consumer = Consumer;
    }
    {
      context._currentRenderer = null;
      context._currentRenderer2 = null;
    }
    return context;
  }
  function lazy2(ctor) {
    return {
      $$typeof: REACT_LAZY_TYPE,
      _ctor: ctor,
      // React uses these fields to store the result.
      _status: -1,
      _result: null
    };
  }
  function forwardRef2(render) {
    {
      if (render != null && render.$$typeof === REACT_MEMO_TYPE) {
        warningWithoutStack$1(false, "forwardRef requires a render function but received a `memo` component. Instead of forwardRef(memo(...)), use memo(forwardRef(...)).");
      } else if (typeof render !== "function") {
        warningWithoutStack$1(false, "forwardRef requires a render function but was given %s.", render === null ? "null" : typeof render);
      } else {
        !// Do not warn for 0 arguments because it could be due to usage of the 'arguments' object
        (render.length === 0 || render.length === 2) ? warningWithoutStack$1(false, "forwardRef render functions accept exactly two parameters: props and ref. %s", render.length === 1 ? "Did you forget to use the ref parameter?" : "Any additional parameter will be undefined.") : void 0;
      }
      if (render != null) {
        !(render.defaultProps == null && render.propTypes == null) ? warningWithoutStack$1(false, "forwardRef render functions do not support propTypes or defaultProps. Did you accidentally pass a React component?") : void 0;
      }
    }
    return {
      $$typeof: REACT_FORWARD_REF_TYPE,
      render
    };
  }
  function isValidElementType(type) {
    return typeof type === "string" || typeof type === "function" || // Note: its typeof might be other than 'symbol' or 'number' if it's a polyfill.
    type === REACT_FRAGMENT_TYPE || type === REACT_CONCURRENT_MODE_TYPE || type === REACT_PROFILER_TYPE || type === REACT_STRICT_MODE_TYPE || type === REACT_SUSPENSE_TYPE || typeof type === "object" && type !== null && (type.$$typeof === REACT_LAZY_TYPE || type.$$typeof === REACT_MEMO_TYPE || type.$$typeof === REACT_PROVIDER_TYPE || type.$$typeof === REACT_CONTEXT_TYPE || type.$$typeof === REACT_FORWARD_REF_TYPE);
  }
  function memo2(type, compare) {
    {
      if (!isValidElementType(type)) {
        warningWithoutStack$1(false, "memo: The first argument must be a component. Instead received: %s", type === null ? "null" : typeof type);
      }
    }
    return {
      $$typeof: REACT_MEMO_TYPE,
      type,
      compare: compare === void 0 ? null : compare
    };
  }
  function resolveDispatcher() {
    var dispatcher = ReactCurrentOwner.currentDispatcher;
    !(dispatcher !== null) ? invariant(false, "Hooks can only be called inside the body of a function component.") : void 0;
    return dispatcher;
  }
  function useContext(Context, observedBits) {
    var dispatcher = resolveDispatcher();
    {
      if (Context._context !== void 0) {
        var realContext = Context._context;
        if (realContext.Consumer === Context) {
          warning$1(false, "Calling useContext(Context.Consumer) is not supported, may cause bugs, and will be removed in a future major release. Did you mean to call useContext(Context) instead?");
        } else if (realContext.Provider === Context) {
          warning$1(false, "Calling useContext(Context.Provider) is not supported. Did you mean to call useContext(Context) instead?");
        }
      }
    }
    return dispatcher.useContext(Context, observedBits);
  }
  function useState(initialState) {
    var dispatcher = resolveDispatcher();
    return dispatcher.useState(initialState);
  }
  function useReducer(reducer, initialState, initialAction) {
    var dispatcher = resolveDispatcher();
    return dispatcher.useReducer(reducer, initialState, initialAction);
  }
  function useRef(initialValue) {
    var dispatcher = resolveDispatcher();
    return dispatcher.useRef(initialValue);
  }
  function useEffect(create, inputs) {
    var dispatcher = resolveDispatcher();
    return dispatcher.useEffect(create, inputs);
  }
  function useMutationEffect(create, inputs) {
    var dispatcher = resolveDispatcher();
    return dispatcher.useMutationEffect(create, inputs);
  }
  function useLayoutEffect(create, inputs) {
    var dispatcher = resolveDispatcher();
    return dispatcher.useLayoutEffect(create, inputs);
  }
  function useCallback(callback, inputs) {
    var dispatcher = resolveDispatcher();
    return dispatcher.useCallback(callback, inputs);
  }
  function useMemo(create, inputs) {
    var dispatcher = resolveDispatcher();
    return dispatcher.useMemo(create, inputs);
  }
  function useImperativeMethods(ref, create, inputs) {
    var dispatcher = resolveDispatcher();
    return dispatcher.useImperativeMethods(ref, create, inputs);
  }
  var ReactPropTypesSecret$1 = "SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED";
  var ReactPropTypesSecret_1 = ReactPropTypesSecret$1;
  var printWarning$1 = function() {
  };
  {
    var ReactPropTypesSecret = ReactPropTypesSecret_1;
    var loggedTypeFailures = {};
    printWarning$1 = function(text) {
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
            printWarning$1(
              (componentName || "React class") + ": type specification of " + location + " `" + typeSpecName + "` is invalid; the type checker function must return `null` or an `Error` but returned a " + typeof error + ". You may have forgotten to pass an argument to the type checker creator (arrayOf, instanceOf, objectOf, oneOf, oneOfType, and shape all require an argument)."
            );
          }
          if (error instanceof Error && !(error.message in loggedTypeFailures)) {
            loggedTypeFailures[error.message] = true;
            var stack = getStack ? getStack() : "";
            printWarning$1(
              "Failed " + location + " type: " + error.message + (stack != null ? stack : "")
            );
          }
        }
      }
    }
  }
  var checkPropTypes_1 = checkPropTypes;
  var propTypesMisspellWarningShown = void 0;
  {
    propTypesMisspellWarningShown = false;
  }
  function getDeclarationErrorAddendum() {
    if (ReactCurrentOwner.current) {
      var name = getComponentName(ReactCurrentOwner.current.type);
      if (name) {
        return "\n\nCheck the render method of `" + name + "`.";
      }
    }
    return "";
  }
  function getSourceInfoErrorAddendum(elementProps) {
    if (elementProps !== null && elementProps !== void 0 && elementProps.__source !== void 0) {
      var source = elementProps.__source;
      var fileName = source.fileName.replace(/^.*[\\\/]/, "");
      var lineNumber = source.lineNumber;
      return "\n\nCheck your code at " + fileName + ":" + lineNumber + ".";
    }
    return "";
  }
  var ownerHasKeyUseWarning = {};
  function getCurrentComponentErrorInfo(parentType) {
    var info = getDeclarationErrorAddendum();
    if (!info) {
      var parentName = typeof parentType === "string" ? parentType : parentType.displayName || parentType.name;
      if (parentName) {
        info = "\n\nCheck the top-level render call using <" + parentName + ">.";
      }
    }
    return info;
  }
  function validateExplicitKey(element, parentType) {
    if (!element._store || element._store.validated || element.key != null) {
      return;
    }
    element._store.validated = true;
    var currentComponentErrorInfo = getCurrentComponentErrorInfo(parentType);
    if (ownerHasKeyUseWarning[currentComponentErrorInfo]) {
      return;
    }
    ownerHasKeyUseWarning[currentComponentErrorInfo] = true;
    var childOwner = "";
    if (element && element._owner && element._owner !== ReactCurrentOwner.current) {
      childOwner = " It was passed a child from " + getComponentName(element._owner.type) + ".";
    }
    setCurrentlyValidatingElement(element);
    {
      warning$1(false, 'Each child in an array or iterator should have a unique "key" prop.%s%s See https://fb.me/react-warning-keys for more information.', currentComponentErrorInfo, childOwner);
    }
    setCurrentlyValidatingElement(null);
  }
  function validateChildKeys(node, parentType) {
    if (typeof node !== "object") {
      return;
    }
    if (Array.isArray(node)) {
      for (var i = 0; i < node.length; i++) {
        var child = node[i];
        if (isValidElement2(child)) {
          validateExplicitKey(child, parentType);
        }
      }
    } else if (isValidElement2(node)) {
      if (node._store) {
        node._store.validated = true;
      }
    } else if (node) {
      var iteratorFn = getIteratorFn(node);
      if (typeof iteratorFn === "function") {
        if (iteratorFn !== node.entries) {
          var iterator = iteratorFn.call(node);
          var step = void 0;
          while (!(step = iterator.next()).done) {
            if (isValidElement2(step.value)) {
              validateExplicitKey(step.value, parentType);
            }
          }
        }
      }
    }
  }
  function validatePropTypes(element) {
    var type = element.type;
    var name = void 0, propTypes = void 0;
    if (typeof type === "function") {
      name = type.displayName || type.name;
      propTypes = type.propTypes;
    } else if (typeof type === "object" && type !== null && type.$$typeof === REACT_FORWARD_REF_TYPE) {
      var functionName = type.render.displayName || type.render.name || "";
      name = type.displayName || (functionName !== "" ? "ForwardRef(" + functionName + ")" : "ForwardRef");
      propTypes = type.propTypes;
    } else {
      return;
    }
    if (propTypes) {
      setCurrentlyValidatingElement(element);
      checkPropTypes_1(propTypes, element.props, "prop", name, ReactDebugCurrentFrame.getStackAddendum);
      setCurrentlyValidatingElement(null);
    } else if (type.PropTypes !== void 0 && !propTypesMisspellWarningShown) {
      propTypesMisspellWarningShown = true;
      warningWithoutStack$1(false, "Component %s declared `PropTypes` instead of `propTypes`. Did you misspell the property assignment?", name || "Unknown");
    }
    if (typeof type.getDefaultProps === "function") {
      !type.getDefaultProps.isReactClassApproved ? warningWithoutStack$1(false, "getDefaultProps is only used on classic React.createClass definitions. Use a static property named `defaultProps` instead.") : void 0;
    }
  }
  function validateFragmentProps(fragment) {
    setCurrentlyValidatingElement(fragment);
    var keys = Object.keys(fragment.props);
    for (var i = 0; i < keys.length; i++) {
      var key = keys[i];
      if (key !== "children" && key !== "key") {
        warning$1(false, "Invalid prop `%s` supplied to `React.Fragment`. React.Fragment can only have `key` and `children` props.", key);
        break;
      }
    }
    if (fragment.ref !== null) {
      warning$1(false, "Invalid attribute `ref` supplied to `React.Fragment`.");
    }
    setCurrentlyValidatingElement(null);
  }
  function createElementWithValidation(type, props, children) {
    var validType = isValidElementType(type);
    if (!validType) {
      var info = "";
      if (type === void 0 || typeof type === "object" && type !== null && Object.keys(type).length === 0) {
        info += " You likely forgot to export your component from the file it's defined in, or you might have mixed up default and named imports.";
      }
      var sourceInfo = getSourceInfoErrorAddendum(props);
      if (sourceInfo) {
        info += sourceInfo;
      } else {
        info += getDeclarationErrorAddendum();
      }
      var typeString = void 0;
      if (type === null) {
        typeString = "null";
      } else if (Array.isArray(type)) {
        typeString = "array";
      } else if (type !== void 0 && type.$$typeof === REACT_ELEMENT_TYPE) {
        typeString = "<" + (getComponentName(type.type) || "Unknown") + " />";
        info = " Did you accidentally export a JSX literal instead of a component?";
      } else {
        typeString = typeof type;
      }
      warning$1(false, "React.createElement: type is invalid -- expected a string (for built-in components) or a class/function (for composite components) but got: %s.%s", typeString, info);
    }
    var element = createElement2.apply(this, arguments);
    if (element == null) {
      return element;
    }
    if (validType) {
      for (var i = 2; i < arguments.length; i++) {
        validateChildKeys(arguments[i], type);
      }
    }
    if (type === REACT_FRAGMENT_TYPE) {
      validateFragmentProps(element);
    } else {
      validatePropTypes(element);
    }
    return element;
  }
  function createFactoryWithValidation(type) {
    var validatedFactory = createElementWithValidation.bind(null, type);
    validatedFactory.type = type;
    {
      Object.defineProperty(validatedFactory, "type", {
        enumerable: false,
        get: function() {
          lowPriorityWarning$1(false, "Factory.type is deprecated. Access the class directly before passing it to createFactory.");
          Object.defineProperty(this, "type", {
            value: type
          });
          return type;
        }
      });
    }
    return validatedFactory;
  }
  function cloneElementWithValidation(element, props, children) {
    var newElement = cloneElement2.apply(this, arguments);
    for (var i = 2; i < arguments.length; i++) {
      validateChildKeys(arguments[i], newElement.type);
    }
    validatePropTypes(newElement);
    return newElement;
  }
  var React2 = {
    Children: {
      map: mapChildren,
      forEach: forEachChildren,
      count: countChildren,
      toArray,
      only: onlyChild
    },
    createRef: createRef2,
    Component: Component2,
    PureComponent: PureComponent2,
    createContext: createContext2,
    forwardRef: forwardRef2,
    lazy: lazy2,
    memo: memo2,
    Fragment: REACT_FRAGMENT_TYPE,
    StrictMode: REACT_STRICT_MODE_TYPE,
    Suspense: REACT_SUSPENSE_TYPE,
    createElement: createElementWithValidation,
    cloneElement: cloneElementWithValidation,
    createFactory: createFactoryWithValidation,
    isValidElement: isValidElement2,
    version: ReactVersion,
    __SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED: ReactSharedInternals
  };
  if (enableStableConcurrentModeAPIs) {
    React2.ConcurrentMode = REACT_CONCURRENT_MODE_TYPE;
    React2.Profiler = REACT_PROFILER_TYPE;
  } else {
    React2.unstable_ConcurrentMode = REACT_CONCURRENT_MODE_TYPE;
    React2.unstable_Profiler = REACT_PROFILER_TYPE;
  }
  if (enableHooks) {
    React2.useCallback = useCallback;
    React2.useContext = useContext;
    React2.useEffect = useEffect;
    React2.useImperativeMethods = useImperativeMethods;
    React2.useLayoutEffect = useLayoutEffect;
    React2.useMemo = useMemo;
    React2.useMutationEffect = useMutationEffect;
    React2.useReducer = useReducer;
    React2.useRef = useRef;
    React2.useState = useState;
  }
  var React$2 = Object.freeze({
    default: React2
  });
  var React$3 = React$2 && React2 || React$2;
  var react = React$3.default || React$3;
  return react;
}();
const { Children, createRef, Component, PureComponent, createContext, forwardRef, lazy, memo, Fragment, StrictMode, Suspense, createElement, cloneElement, createFactory, isValidElement, version, __SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED, unstable_ConcurrentMode, unstable_Profiler } = React;
export default React;
export { Children, createRef, Component, PureComponent, createContext, forwardRef, lazy, memo, Fragment, StrictMode, Suspense, createElement, cloneElement, createFactory, isValidElement, version, __SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED, unstable_ConcurrentMode, unstable_Profiler };

