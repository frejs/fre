import { rerender } from "./render"

let context = []

export class Hook {
  cursor
  hooks = []

  constructor(fn) {
    this.fn = fn
  }

  render(...args) {
    try {
      context.push(this)
      this.cursor = 0
      return this.fn(...args)
    } finally {
      context.pop()
    }
  }

  update() {
    rerender(this)
  }
}

export function useState(initial) {
  const component = context[context.length - 1]
  const i = component.cursor++
  if (!component.hooks[i]) {
    component.hooks[i] = {
      state: initial
    }
  }

  return [
    component.hooks[i].state,
    v => {
      component.hooks[i].state = v
      component.update()
    }
  ]
}
