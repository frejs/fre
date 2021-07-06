import { h, useState } from "../src/index"
import { testUpdates } from "./test-util"

export const update = async (t) => {
  let updates = 0

  const Component = () => {
    const [count, setState] = useState(0)
    updates++
    const asyncUp = () => {
      for (let i = 0; i <= 10; i++) {
        setState(() => i)
      }
    }
    return <button onClick={asyncUp}>{count}</button>
  }

  await testUpdates([
    {
      content: <Component />,
      test: ([button]) => {
        t.eq(+button.textContent, 0)
        t.eq(updates, 1)
        button.click()
        updates = 0
      },
    },
    {
      content: <Component />,
      test: ([button]) => {
        t.eq(+button.textContent, 10)
        t.eq(updates, 2)
      },
    },
  ])
}

export const handler = async (t) => {
  let clicks = 0

  const handler = () => (clicks += 1)

  await testUpdates([
    {
      content: <button onclick={handler}>OK</button>,
      test: ([button]) => {
        button.click()

        t.eq(clicks, 1)
      },
    },
    {
      content: <button>OK</button>,
      test: ([button]) => {
        button.click()

        t.eq(clicks, 1)
      },
    },
  ])
}

export const style = async (t) => {
  await testUpdates([
    {
      content: <div style={{ color: "red", backgroundColor: "blue" }} />,
      test: ([div]) => {
        t.eq(div.style.color, "red")
        t.eq(div.style.backgroundColor, "blue")
      },
    },
    {
      content: <div style={{ color: "yellow", fontSize: "99px" }} />,
      test: ([div]) => {
        t.eq(div.style.color, "yellow")
        t.eq(div.style.backgroundColor, "")
        t.eq(div.style.fontSize, "99px")
      },
    },
    {
      content: <div />,
      test: ([div]) => {
        t.eq(div.style.color, "")
      },
    },
  ])
}

export const dom = async (t) => {
  let lastChildren = []

  await testUpdates([
    {
      content: (
        <ul>
          <li class="foo" />
          <li className="bar" />
          <li data-something="baz" data-remove-me tabIndex={123} />
        </ul>
      ),
      test: (elements) => {
        t.eq(elements[0].tagName, "UL")
        t.eq(elements[0].children.length, 3)
        t.eq(elements[0].children[0].getAttribute("class"), "foo")
        t.eq(elements[0].children[1].className, "bar")
        t.eq(elements[0].children[2].getAttribute("data-something"), "baz")
        t.eq(elements[0].children[2].hasAttribute("data-remove-me"), true)
        t.eq(elements[0].children[2].tabIndex, 123)

        lastChildren = [...elements[0].children]
      },
    },
    {
      content: (
        <ul>
          <li class="foo2" />
          <li className="bar2" />
          <li data-something="baz2" tabIndex={99} />
        </ul>
      ),
      test: (elements) => {
        t.eq(elements[0].tagName, "UL")
        t.eq(elements[0].children.length, 3)
        t.eq(elements[0].children[0].getAttribute("class"), "foo2")
        t.eq(elements[0].children[1].className, "bar2")
        t.eq(elements[0].children[2].getAttribute("data-something"), "baz2")
        t.eq(elements[0].children[2].hasAttribute("data-remove-me"), false)
        t.eq(elements[0].children[2].tabIndex, 99)

        lastChildren.forEach((lastChild, index) =>
          t.eq(elements[0].children[index], lastChild)
        )
      },
    },
    {
      content: "removed",
      test: ([text]) => {
        t.eq(text.textContent, "removed")
      },
    },
  ])
}
