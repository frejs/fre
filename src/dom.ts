import { Attributes, DOM, IFiber } from "./type"
import { isStr, LANE } from "./reconcile"

export const updateElement = <P extends Attributes>(
  dom: DOM,
  aProps: P,
  bProps: P
) => {
  for (let name in { ...aProps, ...bProps }) {
    let a = aProps[name]
    let b = bProps[name]

    if (a === b || name === "children") {
    } else if (name === "style" && !isStr(b)) {
      for (const k in { ...a, ...b }) {
        if (!(a && b && a[k] === b[k])) {
          ; (dom as any)[name][k] = b?.[k] || ""
        }
      }
    } else if (name[0] === "o" && name[1] === "n") {
      name = name.slice(2).toLowerCase() as Extract<keyof P, string>
      if (a) dom.removeEventListener(name, a)
      dom.addEventListener(name, b)
    } else if (name in dom && !(dom instanceof SVGElement)) {
      ; (dom as any)[name] = b || ''
    } else if (b == null || b === false) {
      dom.removeAttribute(name)
    } else {
      dom.setAttribute(name, b)
    }
  }
}

export const createElement = <P = Attributes>(fiber: IFiber) => {
  const dom =
    fiber.type === ""
      ? document.createTextNode("")
      : fiber.lane & LANE.SVG
        ? document.createElementNS(
          "http://www.w3.org/2000/svg",
          fiber.type as string
        )
        : document.createElement(fiber.type as string)
  updateElement(dom as DOM, {} as P, fiber.props as P)
  return dom
}
