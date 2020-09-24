/** @jsx h */
import { h } from '../src/index'

test('create JSX node', () => {
  const div = <div/>

  expect(div).toStrictEqual({
    type: "div",
    key: null,
    ref: null,
    props: {}
  })
})

test('create JSX node with key and props', () => {
  const div = <input key="foo" name="foo" value="bar"/>

  expect(div).toStrictEqual({
    type: "input",
    key: "foo",
    ref: null,
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
    ref: null,
    props: {
      children: {
        type: "div",
        key: "b",
        ref: null,
        props: {
          children: {
            type: "div",
            key: "c",
            ref: null,
            props: {}
          }
        }
      }
    }
  })
})

test('ignore `true`, `false`, `null` and `undefined` JSX literals', () => {
  const div = <div>{true}{false}{null}{undefined}</div>

  expect(div).toStrictEqual({
    type: "div",
    key: null,
    ref: null,
    props: {}
  })
})

test('merge simple nodes', () => {
  const div = <div>{"hello"}{""}{123}</div>

  expect(div).toStrictEqual({
    type: "div",
    key: null,
    ref: null,
    props: {
      children: { type: "text", props: { nodeValue: "hello123" } },
    }
  })
})

test('ignore nodes mixins simple nodes', () => {
  const div = <div>{"hello"}{true}{false}{""}{null}{undefined}{123}</div>

  expect(div).toStrictEqual({
    type: "div",
    key: null,
    ref: null,
    props: {
      children: { type: "text", props: { nodeValue: "hello123" } },
    }
  })
})

test('emit JSX component nodes', () => {
  const Component = ({ value }) => <input value={value}/>

  const div = <Component value={"foo"}>bar</Component>

  expect(div).toStrictEqual({
    type: Component,
    key: null,
    ref: null,
    props: {
      value: "foo",
      children: {
        type: "text",
        props: { nodeValue: "bar" }
      }
    }
  })
})
