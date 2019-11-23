import {renderToString,h} from '../src'

function App(){
  return <div>hello world</div>
}

let html = renderToString(<App/>)
console.log(html)