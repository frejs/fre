let state = {
  a: {
    b: 'c'
  }
}

let path = ['a', 'b']

function get(path, source) {
  for (let i = 0; i < path.length; i++) {
    source = source[path[i]]
  }

  return source
}

function set(path, source, value) {
  let target = {}
  if (patch.length) {
    target[path[0]] =
      path.length > 1 ? set(path.slice(1), source[0], value) : value
    return { ...source, ...target }
  }
  return value
}

console.log(set(path, state, 'd')) //返回修改后的 state
console.log(get(path, state)) //返回对应路径的 state