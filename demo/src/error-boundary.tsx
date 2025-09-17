import { render, ErrorBoundary, h } from '../../src/index'

function ErrorFn(props){
  return <div>{props.error.message}</div>
}

function App() {
  return <div>
    <ErrorBoundary fallback={ErrorFn}>
      <A/>
    </ErrorBoundary>
    <ErrorBoundary fallback={<div>occur an error when render A </div>}>
      <A/>
    </ErrorBoundary>
    <ErrorFn error={{message:'error rendering'}} />
  </div>
}

function A(){
  throw new Error('render error test')
}

render(<App />, document.getElementById('app'))