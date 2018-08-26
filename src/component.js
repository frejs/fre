import { enqueueSetState } from './set-state-queue'
import { Watcher } from './watcher';
import { Observer } from './observer';

export class Component {
  constructor(props = {}) {
    this.isReactComponent = true

    this.state = {}
    this.props = props
  }

  willMount(){
    new Observer(this.state)
    new Watcher(this)
  }

  setState(stateChange) {
    enqueueSetState(stateChange, this)
  }
}

export default Component
