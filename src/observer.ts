import {Dep} from "./dep"

export class Observer {
    state

    constructor(state: any) {
        this.state = new Proxy(state, {})
        this.observe(this.state)
    }

    observe(state) {
        if (!state || typeof state !== 'object') {
            return
        }
        Object.keys(state).forEach(key => {
            this.defineReactive(state, key, state[key])
            this.observe(state[key])
        })
    }

    defineReactive(obj, key, val) {
        let that = this
        let dep = new Dep()
        Object.defineProperty(obj, key, {
            enumerable: true,
            configurable: true,
            get() {
                dep.clean()

                dep.add(Dep.target)

                return val
            },
            set(newVal) {
                if (newVal !== val) {
                    that.observe(newVal)
                    val = newVal
                    dep.notify()
                }
            }
        })
    }
}