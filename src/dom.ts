import { Props, Fiber, Dom } from './type'
import { Flag } from './reconciler'

export function updateElement(dom: Dom, oldProps: Props, newProps: Props) {
  for (let name in { ...oldProps, ...newProps }) {
    let oldValue = oldProps[name]
    let newValue = newProps[name]

    if (oldValue == newValue || name === 'children' || name === 's') {
    } else if (name === 'style') {
      for (const k in { ...oldValue, ...newValue }) {
        if (!(oldValue && newValue && oldValue[k] === newValue[k])) {
          dom[name][k] = (newValue && newValue[k]) || ''
        }
      }
    } else if (name[0] === 'o' && name[1] === 'n') {
      name = name.slice(2).toLowerCase()
      if (oldValue) dom.removeEventListener(name, oldValue)
      dom.addEventListener(name, newValue)
    } else if (name in dom && !(dom instanceof SVGElement)) {
      (dom as Dom)[name] = newValue == null ? '' : newValue
    } else if (newValue == null || newValue === false) {
      dom.removeAttribute(name)
    } else {
      dom.setAttribute(name, newValue)
    }
  }
}

export function createElement(fiber: Fiber) {
  const dom =
    fiber.type === 'text'
      ? document.createTextNode(fiber.props.s)
      : fiber.tag === Flag.SVG
      ? document.createElementNS('http://www.w3.org/2000/svg', fiber.type)
      : document.createElement(fiber.type)
  updateElement(dom as Dom, {}, fiber.props)
  return dom as Dom
}
