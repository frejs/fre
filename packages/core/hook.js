import { rerender } from "./render"

let context = {
  cursor: 0,
  hooks: [],
  update: () => undefined
}

export class Hook {
  cursor = 0
  hooks = []

  constructor(fn, props) {
    this.fn = fn
    this.props = props
  }

  render() {
    const prevContext = context
    try {
      context = this
      this.cursor = 0
      return this.fn(this.props)
    } finally {
      context = prevContext
    }
  }

  update() {
    rerender(this)
  }
}

export function useState(initial) {
  const i = context.cursor++
  if (!context.hooks[i]) {
    context.hooks[i] = {
      state: initial
    }
  }

  const that = context
  return [
    context.hooks[i].state,
    v => {
      that.hooks[i].state =
        typeof state === "function" ? state(context.hooks[i].state) : v
        that.update()
    }
  ]
}
