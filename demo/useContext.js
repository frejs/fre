import { useContext, Context, render, h } from 'fre'

function App () {
  const context = useContext(Context)
  return <main>{context}</main>
}

render(
  <Context value='hello world!'>
    <App />
  </Context>,
  document.body
)
