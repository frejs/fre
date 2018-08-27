export function setAttr(node: any, name: string, value: string) {
    if (/on\w+/.test(name)) {
        name = name.toLowerCase()
        node[name] = value
    } else {
        switch (name) {
            case 'className':
                name = 'class'
                node[name] = value
                break
            case 'value':
                if (node.tagName.toUpperCase() === 'INPUT' || node.tagName.toUpperCase() === 'TEXTAREA') {
                    node.value = value
                } else {
                    node.setAttribute(name, value)
                }
                break
            case 'style':
                node.style.cssText = value
                break
            default:
                node.setAttribute(name, value)
                break
        }
    }

}