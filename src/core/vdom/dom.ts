export function setAttr(node: any, name: string, value: string) {
    if (/on\w+/.test(name)) {
        name = name.toLowerCase()
        node[name] = value
    } else {
        switch (name) {
            case 'className':
                name = 'class'
                node.setAttribute(name, value)
                break
            case 'value':
                if (node.tagName.toUpperCase() === 'input' || node.tagName.toUpperCase() === 'textarea') {
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