export function h(tag, props, ...children) {
  props = props ? props : {}
  children = children.length ? [].concat(...children) : []
  props.children = children
    .filter(c => c != null && c !== false)
    .map(c => (c instanceof Object ? c : h('text', { nodeValue: c })))
  return { tag, props }
}
