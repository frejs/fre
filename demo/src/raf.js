// import { useEffect, useLayout, render, h } from '../../src'
// import { render } from "react-dom"
// import { createElement as h, useLayoutEffect as useLayout, useEffect } from "react"
import { h, render } from 'preact'
import {useLayoutEffect as useLayout, useEffect } from 'preact/hooks'

var Root, root, stack

stack = []

Root = function() {
  var start
  start = Date.now()
  useLayout(function() {
    stack.push(['layout', Date.now() - start])
    requestAnimationFrame(function() {
      stack.push(['layout RaF', Date.now() - start])
    })
  })
  useEffect(function() {
    stack.push(['effect', Date.now() - start])
    requestAnimationFrame(function() {
      stack.push(['effect RaF', Date.now() - start])
    })
  })
  return h('div')
}

root = document.createElement('div')

document.body.appendChild(root)

render(h(Root), root)

setTimeout(function() {
  document.write(
    '<br>' +
      stack
        .map(function(x) {
          return x.join(' ')
        })
        .join('<br>') +
      '<br>'
  )
}, 100)
