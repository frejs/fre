import { Hook } from "./hook"

const hooks = new WeakMap()

export function render(vdom, el) {
  let component
  if (typeof vdom.type === "function") {
    component = new Hook(vdom.type, vdom.props)
  }
  component ? rerender(component, el) : rerender(vdom, el)
}

export function rerender(component, parent) {
  let vdom = component.render ? component.render() : component
  if (typeof vdom.type === "function") {
    const fn = vdom.type
    let hook = hooks.get(fn)
    if (!hook) {
      hook = class extends Hook {
        constructor() {
          super(fn)
        }
      }
      vdom.type = hook
      hooks.set(fn, hook)
    }
    vdom.type = hook

    console.log(vdom.type.render)
    vdom = component.render()
  }

  if (typeof vdom === "string" || typeof vdom === "number") {
    let dom = document.createTextNode(vdom)
    parent.appendChild(dom)
  } else {
    let dom = document.createElement(vdom.type)

    vdom.children.forEach(child => rerender(child, dom))
    for (let name in vdom.props) {
      setAttrs(dom, name, vdom.props[name])
    }
    if (component.parent) {
      let oldNode =
        component.parent.childNodes[component.parent.childNodes.length - 1]
      component.parent.appendChild(dom)
      component.parent.removeChild(oldNode)
      return
    }

    component.parent = parent
    parent.appendChild(dom)
  }
}

function setAttrs(node, name, value) {
  switch (name) {
    case String(name.match(/on\w+/)):
      name = name.toLowerCase()
      node[name] = value || ""
      break
    case "className":
      name === "class"
      break
    case "key":
      break
    case "value":
      if (
        node.tagName.toUpperCase() === "INPUT" ||
        node.tagName.toUpperCase() === "TEXTAREA"
      ) {
        node.value = value
      } else {
        node.setAttribute(name, value)
      }
      break
    case "style":
      node.style.cssText = value
      break
    default:
      node.setAttribute(name, value)
  }
}
