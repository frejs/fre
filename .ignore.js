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