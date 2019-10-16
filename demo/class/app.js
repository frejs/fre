
import { h, render } from '../../src'
import { Component, useComponent } from './fre-component'

class Counter extends Component {
  constructor (props) {
    super(props)

    this.state = { count: props.count || 0 }
  }

  componentDidMount () {}

  componentDidUpdate () {
    console.log(`[Counter.componentDidUpdate] #${this.props.id} is ${this.state.count}!`)
  }

  componentWillUnmount () {
    console.log(`[Counter.componentWillUnmount] #${this.props.id}`)
  }

  render () {
    const { id, remove } = this.props
    const { count } = this.state

    const setCount = count => this.setState({ count })

    console.log(id)

    return (
      <div>
        Counter {id} is {count}
        &nbsp;
        <button onClick={() => setCount(count + 1)}>➕</button>
        <button onClick={() => setCount(count - 1)}>➖</button>
        &nbsp;
        <button onClick={remove}>❌</button>
      </div>
    )
  }
}

Counter = useComponent(Counter)

let nextId = 3

class App extends Component {
  constructor () {
    super()

    this.state = { counters: [1, 2, 3] }
  }

  render () {
    const { counters } = this.state

    const setCounters = counters => this.setState({ counters })


    return (
      <div>
        {counters.map(id => (
          <Counter key={id} id={id} remove={() => setCounters(counters.filter(c => c !== id))} />
        ))}
        <hr />
        <button onClick={() => setCounters(counters.concat(++nextId))}>Add new</button>
        <button onClick={() => setCounters(counters.slice(0, counters.length - 1))} disabled={counters.length === 1}>
          Remove last
        </button>
        <button onClick={() => setCounters(counters.slice().reverse())}>Reverse</button>
      </div>
    )
  }
}

App = useComponent(App)

render(<App />, document.body)
