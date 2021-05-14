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
        type: "",
        props: { nodeValue: "bar" }
      }
    }
  })

  const svg = (
    <svg viewBox="0 0 240 80" xmlns="http://www.w3.org/2000/svg">
      <text x="20" y="35">fre</text>
    </svg>
  );

  expect(svg).toStrictEqual({
    type: 'svg',
    key: null,
    ref: null,
    props: {
      viewBox: '0 0 240 80',
      xmlns: 'http://www.w3.org/2000/svg',
      children: {
        type: 'text',
        key: null,
        ref: null,
        props: {
          x: '20',
          y: '35',
          children: {
            type: '',
            props: { nodeValue: 'fre' }
          }
        }
      }
    }
  })
})
