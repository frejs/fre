// complie tagged template to vnode , thanks htm

const CACHE = {}
const TEMPLATE = document.createElement('template')
const reg = /(\$_h\[\d+\])/g

export default function html(statics) {
  const tpl = CACHE[statics] || (CACHE[statics] = build(statics))
  return tpl(this, arguments)
}

function build(statics) {
  let str = statics[0],
    i = 1
  while (i < statics.length) {
    str += '$_h[' + i + ']' + statics[i++]
  }
  TEMPLATE.innerHTML = str
    .replace(/<(?:(\/)\/|(\/?)(\$_h\[\d+\]))/g, '<$1$2c c@=$3')
    .replace(/<([\w:-]+)(?:\s[^<>]*?)?(\/?)>/g,(str, name, a) => str.replace(/(?:'.*?'|".*?"|([A-Z]))/g, (s, c) => (c ? ':::' + c : s)) + (a ? '</' + name + '>' : ''))
    .replace(/[\r\n]|\ \ +/g,'')
    .trim()

  return Function('h','$_h','return ' + walk((TEMPLATE.content || TEMPLATE).firstChild))
}

function walk(n) {
  if (n.nodeType != 1) {
    if (n.nodeType == 3 && n.data) return field(n.data, ',')
    return 'null'
  }

  let str = '',
    nodeName = field(n.localName, str),
    sub = '',
    start = ',({'

  for (let i = 0; i < n.attributes.length; i++) {
    const name = n.attributes[i].name
    const value = n.attributes[i].value

    if (name == 'c@') {
      nodeName = value
    } else if (name.substring(0,3) == '...') {
      sub = ''
      start = ',Object.assign({'
      str += '},' + name.substring(3) + ',{'
    } else {
      str += `${sub}"${name.replace(/:::(\w)/g, (s, i) => i.toUpperCase())}":${value ? field(value, '+') : true}`
      sub = ','
    }
  }

  str = 'h(' + nodeName + start + str + '})'
  let child = n.firstChild
  while (child) {
    str += ',' + walk(child)
    child = child.nextSibling
  }

  return str + ')'
}

function field(value, sep) {
  const matches = value.match(reg)
  let strValue = JSON.stringify(value)
  
  if (matches != null) {
    if (matches[0] === value) return value
    strValue = strValue.replace(reg, `"${sep}$1${sep}"`).replace(/"[+,]"/g, '')
    if (sep == ',') strValue = `[${strValue}]`
  }

  return strValue
}
