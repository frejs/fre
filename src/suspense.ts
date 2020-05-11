import { Flag } from './reconciler'
import { Component } from './type'

function Lazy(fn: Component) {
  fn.tag = Flag.LAZY
  return fn
}
