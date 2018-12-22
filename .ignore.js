// const map = new Map()

// function useState(state){
//   var caller = arguments.callee.caller
//   if(!map.has(caller)){
//     map.set(caller,{})
//   }
//   const newState = Object.assign(map.get(caller),state)
//   map.set(caller,newState)

//   return newState
// }

// let a

// function xxx(){
//   a = useState({a:1})
//   console.log(a)
//   a=useState({b:2})
//   console.log(a)
// }

// xxx()





// import { patch } from './pkg/patch'

// let oldNode = {
//   type: 'div',
//   props: {},
//   children: [{ type: 'p', props: {}, children: [0] }]
// }

// let node = {
//   type: 'div',
//   props: {},
//   children: [{ type: 'p', props: {}, children: [1] }]
// }

// let parent = document.body

// let element = document.body.children[0]

// console.log(element)

// patch(parent, element, oldNode, node)


// var element =
// typeof node === "string" || typeof node === "number"
//   ? document.createTextNode(node)
//   : (isSvg = isSvg || node.nodeName === "svg")
//     ? document.createElementNS(
//         "http://www.w3.org/2000/svg",
//         node.nodeName
//       )
//     : document.createElement(node.nodeName)

// var attributes = node.attributes
// if (attributes) {
// if (attributes.oncreate) {
//   lifecycle.push(function() {
//     attributes.oncreate(element)
//   })
// }

// for (var i = 0; i < node.children.length; i++) {
//   element.appendChild(
//     createElement(
//       (node.children[i] = resolveNode(node.children[i])),
//       isSvg
//     )
//   )
// }

// for (var name in attributes) {
//   updateAttribute(element, name, attributes[name], null, isSvg)
// }
// }

// return element