export class Vnode {
    type
    props
    children
    key

    constructor(type: any, props: any, children: any) {
        props = props || {}
        this.type = type
        this.props = props
        this.children = children
        this.key = this.props.key || null
    }
}

export function h(type, props, ...children) {
    return new Vnode(type, props, children)
}