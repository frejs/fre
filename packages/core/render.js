import { Hook } from "./hook"

export function render(vdom, el) {
  let component
  if (typeof vdom.type === "function") {
    component = new Hook(vdom.type)
  }
  component ? rerender(component, el) : rerender(vdom, el)
}

export function rerender(component, el) {
  let vdom = component.render ? component.render() : component

  if (typeof vdom.type === "function") {
    component = new Hook(vdom.type)
    vdom = component.render()
  }

  if (typeof vdom === "string" || typeof vdom === "number") {
    let dom = document.createTextNode(vdom)
    el.appendChild(dom)
  } else {
    let dom = document.createElement(vdom.type)

    vdom.children.forEach(child => rerender(child, dom))
    for (let name in vdom.props) {
      setAttrs(dom, name, vdom.props[name])
    }
    if (component.el) {
      component.el.innerHTML = null
      component.el.appendChild(dom)
      return
    }

    console.log(component)
    component.el = el
    el.appendChild(dom)
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
