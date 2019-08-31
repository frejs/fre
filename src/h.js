export function h (type, config, ...args) {
  const props = Object.assign({}, config)
  const kids = [...args]
  props.children = kids
    .filter(c => c != null && c !== false)
    .map(c => {
      return c.pop || typeof c === 'object'
        ? c
        : { type: 'text', props: { nodeValue: c } }
    })

  const key = props.key || null

  return { type, props, key }
}
