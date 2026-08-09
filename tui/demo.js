import renderer from './render.js'
import { h } from '../node_modules/fre/dist/fre.js'

const { columns: width, rows: height } = process.stdout

// build a fre vnode using fre.h
const vnode = h('block', { display: 'block', width, height }, [
  h('block', { display: 'flex', flexDirection: 'row', gap: 2, alignItems: 'center', justifyContent: 'space-around' }, [
    h('text', { color: 'green' }, 'Left'),
    h('text', { color: 'yellow' }, 'Center'),
    h('text', { color: 'cyan' }, 'Right')
  ]),
  h('block', { display: 'block', marginTop: 1 }, h('text', { color: 'magenta' }, 'Line1\nLine2\nLine3'))
])

function toTuiNode(v) {
  if (v == null) return null
  if (typeof v === 'string' || typeof v === 'number') {
    const text = String(v)
    return {
      props: { children: text },
      children: [],
      measureText(limit) { const lines = text.split('\n'); return { width: Math.max(...lines.map(l=>l.length),0), height: lines.length } }
    }
  }
  if (v.type === '#text') {
    const text = String(v.props?.nodeValue ?? '')
    return {
      props: { children: text },
      children: [],
      measureText(limit) { const lines = text.split('\n'); return { width: Math.max(...lines.map(l=>l.length),0), height: lines.length } }
    }
  }
  const node = { props: v.props || {}, children: [] }
  const kids = Array.isArray(v.props?.children) ? v.props.children : v.props?.children != null ? [v.props.children] : []
  for (const k of kids) {
    const child = typeof k === 'object' && k.type ? toTuiNode(k) : (typeof k === 'string' ? toTuiNode(k) : null)
    if (child) node.children.push(child)
  }
  return node
}

const root = toTuiNode(vnode)
renderer.render(root, { fullscreen: false, print: false })
setTimeout(() => renderer.exit(0), 6000)
