export const TEXT = 'text'

export function h(tag, props, ...children) {
  props = props ? props : {}
  children = children.length ? [].concat(...children) : []
  props.children = children
    .filter(c => c != null && c !== false)
    .map(c => (c instanceof Object ? c : h(TEXT, { nodeValue: c })))
  return { tag, props }
}
