import { isNew } from './util'

function updateProperty (element, name, value, newValue) {
  if (name === 'children' || name === 'key') {
  } else if (name === 'style') {
    Object.keys(newValue).forEach(key => {
      let style = !newValue || !newValue[key] ? '' : newValue[key]
      element[name][key] = style
    })
  } else if (name[0] === 'o' && name[1] === 'n') {
    name = name.slice(2).toLowerCase()
    if (value) {
      element.removeEventListener(name, value)
    }
    element.addEventListener(name, newValue)
  } else {
    element.setAttribute(name, newValue)
  }
}

export function updateElement (element, props, newProps) {
  Object.keys(newProps)
    .filter(isNew(props, newProps)) // 进行一层浅比较
    .forEach(key => {
      if (key === 'value' || key === 'nodeValue') {
        element[key] = newProps[key]
      } else {
        updateProperty(element, key, props[key], newProps[key])
      }
    })
}

export function createElement (fiber) {
  const element =
    fiber.type === 'text'
      ? document.createTextNode('')
      : document.createElement(fiber.type)
  updateElement(element, [], fiber.props)
  return element
}