'use strict'

function caller() {
  try {
    throw new Error()
  }
  catch (e) {
    try {
      return e.stack.split('at ')[3].split(' ')[0]
    } catch (e) {
      return ''
    }
  }
}

function useState(){
  let caller = caller()
  console.log(caller) //counter
}

function counter(){
  useState()
}

counter()


// function call() {
//   try {
//     throw new Error()
//   } catch (e) {
//     try {
//       return e.stack.match(/Object.(\S*)/)[1]
//     } catch (e) {
//       return ''
//     }
//   }
// }