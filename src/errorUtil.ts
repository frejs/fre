interface ICaughtError extends Error {
  error?: Promise<any>;
}
let caughtError: ICaughtError = null;
let freErrorNode: Node = document.createElement("fre");
let hasRegisterListener = false;

const eventType = "fre-error";

function dispatchEvent(cb) {
  const evt = document.createEvent("customEvent");
  //@ts-ignore
  evt.initCustomEvent(eventType, false, true, cb);
  freErrorNode.dispatchEvent(evt);
}

export function registerErrorListener() {
  if (hasRegisterListener) {
    return;
  }

  hasRegisterListener = true;

  const handleError = (error) => {
    caughtError = error;
  };
  window.addEventListener("error", handleError);

  freErrorNode.addEventListener(eventType, (event: CustomEvent) => {
    if (typeof event.detail === "function") {
      event.detail();
    }
  });
}

export function invokeGuardedCallback(fn: () => any, context?, ...args) {
  dispatchEvent(fn.bind(context, ...args));
}

export function getCaughtError() {
  return caughtError;
}

export function clearCaughtError() {
  caughtError = null;
}
