import { render, ErrorBoundary } from '../../src/index'

function errorFn(error){
  console.error(error)
  return <div>hello</div>
}

function App() {
  return <ErrorBoundary fallback={errorFn}>
    <A/>
  </ErrorBoundary>
}

function A(){
  throw 111
}

render(<App />, document.getElementById('app'))