import { useState, useEffect, useRef, useMemo, useCallback, h, memo, render } from "../../src/index"

// 注入样式
const styleSheet = document.createElement("style")
styleSheet.textContent = `
.container {
  position: absolute;
  transform-origin: 0 0;
  left: 50%;
  top: 50%;
  width: 10px;
  height: 10px;
  background: #eee;
}

.dot {
  position: absolute;
  background: #61dafb;
  font: normal 15px sans-serif;
  text-align: center;
  cursor: pointer;
}
`
document.head.appendChild(styleSheet)

// Dot 组件
const Dot = memo(({ x, y, size, text }) => {
  const [hover, setHover] = useState(false)

  const dotStyle = useMemo(() => {
    const s = size * 1.3
    return {
      width: `${s}px`,
      height: `${s}px`,
      left: `${x}px`,
      top: `${y}px`,
      borderRadius: `${s / 2}px`,
      lineHeight: `${s}px`,
      background: hover ? "#ff0" : "#61dafb"
    }
  }, [x, y, size, hover])

  const handleMouseEnter = useCallback(() => setHover(true), [])
  const handleMouseLeave = useCallback(() => setHover(false), [])

  return (
    <div
      className="dot"
      style={dotStyle}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {hover ? `*${text}*` : text}
    </div>
  )
})

// Sierpinski 三角形组件
const targetSize = 25

// 同步计算
const getValue = (key, kid) => {
  const number = kid.props.nodeValue
  return number
}

const SierpinskiTriangle = memo(({ x, y, s, children }) => {
  const number = getValue(`${x}-${y}-${s}-${children}`, children)

  if (s <= targetSize) {
    return (
      <Dot
        x={x - targetSize / 2}
        y={y - targetSize / 2}
        size={targetSize}
        text={number}
      />
    )
  }

  const newSize = s / 2

  return (
    <div>
      <SierpinskiTriangle x={x} y={y - newSize / 2} s={newSize}>
        {children}
      </SierpinskiTriangle>
      <SierpinskiTriangle x={x - newSize} y={y + newSize / 2} s={newSize}>
        {children}
      </SierpinskiTriangle>
      <SierpinskiTriangle x={x + newSize} y={y + newSize / 2} s={newSize}>
        {children}
      </SierpinskiTriangle>
    </div>
  )
})

// 主应用组件（移除 forwardRef）
const App = () => {
  const [seconds, setSeconds] = useState(0)
  const [elapsed, setElapsed] = useState(0)
  const startTime = useRef(new Date().getTime())

  // 定时器逻辑
  useEffect(() => {
    // 更新秒数
    const secondInterval = setInterval(() => {
      setSeconds((prev) => (prev % 10) + 1)
    }, 1000)

    // 更新动画时间
    const frameInterval = setInterval(() => {
      setElapsed(new Date().getTime() - startTime.current)
    }, 16)

    return () => {
      clearInterval(secondInterval)
      clearInterval(frameInterval)
    }
  }, [])

  // 计算缩放变换
  const t = (elapsed / 1000) % 10
  const scale = 1 + (t > 5 ? 10 - t : t) / 10
  const transform = `scaleX(${scale / 2.1}) scaleY(0.7) translateZ(0.1px)`

  return (
    <div>
      <h1>Fre Time Slicing</h1>
      <div className="container" style={{ transform }}>
        <SierpinskiTriangle x={0} y={0} s={1000}>
          {seconds}
        </SierpinskiTriangle>
      </div>
    </div>
  )
}

// 渲染入口
render(<App />, document.body)