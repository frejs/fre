import { isNew } from './util'

function updateProperty (dom, name, value, newValue) {
  if (name === 'style') {
    for (key in newValue) {
      let style = !newValue || !newValue[key] ? '' : newValue[key]
      dom[name][key] = style
    }
  } else if (name[0] === 'o' && name[1] === 'n') {
    name = name.slice(2).toLowerCase()
    if (value) {
      dom.removeEventListener(name, value)
    }
    dom.addEventListener(name, newValue)
  } else {
    dom.setAttribute(name, newValue)
  }
}

export function updateElement (dom, props, newProps) {
  Object.keys(newProps)
    .filter(isNew(props, newProps))
    .forEach(key => {
      if (key === 'value' || key === 'nodeValue') {
        dom[key] = newProps[key]
      } else {
        updateProperty(dom, key, props[key], newProps[key])
      }
    })
}

export function createElement (fiber) {
  const dom =
    fiber.type === 'text'
      ? document.createTextNode('')
      : document.createElement(fiber.type)
  updateElement(dom, [], fiber.props)
  return dom
}
