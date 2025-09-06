export function domToLinkedList(domNode) {
    let head = null
    let tail = null
    const stack = []

    function traverse(node) {
        if (node.nodeType === 8) {
            const name = node.textContent.trim()
            if (!name) return

            if (stack.length && stack[stack.length - 1].data === `$${name}`) {
                stack.pop()
            }
            else {
                const newNode = { data: `$${name}`, next: null, kids: [] }
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
                const newNode = { type: node.tagName.toLowerCase(), next: null, kids: [] }
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
                    const newNode = { type: '#text', props: { nodeValue: text }, next: null, kids: [] }
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
        data: domNode.tagName.toLowerCase(),
        next: head,
        kids: [head]
    }
}