import { h } from '../h'
import { encodeEntities, styleObjToCss, indent, getChildren } from './util';
import { resetCursor } from '../hooks'
const VOID_ELEMENTS = /^(area|base|br|col|embed|hr|img|input|link|meta|param|source|track|wbr)$/
function attributeHook(name, value, isComponent) {
	let type = typeof value;
	
	// Use render-to-string's built-in handling for these properties
	if (name==='dangerouslySetInnerHTML') return false;

	// always skip null & undefined values, skip false DOM attributes, skip functions if told to
	if (value==null || (type==='function')) return '';

	if (!isComponent && (value===false || ((name==='class' || name==='style') && value===''))) return '';

  let indentChar = '\t';
	if (type!=='string') {
		return indent(`\n${name}={${value}}`, indentChar);
	}
	return `\n${indentChar}${name}="${encodeEntities(value)}"`;
}
export let currentVnode
export default async function renderToString (vnode, isSvgMode, selectValue) {
    if (vnode==null || typeof vnode==='boolean') return ''
    let nodeName = vnode.type,
		props = vnode.props,
    isComponent = false
    resetCursor()
    if ( nodeName === 'text' && props.nodeValue) {
      return encodeEntities(props.nodeValue)
    }
    if (typeof nodeName === 'function') {
      isComponent = true
      currentVnode = vnode
      let tempVnode = nodeName.call(vnode, props)
      if (vnode.hooks.effect.length) {
        resetCursor()
        const {effect} = vnode.hooks
        // 强制转化为promise
        // 对于循环依赖不作处理，直接丢弃
        const cleanups = await Promise.all(effect.map(e => Promise.resolve(e[0]())))
        vnode.hooks.effect = []
        // 强制重新渲染
        tempVnode = nodeName.call(vnode, props)
        // 进行垃圾回收
        cleanups.filter(c => !!c).map(c => c())
      }
      delete vnode.hooks
      currentVnode = null
      return await renderToString(tempVnode, isSvgMode, selectValue)
    }
    // render JSX to HTML
    let s = '', html
    if (props) {
      let attrs = Object.keys(props)
      for (let i=0; i<attrs.length; i++) {
        let name = attrs[i], v = props[name]
        if (name==='children') continue
  
        if (name.match(/[\s\n\\/='"\0<>]/)) continue
  
        if (name==='key' || name==='ref') continue
  
        if (name==='className') {
          name = 'class';
        }
        else if (isSvgMode && name.match(/^xlink:?./)) {
          name = name.toLowerCase().replace(/^xlink:?/, 'xlink:');
        }
  
        if (name==='style' && v && typeof v==='object') {
          v = styleObjToCss(v);
        }
  
        let hooked = attributeHook(name, v, isComponent);
        if (hooked || hooked==='') {
          s += hooked;
          continue;
        }
  
        if (name==='dangerouslySetInnerHTML') {
          html = v && v.__html;
        }
        else if ((v || v===0 || v==='') && typeof v!=='function') {
          if (v===true || v==='') {
            v = name;
            s += ' ' + name;
            continue;
          }
  
          if (name==='value') {
            if (nodeName==='select') {
              selectValue = v;
              continue;
            }
            else if (nodeName==='option' && selectValue==v) {
              s += ` selected`;
            }
          }
          s += ` ${name}="${encodeEntities(v)}"`;
        }
      }
    }
    s = `<${nodeName}${s}>`
    if (String(nodeName).match(/[\s\n\\/='"\0<>]/)) throw s
    let isVoid = String(nodeName).match(VOID_ELEMENTS)
    if (isVoid) s = s.replace(/>$/, ' />')
    let pieces = []

    let children
    if (html) {
      s += html
    } else if (props && getChildren(children = [], props.children).length) {
      for (let i=0; i<children.length; i++) {
        let child = children[i];
        if (child!=null && child!==false) {
          let childSvgMode = nodeName==='svg' ? true : nodeName==='foreignObject' ? false : isSvgMode,
            ret = await renderToString(child, childSvgMode, selectValue)
          // Skip if we received an empty string
          if (ret) {
              pieces.push(ret);
          }
        }
      }
    }
    if (pieces.length) {
      s += pieces.join('');
    }
  
    if (!isVoid) {
      s += `</${nodeName}>`
    }
  
    return s;
}