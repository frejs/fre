import { h, Fragment } from './dist/fre.js'
export { Fragment }
export const jsx = function(type, props, key) {
    return h(type, {...props, key});
}
export const jsxs = function(type, props, key) {
    return h(type, {...props, key});
}