import {Watcher} from './watcher'
import {Observer} from './observer'

export class Component {
    state
    props

    constructor(props: any = {}) {

        this.state = {}
        this.props = props
    }

    willMount() {
        new Observer(this.state)
        new Watcher(this)
    }

}

export default Component
