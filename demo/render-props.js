import { h, render } from '../src'
// const HelloBox = () => <Box render={value => <h1>{value}</h1>} />

const HelloBox = () => (
  <Box>
    {value => {
      return <h1>{value}</h1>
    }}
  </Box>
)

const Box = props => {
  return <div>{props.render('hello world!')}</div>
}

render(<HelloBox />, document.getElementById('root'))
