
export function h(type, props, ...children) {
  return {
    type,
    props,
    key: props.key || null,
    children
  }
}