import { SVG, merge } from './reconciler'

export function updateElement (dom, oldProps, newProps) {
  const props = merge(oldProps, newProps)
  for (let name in props) {
    if (name === 'children') continue

    const oldValue = oldProps[name]
    const newValue = newProps[name]

    if (name === 'style') {
      for (var k in merge(oldValue, newValue)) {
        oldValue = newValue == null || newValue[k] == null ? '' : newValue[k]
        dom[name][k] = oldValue
      }
    } else if (name[0] === 'o' && name[1] === 'n') {
      name = name.slice(2).toLowerCase()
      if (oldValue) dom.removeEventListener(name, oldValue)
      dom.addEventListener(name, newValue)
    } else if (name in dom && !(dom instanceof SVGElement)) {
      dom[name] = newValue == null ? '' : newValue
    } else if (newValue == null || newValue === false) {
      dom.removeAttribute(name)
    } else {
      dom.setAttribute(name, newValue)
    }
  }
}

export function createElement (fiber) {
  const dom = fiber.type === 'text' 
    ? document.createTextNode(fiber.value) 
    : fiber.tag === SVG 
      ? document.createElementNS('http://www.w3.org/2000/svg', fiber.type) 
      : document.createElement(fiber.type)
  updateElement(dom, {}, fiber.props)
  return dom
}
