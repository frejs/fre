import { TEXT } from './h'

const isEvent = name => name.startsWith('on')
const isText = name => name === 'nodeValue'
const isAttribute = name =>
  name === 'class' ||
  name === 'id' ||
  name === 'href' ||
  name === 'target' ||
  name === 'src'
const isNew = (prev, next) => key => prev[key] !== next[key]

export function updateProperties(dom, prevProps, nextProps) {
  Object.keys(nextProps)
    .filter(isText)
    .filter(isNew(prevProps, nextProps))
    .forEach(name => {
      dom[name] = nextProps[name]
    })

  Object.keys(nextProps)
    .filter(isAttribute)
    .filter(isNew(prevProps, nextProps))
    .forEach(name => {
      dom.setAttribute(name, nextProps[name])
    })

  nextProps.style = nextProps.style || {}
  Object.keys(nextProps.style)
    .filter(isNew(prevProps.style, nextProps.style))
    .forEach(key => {
      dom.style[key] = nextProps.style[key]
    })

  Object.keys(nextProps)
    .filter(isEvent)
    .filter(isNew(prevProps, nextProps))
    .forEach(name => {
      const eventType = name.toLowerCase().substring(2)
      dom.addEventListener(eventType, nextProps[name])
    })
}

export function createElement(fiber) {
  const isTextElement = fiber.tag === TEXT
  const dom = isTextElement
    ? document.createTextNode('')
    : document.createElement(fiber.tag)
  updateProperties(dom, [], fiber.props)
  return dom
}
