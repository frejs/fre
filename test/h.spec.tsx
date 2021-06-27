import { test } from 'zora'
import { h } from '../src/index'

test('h', t => {
  const div = <div />
  const input = <input key="foo" name="foo" value="bar" />
  t.eq(div, {
    type: "div",
    key: null,
    ref: null,
    props: {}
  })
  t.eq(input, {
    type: "input",
    key: "foo",
    ref: null,
    props: {
      name: "foo",
      value: "bar"
    }
  })
  const svg = (
    <svg viewBox="0 0 240 80" xmlns="http://www.w3.org/2000/svg">
      <text x="20" y="35">fre</text>
    </svg>
  );

  t.eq(svg, {
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

test('h2', t => {
  const divs = (
    <div key="a">
      <div key="b">
        <div key="c" />
      </div>
    </div>
  )

  t.eq(divs, {
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

test('h3', t => {
  const Component = ({ value }) => <input value={value} />

  const div = <Component value={"foo"}>bar</Component>

  t.eq(div, {
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
})