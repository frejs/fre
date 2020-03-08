/** @jsx h */
/** @jsxFrag Fragment */
import { h, Fragment } from '../src/index'
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

test('render 3D array', async () => {
  const elements = await testRender(
    <ul>
      {Array(2)
        .fill()
        .map((_, i) =>
          Array(2)
            .fill()
            .map((_, j) =>
              Array(2)
                .fill()
                .map((_, k) => (
                  <li>
                    {i},{j},{k}
                  </li>
                ))
            )
        )}
    </ul>
  )

  expect(toString(elements)).toBe(
    '<ul><li>0,0,0</li><li>0,0,1</li><li>0,1,0</li><li>0,1,1</li><li>1,0,0</li><li>1,0,1</li><li>1,1,0</li><li>1,1,1</li></ul>'
  )
})

test('render fragment', async () => {
  const elements = await testRender(
    <>
      <li>1</li>
      <li>2</li>
    </>
  )

  expect(toString(elements)).toBe('<li>1</li><li>2</li>')
})
