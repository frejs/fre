export let encodeEntities = s => String(s)
	.replace(/&/g, '&amp;')
	.replace(/</g, '&lt;')
	.replace(/>/g, '&gt;')
	.replace(/"/g, '&quot;')
const JS_TO_CSS = {}
// Convert an Object style to a CSSText string
export function styleObjToCss(s) {
	let str = '';
	for (let prop in s) {
		let val = s[prop];
		if (val!=null) {
			if (str) str += ' '
			// str += jsToCss(prop);
			str += JS_TO_CSS[prop] || (JS_TO_CSS[prop] = prop.replace(/([A-Z])/g,'-$1').toLowerCase());
			str += ': '
			str += val;
			if (typeof val==='number' && IS_NON_DIMENSIONAL.test(prop)===false) {
				str += 'px'
			}
			str += ';';
		}
	}
	return str || undefined
}
export let indent = (s, char) => String(s).replace(/(\n+)/g, '$1' + (char || '\t'))

export let isLargeString = (s, length, ignoreLines) => (String(s).length>(length || 40) || (!ignoreLines && String(s).indexOf('\n')!==-1) || String(s).indexOf('<')!==-1)


export function assign(obj, props) {
	for (let i in props) obj[i] = props[i];
	return obj;
}

export function getChildren(accumulator, children) {
	if (Array.isArray(children)) {
		children.reduce(getChildren, accumulator);
	}
	else if (children!=null && children!==false) {
		accumulator.push(children);
	}
	return accumulator;
}