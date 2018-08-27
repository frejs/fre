import { Dep } from "./dep"
import { renderComponent } from '../render/diff'

export class Watcher {

    constructor(vm) {
        this.vm = vm
        Dep.target = this
        this.update = this.update.bind(this)

    }
    vm
    update() {
        renderComponent(this.vm)
    }
}