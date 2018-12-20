import htm from './html'

export function h(type, props, ...children) {
  return {
    type,
    props,
    key: props.key || null,
    children
  }
}

export const html = htm.bind(h)
