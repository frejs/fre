import {diff} from './diff'

interface Vnode {
    type: any
    props: any
    children: any[]

}

function render(vnode: Vnode, container, node) {
    return diff(node, vnode, container)
}

export default render
