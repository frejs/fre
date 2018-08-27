import {Dep} from "./dep"
import {renderComponent} from './diff'

export class Watcher {
    vm

    constructor(vm) {
        this.vm = vm
        Dep.target = this
        this.update = this.update.bind(this)

    }

    update() {
        renderComponent(this.vm)
    }
}