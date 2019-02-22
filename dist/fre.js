(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = global || self, factory(global.fre = {}));
}(this, function (exports) { 'use strict';

  const TEXT = 'text';

  function h(tag, config, ...args) {
    const props = Object.assign({}, config);
    const hasChildren = args.length > 0;
    const rawChildren = hasChildren ? [].concat(...args) : [];
    props.children = rawChildren
      .filter(c => c != null && c !== false)
      .map(c => (c instanceof Object ? c : h(TEXT, { nodeValue: c })));
    return { tag, props }
  }

  const isEvent = name => name.startsWith('on');
  const isText = name => name === 'nodeValue';
  const isAttribute = name => name === 'class' || name === 'id' || name === 'href' || name === 'target' || name === 'src';
  const isNew = (prev, next) => key => prev[key] !== next[key];

  function updateProperties(dom, prevProps, nextProps) {
    Object.keys(nextProps)
      .filter(isText)
      .filter(isNew(prevProps, nextProps))
      .forEach(name => {
        dom[name] = nextProps[name];
      });

      Object.keys(nextProps)
      .filter(isAttribute)
      .filter(isNew(prevProps, nextProps))
      .forEach(name => {
        dom.setAttribute(name,nextProps[name]);
      });   

    nextProps.style = nextProps.style || {};
    Object.keys(nextProps.style)
      .filter(isNew(prevProps.style, nextProps.style))
      .forEach(key => {
        dom.style[key] = nextProps.style[key];
      });

    Object.keys(nextProps)
      .filter(isEvent)
      .filter(isNew(prevProps, nextProps))
      .forEach(name => {
        const eventType = name.toLowerCase().substring(2);
        dom.addEventListener(eventType, nextProps[name]);
      });
  }

  function createElement(fiber) {
    const isTextElement = fiber.tag === TEXT;
    const dom = isTextElement
      ? document.createTextNode('')
      : document.createElement(fiber.tag);
    updateProperties(dom, [], fiber.props);
    return dom
  }

  let cursor = 0;

  function update(k, r, v) {
    r ? (v = r(this.state[k], v)) : v;
    //这里实现不太理想，之后想办法搞成微任务
    setTimeout(() => scheduleUpdate(this, k, v));
  }
  function resetCursor() {
    cursor = 0;
  }
  function useState(initState) {
    return useReducer(null, initState)
  }
  function useReducer(reducer, initState) {
    let key = '$' + cursor;
    let setter = update.bind(currentInstance, key, reducer);
    if (currentInstance) cursor++;
    let state;
    if (currentInstance) state = currentInstance.state;
    if (typeof state === 'object' && key in state) {
      return [state[key], setter]
    } else {
      if (currentInstance) currentInstance.state[key] = initState;
    }
    let value = initState;
    return [value, setter]
  }

  // 这个实现并不准确
  function useEffect(effect, inputs) {
    if (currentInstance) {
      let key = '$' + cursor;
      currentInstance.effects[key] = effect;
      cursor++;
    }
  }

  const HOST = 'host';
  const HOOK = 'hook';
  const ROOT = 'root';

  const PLACE = 1;
  const DELETE = 2;
  const UPDATE = 3;

  const ENOUGH_TIME = 1;

  const updateQueue = [];
  let nextUnitOfWork = null;
  let pendingCommit = null;
  let currentInstance = null;

  function render(vdom, el) {
    updateQueue.push({
      from: ROOT,
      dom: el,
      newProps: { children: vdom }
    });
    requestIdleCallback(performWork);
  }

  function scheduleUpdate(instance, k, v) {
    instance.state[k] = v;
    updateQueue.push({
      from: HOOK,
      instance,
      state: instance.state
    });
    requestIdleCallback(performWork);
  }

  function performWork(deadline) {
    workLoop(deadline);
    if (nextUnitOfWork || updateQueue.length > 0) {
      requestIdleCallback(performWork);
    }
  }

  function workLoop(deadline) {
    if (!nextUnitOfWork) {
      resetNextUnitOfWork();
    }
    while (nextUnitOfWork && deadline.timeRemaining() > ENOUGH_TIME) {
      nextUnitOfWork = performUnitOfWork(nextUnitOfWork);
    }
    if (pendingCommit) {
      commitAllWork(pendingCommit);
    }
    commitEffects(currentInstance.effects);
  }

  function commitEffects(effects) {
    Object.keys(effects).forEach(key => {
      let effect = effects[key];
      effect();
    });
  }

  function resetNextUnitOfWork() {
    const update = updateQueue.shift();
    if (!update) {
      return
    }

    if (update.state) {
      update.instance.__fiber.state = update.state;
    }
    const root =
      update.from == ROOT
        ? update.dom._rootContainerFiber
        : getRoot(update.instance.__fiber);

    nextUnitOfWork = {
      type: ROOT,
      base: update.dom || root.base,
      props: update.newProps || root.props,
      alternate: root
    };
  }

  function getRoot(fiber) {
    let node = fiber;
    while (node.parent) {
      node = node.parent;
    }
    return node
  }

  function performUnitOfWork(wipFiber) {
    beginWork(wipFiber);
    if (wipFiber.child) {
      return wipFiber.child
    }
    let uow = wipFiber;
    while (uow) {
      completeWork(uow);
      if (uow.sibling) {
        return uow.sibling
      }
      uow = uow.parent;
    }
  }

  function beginWork(wipFiber) {
    if (wipFiber.type == HOOK) {
      updateHOOKComponent(wipFiber);
    } else {
      updateHostComponent(wipFiber);
    }
  }

  function updateHostComponent(wipFiber) {
    if (!wipFiber.base) {
      wipFiber.base = createElement(wipFiber);
    }

    const newChildren = wipFiber.props.children;
    reconcileChildren(wipFiber, newChildren);
  }

  function updateHOOKComponent(wipFiber) {
    let instance = wipFiber.base;
    if (instance == null) {
      instance = wipFiber.base = createInstance(wipFiber);
    } else if (wipFiber.props == instance.props && !wipFiber.state) {
      cloneChildFibers(wipFiber);
    }
    instance.props = wipFiber.props || {};
    instance.state = wipFiber.state || {};
    instance.effects = wipFiber.effects || {};
    currentInstance = instance;
    resetCursor();
    const newChildren = wipFiber.tag(wipFiber.props);
    reconcileChildren(wipFiber, newChildren);
  }

  function arrify(val) {
    return val == null ? [] : Array.isArray(val) ? val : [val]
  }

  function reconcileChildren(wipFiber, newChildren) {
    const elements = arrify(newChildren);

    let index = 0;
    let oldFiber = wipFiber.alternate ? wipFiber.alternate.child : null;
    let newFiber = null;
    while (index < elements.length || oldFiber != null) {
      const prevFiber = newFiber;
      const element = index < elements.length && elements[index];
      const sameTag = oldFiber && element && element.tag == oldFiber.tag;

      if (sameTag) {
        newFiber = {
          tag: oldFiber.tag,
          type: oldFiber.type,
          base: oldFiber.base,
          props: element.props,
          parent: wipFiber,
          alternate: oldFiber,
          state: oldFiber.state,
          effectTag: UPDATE
        };
      }

      if (element && !sameTag) {
        newFiber = {
          tag: element.tag,
          type: typeof element.tag === 'string' ? HOST : HOOK,
          props: element.props,
          parent: wipFiber,
          effectTag: PLACE
        };
      }

      if (oldFiber && !sameTag) {
        oldFiber.effectTag = DELETE;
        wipFiber.effects = wipFiber.effects || [];
        wipFiber.effects.push(oldFiber);
      }

      if (oldFiber) {
        oldFiber = oldFiber.sibling;
      }

      if (index == 0) {
        wipFiber.child = newFiber;
      } else if (prevFiber && element) {
        prevFiber.sibling = newFiber;
      }

      index++;
    }
  }

  function createInstance(fiber) {
    const instance = new fiber.tag(fiber.props);
    instance.__fiber = fiber;
    return instance
  }

  function cloneChildFibers(parentFiber) {
    const oldFiber = parentFiber.alternate;
    if (!oldFiber.child) {
      return
    }

    let oldChild = oldFiber.child;
    let prevChild = null;
    while (oldChild) {
      const newChild = {
        tag: oldChild.tag,
        type: oldChild.type,
        base: oldChild.base,
        props: oldChild.props,
        state: oldChild.state,
        alternate: oldChild,
        parent: parentFiber
      };
      if (prevChild) {
        prevChild.sibling = newChild;
      } else {
        parentFiber.child = newChild;
      }
      prevChild = newChild;
      oldChild = oldChild.sibling;
    }
  }

  function completeWork(fiber) {
    if (fiber.type == HOOK) {
      fiber.base.__fiber = fiber;
    }

    if (fiber.parent) {
      const childEffects = fiber.effects || [];
      const thisEffect = fiber.effectTag != null ? [fiber] : [];
      const parentEffects = fiber.parent.effects || [];
      fiber.parent.effects = parentEffects.concat(childEffects, thisEffect);
    } else {
      pendingCommit = fiber;
    }
  }

  function commitAllWork(fiber) {
    fiber.effects.forEach(f => {
      commitWork(f);
    });
    fiber.base._rootContainerFiber = fiber;
    nextUnitOfWork = null;
    pendingCommit = null;
  }

  function commitWork(fiber) {
    if (fiber.type == ROOT) {
      return
    }

    let domParentFiber = fiber.parent;
    while (domParentFiber.type == HOOK) {
      domParentFiber = domParentFiber.parent;
    }
    const domParent = domParentFiber.base;

    if (fiber.effectTag == PLACE && fiber.type == HOST) {
      domParent.appendChild(fiber.base);
    } else if (fiber.effectTag == UPDATE) {
      updateProperties(fiber.base, fiber.alternate.props, fiber.props);
    } else if (fiber.effectTag == DELETE) {
      commitDELETE(fiber, domParent);
    }
  }

  function commitDELETE(fiber, domParent) {
    let node = fiber;
    while (true) {
      if (node.type == HOOK) {
        node = node.child;
        continue
      }
      domParent.removeChild(node.base);
      while (node != fiber && !node.sibling) {
        node = node.parent;
      }
      if (node == fiber) {
        return
      }
      node = node.sibling;
    }
  }

  exports.h = h;
  exports.render = render;
  exports.useState = useState;
  exports.useReducer = useReducer;
  exports.useEffect = useEffect;

  Object.defineProperty(exports, '__esModule', { value: true });

}));
