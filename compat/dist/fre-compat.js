(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('fre')) :
  typeof define === 'function' && define.amd ? define(['exports', 'fre'], factory) :
  (global = global || self, factory(global.fre = {}, global.fre));
}(this, (function (exports, fre) { 'use strict';

  let oldCatchError = fre.options.catchError;
  fre.options.catchError = (fiber, error) => {
    if (!!error && typeof error.then === 'function') {
      fiber.promises = fiber.promises || [];
      fiber.promises.push(error);
      oldCatchError(fiber, error);
    }
  };

  function lazy(loader) {
    let p;
    let comp;
    let err;
    return function Lazy(props) {
      if (!p) {
        p = loader();
        p.then(
          exports => (comp = exports.default || exports),
          e => (err = e)
        );
      }
      if (err) throw err
      if (!comp) throw p
      return fre.jsx(comp, props)
    }
  }

  function Suspense(props) {
    const [suspend, setSuspend] = fre.useState(false);
    fre.useEffect(current => {
      Promise.all(current.promises).then(() => setSuspend(true));
    }, []);
    return [props.children, !suspend && props.fallback]
  }

  exports.Suspense = Suspense;
  exports.lazy = lazy;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=fre-compat.js.map
