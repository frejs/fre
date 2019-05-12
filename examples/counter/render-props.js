import { h, render } from '../../src'
const HelloBox = () => (
  <Box>
    {value => {
      return <h1>{value}</h1>
    }}
  </Box>
)

const Box = props => {
  console.log(props)
  return <div>{props.children('hello world!')}</div>
}


render(<HelloBox />, document.getElementById('root'))