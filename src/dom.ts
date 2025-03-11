import { FiberHost, HTMLElementEx, PropsOf, TAG } from './type'
import { isStr } from './reconcile'

const defaultObj = {} as const

const jointIter = <P extends PropsOf<string>>(
  aProps: P,
  bProps: P,
  callback: (name: string, a: any, b: any) => void
) => {
  aProps = aProps || (defaultObj as P)
  bProps = bProps || (defaultObj as P)
  Object.keys(aProps).forEach((k) => callback(k, aProps[k], bProps[k]))
  Object.keys(bProps).forEach(
    (k) => !aProps.hasOwnProperty(k) && callback(k, undefined, bProps[k])
  )
}

export const updateElement = (
  dom: HTMLElementEx,
  aProps: PropsOf<string>,
  bProps: PropsOf<string>
) => {
  jointIter(aProps, bProps, (name, a, b) => {
    if (a === b || name === 'children') {
    } else if (name === 'style' && !isStr(b)) {
      jointIter(a, b, (styleKey, aStyle, bStyle) => {
        if (aStyle !== bStyle) {
          dom[name][styleKey] = bStyle || ''
        }
      })
    } else if (name[0] === 'o' && name[1] === 'n') {
      name = name.slice(2).toLowerCase()
      if (a) dom.removeEventListener(name, a)
      dom.addEventListener(name, b)
    } else if (name in dom && !(dom instanceof SVGElement)) {
      dom[name] = b || ''
    } else if (b == null || b === false) {
      // @ts-expect-error Property 'removeAttribute' does not exist on type 'Text'.
      dom.removeAttribute(name)
    } else {
      // @ts-expect-error Property 'setAttribute' does not exist on type 'Text'.
      dom.setAttribute(name, b)
    }
  })
}

export const createElement = (fiber: FiberHost) => {
  const dom =
    fiber.type === '#text'
      ? document.createTextNode('')
      : fiber.lane & TAG.SVG
      ? document.createElementNS('http://www.w3.org/2000/svg', fiber.type)
      : document.createElement(fiber.type)
  updateElement(dom, {}, fiber.props)
  return dom
}
