const isEvent = name => name.startsWith('on')
const isText = name => name === 'value'
const isNew = (prev, next) => key => prev[key] !== next[key]

export function updateProperties (dom, prevProps, nextProps) {
  // 更新文字内容
  Object.keys(nextProps)
    .filter(isText)
    .forEach(name => (dom['nodeValue'] = nextProps[name]))

  Object.keys(nextProps)
    .filter(!isEvent && !isText)
    .filter(isNew(prevProps, nextProps))
    .forEach(name => dom.setAttribute(name, nextProps[name]))

  // 移除原有事件
  Object.keys(prevProps)
    .filter(isEvent)
    .filter(key => !(key in nextProps) || isNew(prevProps, nextProps)(key))
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
