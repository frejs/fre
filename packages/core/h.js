import { use } from '../hooks/index'

export function h(type, props, ...children) {
  return {
    type: typeof type === 'function' ? use(type) : type,
    props,
    key: props ? props.key : null,
    children
  }
}
