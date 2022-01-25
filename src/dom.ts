import { Attributes, DOM, IFiber } from './type'
import { isStr, LANE } from './reconcile'

const defaultObj = {} as const

const jointIter = <P extends Attributes>(
  aProps: P,
  bProps: P,
  callback: (name: string, a: any, b: any) => void
) => {
  aProps = aProps || defaultObj as P
  bProps = bProps || defaultObj as P
  Object.keys(aProps).forEach(k => callback(k, aProps[k], bProps[k])) 
  Object.keys(bProps).forEach(k => !aProps.hasOwnProperty(k) && callback(k,undefined, bProps[k])) 
}

export const updateElement = <P extends Attributes>(
  dom: DOM,
  aProps: P,
  bProps: P
) => {
  jointIter(aProps, bProps, (name, a, b) => {
    if (a === b || name === 'children') {
    } else if (name === 'style' && !isStr(b)) {
      jointIter(a, b, (styleKey, aStyle, bStyle) => {
        if (aStyle !== bStyle) {
          ;(dom as any)[name][styleKey] = bStyle || ''
        }
      })
    } else if (name[0] === 'o' && name[1] === 'n') {
      name = name.slice(2).toLowerCase() as Extract<keyof P, string>
      if (a) dom.removeEventListener(name, a)
      dom.addEventListener(name, b)
    } else if (name in dom && !(dom instanceof SVGElement)) {
      ;(dom as any)[name] = b || ''
    } else if (b == null || b === false) {
      dom.removeAttribute(name)
    } else {
      dom.setAttribute(name, b)
    }
  })
}

export const createElement = <P = Attributes>(fiber: IFiber) => {
  const dom =
    fiber.type === '#text'
      ? document.createTextNode('')
      : fiber.lane & LANE.SVG
      ? document.createElementNS(
          'http://www.w3.org/2000/svg',
          fiber.type as string
        )
      : document.createElement(fiber.type as string)
  updateElement(dom as DOM, {} as P, fiber.props as P)
  return dom
}
