/** @jsx h */
import { h } from '../src/index'
import { testRender } from './test-util'

const toString = elements => elements.map(child => child.outerHTML).join('')

test('render nested HTML elements, apply attributes', async () => {
  const elements = await testRender(
    <div>
      <span class="foo">test</span>
    </div>
  )

  expect(toString(elements)).toBe(`<div><span class="foo">test</span></div>`)
})

test('apply props to object properties', async () => {
  const elements = await testRender(<input defaultChecked />)

  expect(elements[0].defaultChecked).toBe(true)
})

test('render range of HTML elements', async () => {
  const elements = await testRender(
    <ul>
      <li>1</li>
      <li>2</li>
      <li>3</li>
    </ul>
  )

  expect(toString(elements)).toBe('<ul><li>1</li><li>2</li><li>3</li></ul>')
})
