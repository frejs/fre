export function domToLinkedList(domNode) {
    let head = null
    let tail = null
    const stack = []

    function traverse(node) {
        if (node.nodeType === 8) {
            const name = node.textContent.trim()
            if (!name) return

            if (stack.length && stack[stack.length - 1].type === `$${name}`) {
                stack.pop()
            }
            else {
                const newNode = { type: `$${name}`, next: null, kids: [] }
                if (head) {
                    tail.next = newNode
                    tail = newNode
                } else {
                    head = newNode
                    tail = newNode
                }
                if (stack.length) {
                    stack[stack.length - 1].kids.push(newNode)
                }
                stack.push(newNode)
            }
            node.remove()
        }
        else if (stack.length) {
            const currentParent = stack[stack.length - 1]

            if (node.nodeType === 1) {
                const newNode = { type: node.tagName.toLowerCase(), next: null, kids: [], node: node, key: null }
                tail.next = newNode
                tail = newNode
                currentParent.kids.push(newNode)
                stack.push(newNode)

                node.childNodes.forEach(traverse)
                if (stack.length && stack[stack.length - 1].type === newNode.type) {
                    stack.pop()
                }
                return
            }
            else if (node.nodeType === 3) {
                const text = node.textContent.trim()
                if (text) {
                    const newNode = { type: '#text', alternate: { props: { nodeValue: text } }, next: null, kids: [], node: node }
                    tail.next = newNode
                    tail = newNode
                    currentParent.kids.push(newNode)
                }
            }
        }

        node.childNodes.forEach(traverse)
    }

    traverse(domNode)

    return {
        type: domNode.tagName.toLowerCase(),
        node: domNode,
        next: head,
        kids: [head]
    }
}