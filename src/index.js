const VTYPE_ELEMENT = 1
const VTYPE_FUNCTION = 2
const REF_SINGLE = 1
const REF_ARRAY = 4
const REF_PARENT = 8

let cursor = 0
let currentVnode = null
let rootRef = null

const isEmpty = (c) =>
    c === null || (Array.isArray(c) && c.length === 0)
const isNonEmptyArray = (c) => Array.isArray(c) && c.length > 0
const isLeaf = (c) => typeof c === "string" || typeof c === "number"
const isElement = (c) => c?.vtype === VTYPE_ELEMENT
const isComponent = (c) => c?.vtype === VTYPE_FUNCTION

function h(type, props, ...children) {
    props = props || {}
    if (children.length) {
        props.children = children.length === 1 ? children[0] : children
    }
    const vtype =
        typeof type === "string"
            ? VTYPE_ELEMENT
            : VTYPE_FUNCTION
    return {
        vtype,
        type,
        props,
        key: props.key
    }
}

function Fragment(props) {
    return props.children
}

function getDomNode(ref) {
    if (ref.type === REF_SINGLE) {
        return ref.node
    } else if (ref.type === REF_ARRAY) {
        return getDomNode(ref.children[0])
    } else if (ref.type === REF_PARENT) {
        return getDomNode(ref.childRef)
    }
}

function getParentNode(ref) {
    if (ref.type === REF_SINGLE) {
        return ref.node.parentNode
    } else if (ref.type === REF_ARRAY) {
        return getParentNode(ref.children[0])
    } else if (ref.type === REF_PARENT) {
        return getParentNode(ref.childRef)
    }
}

function getNextSibling(ref) {
    if (ref.type === REF_SINGLE) {
        return ref.node.nextSibling
    } else if (ref.type === REF_ARRAY) {
        return getNextSibling(ref.children[ref.children.length - 1])
    } else if (ref.type === REF_PARENT) {
        return getNextSibling(ref.childRef)
    }
}

function insertDom(parent, ref, nextSibling) {
    if (ref.type === REF_SINGLE) {
        parent.insertBefore(ref.node, nextSibling)
    } else if (ref.type === REF_ARRAY) {
        ref.children.forEach((ch) => insertDom(parent, ch, nextSibling))
    } else if (ref.type === REF_PARENT) {
        insertDom(parent, ref.childRef, nextSibling)
    }
}

function removeDom(parent, ref) {
    if (ref.type === REF_SINGLE) {
        parent.removeChild(ref.node)
    } else if (ref.type === REF_ARRAY) {
        ref.children.forEach((ch) => removeDom(parent, ch))
    } else if (ref.type === REF_PARENT) {
        removeDom(parent, ref.childRef)
    }
}

function reconcileAttributes(dom, newProps, oldProps, isSvg) {
    for (var key in newProps) {
        if (key === "key" || key === "children") continue
        var oldValue = oldProps[key]
        var newValue = newProps[key]
        if (oldValue !== newValue) {
            if (key[0] === 'o' && key[1] === 'n') {
                dom[key.toLowerCase()] = newValue
            } else {
                setDOMAttribute(dom, key, newValue, isSvg.isSVG)
            }
        }
    }
    for (key in oldProps) {
        if (key === "key" || key === "children" || key in newProps) {
            continue
        }
        if (key[0] === 'o' && key[1] === 'n') {
            dom[key.toLowerCase()] = null
        } else {
            dom.removeAttribute(key)
        }
    }
}

function setDOMAttribute(el, name, value, isSvg) {
    if (value === true) {
        el.setAttribute(name, "")
    } else if (value === false) {
        el.removeAttribute(name)
    } else {
        isSvg ? (el[name] = value) : el.setAttribute(name, value)
    }
}

function mount(vnode, isSvg) {
    if (isEmpty(vnode)) {
        return {
            type: REF_SINGLE,
            node: document.createComment("NULL"),
        }
    } else if (isLeaf(vnode)) {
        return {
            type: REF_SINGLE,
            node: document.createTextNode(vnode),
        }
    } else if (isElement(vnode)) {
        let node
        let { type, props } = vnode

        isSvg = isSvg || type === 'svg'

        node = isSvg ?
            document.createElementNS("http://www.w3.org/2000/svg", type) :
            document.createElement(type)

        for (var key in props) {
            if (key === "key" || key === "children") continue
            if (key[0] === 'o' && key[1] === 'n') {
                node[key.toLowerCase()] = props[key]
            } else {
                setDOMAttribute(node, key, props[key], isSvg)
            }
        }

        let childrenRef = props.children == null ? null : mount(props.children, isSvg)
        childrenRef && insertDom(node, childrenRef)
        return {
            type: REF_SINGLE,
            node,
            children: childrenRef,
        }
    } else if (isNonEmptyArray(vnode)) {
        return {
            type: REF_ARRAY,
            children: vnode.map((child) => mount(child, isSvg)),
        }
    } else if (isComponent(vnode)) {
        currentVnode = vnode
        let childVnode = vnode.type(vnode.props)
        cursor = 0

        let childRef = mount(childVnode, isSvg)

        if (vnode.hooks) {
            sideEffect(vnode.hooks.layout)
            setTimeout(() => sideEffect(vnode.hooks.effect), 0)
        }

        return {
            type: REF_PARENT,
            childRef,
            childVnode,
        }
    } else if (vnode instanceof Node) {
        return {
            type: REF_SINGLE,
            node: vnode,
        }
    }
}

function reconcile(
    parent,
    newVnode,
    oldVnode,
    ref,
    isSvg
) {
    if (oldVnode === newVnode && !newVnode.dirty) {
        return ref
    } else if (isEmpty(newVnode) && isEmpty(oldVnode)) {
        return ref
    } else if (isLeaf(newVnode) && isLeaf(oldVnode)) {
        ref.node.nodeValue = newVnode
        return ref
    } else if (
        isElement(newVnode) &&
        isElement(oldVnode) &&
        newVnode.type === oldVnode.type
    ) {
        isSvg = isSvg || newVnode.type === 'svg'
        reconcileAttributes(ref.node, newVnode.props, oldVnode.props, isSvg)
        let oldCh = oldVnode.props.children
        let newCh = newVnode.props.children
        if (oldCh == null) {
            if (newCh != null) {
                ref.children = mount(newCh, isSvg)
                insertDom(ref.node, ref.children)
            }
        } else {
            if (newCh == null) {
                ref.node.textContent = ""
                ref.children = null
            } else {
                ref.children = reconcile(
                    ref.node,
                    newCh,
                    oldCh,
                    ref.children,
                    isSvg
                )
            }
        }
        return ref
    } else if (isNonEmptyArray(newVnode) && isNonEmptyArray(oldVnode)) {
        reconcileChildren(parent, newVnode, oldVnode, ref, isSvg)
        return ref
    } else if (
        isComponent(newVnode) &&
        isComponent(oldVnode) &&
        newVnode.type === oldVnode.type
    ) {

        let fn = newVnode.type
        let shouldUpdate = newVnode.dirty || (fn.shouldUpdate != null
            ? fn.shouldUpdate(oldVnode.props, newVnode.props)
            : defaultShouldUpdate(oldVnode.props, newVnode.props))

        if (shouldUpdate) {
            currentVnode = newVnode
            let childVnode = fn(newVnode.props)
            cursor = 0
            let childRef = reconcile(
                parent,
                childVnode,
                ref.childVnode,
                ref.childRef,
                isSvg
            )
            if (newVnode.hooks) {
                sideEffect(newVnode.hooks.layout)
                setTimeout(() => sideEffect(newVnode.hooks.effect), 0)
            }
            if (childRef !== ref.childRef) {
                return {
                    type: REF_PARENT,
                    childRef,
                    childVnode,
                }
            } else {
                ref.childVnode = childVnode
                return ref
            }
        } else {
            return ref
        }
    } else if (newVnode instanceof Node && oldVnode instanceof Node) {
        ref.node = newVnode
        return ref
    } else {
        return mount(newVnode, isSvg)
    }
}

function sideEffect(effects) {
    effects.forEach(e => e[2] && e[2]())
    effects.forEach(e => (e[2] = e[0]()))
    effects.length = 0
}

function reconcileChildren(parent, newCh, oldch, ref, isSvg) {
    const nextNode = getNextSibling(ref)
    const children = Array(newCh.length)
    let refChildren = ref.children
    let newHead = 0,
        oldHead = 0,
        newTail = newCh.length - 1,
        oldTail = oldch.length - 1
    let oldVnode, newVnode, oldRef, newRef, refMap

    while (newHead <= newTail && oldHead <= oldTail) {
        if (refChildren[oldHead] === null) {
            oldHead++
            continue
        }
        if (refChildren[oldTail] === null) {
            oldTail--
            continue
        }

        oldVnode = oldch[oldHead]
        newVnode = newCh[newHead]
        if (newVnode?.key === oldVnode?.key) {
            oldRef = refChildren[oldHead]
            newRef = children[newHead] = reconcile(
                parent,
                newVnode,
                oldVnode,
                oldRef,
                isSvg
            )
            newHead++
            oldHead++
            continue
        }

        oldVnode = oldch[oldTail]
        newVnode = newCh[newTail]
        if (newVnode?.key === oldVnode?.key) {
            oldRef = refChildren[oldTail]
            newRef = children[newTail] = reconcile(
                parent,
                newVnode,
                oldVnode,
                oldRef,
                isSvg
            )
            newTail--
            oldTail--
            continue
        }

        if (refMap == null) {
            refMap = {}
            for (let i = oldHead; i <= oldTail; i++) {
                oldVnode = oldch[i]
                if (oldVnode?.key != null) {
                    refMap[oldVnode.key] = i
                }
            }
        }
        newVnode = newCh[newHead]
        const idx = newVnode?.key != null ? refMap[newVnode.key] : null
        if (idx != null) {
            oldVnode = oldch[idx]
            oldRef = refChildren[idx]
            newRef = children[newHead] = reconcile(
                parent,
                newVnode,
                oldVnode,
                oldRef,
                isSvg
            )
            insertDom(parent, newRef, getDomNode(refChildren[oldHead]))
            if (newRef !== oldRef) {
                removeDom(parent, oldRef)
            }
            refChildren[idx] = null
        } else {
            newRef = children[newHead] = mount(newVnode, isSvg)
            insertDom(parent, newRef, getDomNode(refChildren[oldHead]))
        }
        newHead++
    }

    const beforeNode =
        newTail < newCh.length - 1
            ? getDomNode(children[newTail + 1])
            : nextNode
    while (newHead <= newTail) {
        const newRef = mount(newCh[newHead], isSvg)
        children[newHead] = newRef
        insertDom(parent, newRef, beforeNode)
        newHead++
    }
    while (oldHead <= oldTail) {
        oldRef = refChildren[oldHead]
        if (oldRef != null) {
            removeDom(parent, oldRef)
        }
        oldHead++
    }
    ref.children = children
}

function defaultShouldUpdate(a, b) {
    for (let i in a) if (!(i in b)) return true
    for (let i in b) if (a[i] !== b[i]) return true
}

function render(vnode, parent) {
    if (rootRef == null) {
        const ref = mount(vnode, false)
        rootRef = { ref, vnode }
        parent.textContent = ""
        insertDom(parent, ref, null)
    } else {
        rootRef.ref = reconcile(
            parent,
            vnode,
            rootRef.vnode,
            rootRef.ref,
            false
        )
        rootRef.vnode = vnode
    }
}

const useState = (initState) => {
    return useReducer(null, initState)
}

const useReducer = (
    reducer,
    initState
) => {
    const [hook, c] = getHook(cursor++)
    if (hook.length === 0) {
        hook[0] = initState
        hook[1] = (value) => {
            let v = reducer
                ? reducer(hook[0], value)
                : typeof value === 'function'
                    ? value(hook[0])
                    : value
            if (hook[0] !== v) {
                hook[0] = v
                c.dirty = true
                requestAnimationFrame(() => render(c, rootRef))
            }
        }
    }
    return hook
}

const useEffect = (cb, deps) => {
    return effectImpl(cb, deps, "effect")
}

const useLayout = (cb, deps) => {
    return effectImpl(cb, deps, "layout")
}

const effectImpl = (cb, deps, key) => {
    const [hook, current] = getHook(cursor++)
    if (isChanged(hook[1], deps)) {
        hook[0] = cb
        hook[1] = deps
        current.hooks[key].push(hook)
    }
}

const useMemo = (cb, deps) => {
    const hook = getHook(cursor++)[0]
    if (isChanged(hook[1], deps)) {
        hook[1] = deps
        return (hook[0] = cb())
    }
    return hook[0]
}

const useCallback = (cb, deps) => {
    return useMemo(() => cb, deps)
}

const useRef = (current) => {
    return useMemo(() => ({ current }), [])
}

const isChanged = (a, b) => {
    return !a || a.length !== b.length || b.some((arg, index) => !Object.is(arg, a[index]))
}

const getHook = (
    cursor
) => {
    const hooks =
        currentVnode.hooks || (currentVnode.hooks = { list: [], effect: [], layout: [] })
    if (cursor >= hooks.list.length) {
        hooks.list.push([])
    }
    return [hooks.list[cursor], currentVnode]
}

export { Fragment, getParentNode, h, render, useState, useEffect, useLayout, useCallback, useMemo, useReducer, useRef }