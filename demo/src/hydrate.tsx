import { render, useState, h, Fragment } from '../../src/index'

function App() {
  const [count, setCount] = useState(0)
  return (
    <>
      <h1>{count}</h1>
      <button onClick={() => setCount(count + 1)}>+</button>
      <input type="text" />
    </>
  )
}

function walker(node) {
  return document.createTreeWalker(node, NodeFilter.SHOW_ELEMENT, {
    acceptNode: () => NodeFilter.FILTER_ACCEPT,
  })
}

function morph(src, tar) {
  const sw = walker(src)
  const tw = walker(tar)
  const walk = fn => sw.nextNode() && tw.nextNode() && fn() && walk(fn)

  walk(() => {
    const c = sw.currentNode
    const t = tw.currentNode

    if (c.tagName === t.tagName) {
      // TODO more things

      if (document.activeElement === t) {
        requestAnimationFrame(() => c.focus())
      }
    }
    return true
  })
}

function hydrate(vnode, node, config={}) {
  let hydrated = false
  config.done = () => {
    morph(clone, node)
    if (!hydrated) {
      node.parentNode.replaceChild(clone, node)
    }
    hydrated = true
  }
  const clone = node.cloneNode(false)
  render(vnode, clone, config)
}

hydrate(<App />, document.getElementById('app'))

document.querySelector('#focus').focus()

