import { h, render, options } from '../src'

function Counter () {
  return 'hello world'
}
options.commitWork = fiber => {
  console.log(fiber)
}

render(<Counter />, document.getElementById('root'))
