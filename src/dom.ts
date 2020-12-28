import { Attributes, DOM, IFiber } from './type'

export const updateElement = <P extends Attributes>(
  dom: DOM,
  oldProps: P,
  newProps: P
) => {
  for (let name in { ...oldProps, ...newProps }) {
    let oldValue = oldProps[name]
    let newValue = newProps[name]

    if (oldValue === newValue || name === 'children') {
    } else if (name === 'style') {
      for (const k in { ...oldValue, ...newValue }) {
        if (!(oldValue && newValue && oldValue[k] === newValue[k])) {
          ;(dom as any)[name][k] = newValue?.[k] || ''
        }
      }
    } else if (name[0] === 'o' && name[1] === 'n') {
      name = name.slice(2).toLowerCase() as Extract<keyof P, string>
      if (oldValue) dom.removeEventListener(name, oldValue)
      dom.addEventListener(name, newValue)
    } else if (name in dom && !(dom instanceof SVGElement)) {
      ;(dom as any)[name] = newValue || ''
    } else if (newValue == null || newValue === false) {
      dom.removeAttribute(name)
    } else {
      dom.setAttribute(name, newValue)
    }
  }
}

export const createElement = <P = Attributes>(fiber: IFiber) => {
  const dom =
    fiber.type === 'text'
      ? document.createTextNode('')
      : fiber.tag & (1 << 4)
      ? document.createElementNS(
          'http://www.w3.org/2000/svg',
          fiber.type as string
        )
      : document.createElement(fiber.type as string)
  updateElement(dom as DOM, {} as P, fiber.props as P)
  return dom
}
