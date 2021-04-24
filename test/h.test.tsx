/** @jsx h */
import { h } from '../src/index'

test('create JSX node', () => {
  const div = <div/>
  console.log(div)

  expect(div).toStrictEqual({
    type: "div",
    key: undefined,
    ref: undefined,
    props: {}
  })
})

test('create JSX node with key and props', () => {
  const div = <input key="foo" name="foo" value="bar"/>

  expect(div).toStrictEqual({
    type: "input",
    key: "foo",
    ref: undefined,
    props: {
      name: "foo",
      value: "bar"
    }
  })
})

test('create JSX node with children', () => {
  const divs = (
    <div key="a">
      <div key="b">
        <div key="c"/>
      </div>
    </div>
  )

  expect(divs).toStrictEqual({
    type: "div",
    key: "a",
    ref: undefined,
    props: {
      children: {
        type: "div",
        key: "b",
        ref: undefined,
        props: {
          children: {
            type: "div",
            key: "c",
            ref: undefined,
            props: {}
          }
        }
      }
    }
  })
})

test('emit JSX component nodes', () => {
  const Component = ({ value }) => <input value={value}/>

  const div = <Component value={"foo"}>bar</Component>

  expect(div).toStrictEqual({
    type: Component,
    key: undefined,
    ref: undefined,
    props: {
      value: "foo",
      children: {
        type: "text",
        props: { nodeValue: "bar" }
      }
    }
  })
})
