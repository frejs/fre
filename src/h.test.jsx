/** @jsx h */

import { h } from "./h"

test('create JSX node', () => {
  const div = <div/>

  expect(div).toStrictEqual({
    type: "div",
    key: null,
    props: {
      children: []
    }
  })
})

test('create JSX node with key and props', () => {
  const div = <input key="foo" name="foo" value="bar"/>

  expect(div).toStrictEqual({
    type: "input",
    key: "foo",
    props: {
      name: "foo",
      value: "bar",
      children: []
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
    props: {
      children: [
        {
          type: "div",
          key: "b",
          props: {
            children: [
              {
                type: "div",
                key: "c",
                props: {
                  children: []
                }
              }
            ]
          }
        }
      ]
    }
  })
})

test('ignore `true`, `false`, `null` and `undefined` JSX literals', () => {
  const div = <div>{true}{false}{null}{undefined}</div>

  expect(div).toStrictEqual({
    type: "div",
    key: null,
    props: {
      children: []
    }
  })
})

test('emit JSX string/number literals', () => {
  const div = <div>{"hello"}{""}{123}</div>

  expect(div).toStrictEqual({
    type: "div",
    key: null,
    props: {
      children: [
        { type: "text", props: { nodeValue: "hello" } },
        { type: "text", props: { nodeValue: "" } },
        { type: "text", props: { nodeValue: 123 } },
      ]
    }
  })
})

test('emit JSX component nodes', () => {
  const Component = ({ value }) => <input value={value}/>

  const div = <Component value={"foo"}>bar</Component>

  expect(div).toStrictEqual({
    type: Component,
    key: null,
    props: {
      value: "foo",
      children: [
        { type: "text", props: { nodeValue: "bar" } },
      ]
    }
  })
})
