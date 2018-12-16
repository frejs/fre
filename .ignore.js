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