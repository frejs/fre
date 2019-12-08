import { useState, useMemo } from '../../src'

export class Component {
  constructor(props) {
    this.props = props
  }
}

export function useComponent(Component) {
  return function(props) {
    const component = useMemo(() => new Component(props), [])

    let [state, setState] = useState(component.state)

    component.props = props
    component.state = state
    component.setState = setState

    return component.render()
  }
}
