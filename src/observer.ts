import {Dep} from "./dep"

export class Observer {
    constructor(state: any) {
        this.observe(state)
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
                if (Dep.target) {
                    dep.add(Dep.target)
                }
                Dep.target = null
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