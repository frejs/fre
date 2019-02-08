export const TEXT = 'text'

export function h(tag, config, ...args) {
  const props = Object.assign({}, config)
  const hasChildren = args.length > 0
  const rawChildren = hasChildren ? [].concat(...args) : []
  props.children = rawChildren
    .filter(c => c != null && c !== false)
    .map(c => (c instanceof Object ? c : h(TEXT, { nodeValue: c })))
  return { tag, props }
}
