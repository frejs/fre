const isEvent = name => name[0] === 'o' && name[1] === 'n'
const isText = name => name === 'value'
const isOther = name =>
  name !== 'value' && name[0] !== 'o' && name[1] !== 'n' && name !== 'children'
const isNew = (prev, next) => key => prev[key] !== next[key]

export function updateProperties (dom, prevProps, nextProps) {
  Object.keys(nextProps)
    .filter(isText)
    .filter(isNew(prevProps, nextProps))
    .forEach(name => (dom['nodeValue'] = nextProps[name]))

  Object.keys(nextProps)
    .filter(isOther)
    .filter(isNew(prevProps, nextProps))
    .forEach(name => {
      dom.setAttribute(name, nextProps[name])
    })

  // 移除原有事件
  Object.keys(prevProps)
    .filter(isEvent)
    .forEach(name => {
      const eventType = name.toLowerCase().substring(2)
      dom.removeEventListener(eventType, prevProps[name])
    })

  Object.keys(nextProps)
    .filter(isEvent)
    .filter(isNew(prevProps, nextProps))
    .forEach(name => {
      const eventType = name.toLowerCase().substring(2)
      dom.addEventListener(eventType, nextProps[name])
    })
}

export function createElement (fiber) {
  const element =
    fiber.type === 'text'
      ? document.createTextNode('')
      : document.createElement(fiber.type)
  updateProperties(element, [], fiber.props)
  return element
}
